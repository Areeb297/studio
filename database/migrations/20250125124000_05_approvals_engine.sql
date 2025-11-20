-- =============================================
-- MIGRATION: 05 - Approvals Engine (Multi-Level Workflow)
-- =============================================
-- Creates approval workflow with 3-level routing based on thresholds
-- L1: <50K, L2: 50K-200K, L3 (GM): >200K (unlimited)
-- =============================================
-- Created: 2025-01-25
-- Version: 1.0
-- Dependencies: 01_rbac_core.sql, 03_p2p_workflow.sql
-- =============================================

-- =============================================
-- STEP 1: CREATE APPROVALS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS approvals (
  approval_id BIGSERIAL PRIMARY KEY,
  doc_type TEXT NOT NULL CHECK (doc_type IN ('PR', 'PO', 'ADJUSTMENT', 'TRANSFER')),
  doc_id BIGINT NOT NULL,
  level INT NOT NULL CHECK (level IN (1, 2, 3)),
  approver UUID REFERENCES user_profiles(id),
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Cancelled')),
  comments TEXT,
  decided_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT chk_decision_data CHECK (
    (status IN ('Approved', 'Rejected') AND decided_at IS NOT NULL) OR
    (status = 'Pending')
  )
);

COMMENT ON TABLE approvals IS 'Multi-level approval workflow for PRs, POs, Adjustments, Transfers';
COMMENT ON COLUMN approvals.level IS '1 = <50K, 2 = 50K-200K, 3 = >200K (GM unlimited)';
COMMENT ON COLUMN approvals.status IS 'Pending: Awaiting decision, Approved: Accepted, Rejected: Denied, Cancelled: Withdrawn';

-- Prevent duplicate approvals
CREATE UNIQUE INDEX IF NOT EXISTS uq_approval ON approvals(doc_type, doc_id, level, approver)
  WHERE status = 'Pending';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_approvals_doc ON approvals(doc_type, doc_id);
CREATE INDEX IF NOT EXISTS idx_approvals_approver ON approvals(approver);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON approvals(status);
CREATE INDEX IF NOT EXISTS idx_approvals_level ON approvals(level);
CREATE INDEX IF NOT EXISTS idx_approvals_pending ON approvals(approver, status) WHERE status = 'Pending';

-- =============================================
-- STEP 2: CREATE APPROVAL THRESHOLDS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS approval_thresholds (
  threshold_id SERIAL PRIMARY KEY,
  doc_type TEXT NOT NULL CHECK (doc_type IN ('PR', 'PO', 'ADJUSTMENT', 'TRANSFER')),
  level INT NOT NULL CHECK (level IN (1, 2, 3)),
  min_amount NUMERIC DEFAULT 0 CHECK (min_amount >= 0),
  max_amount NUMERIC CHECK (max_amount IS NULL OR max_amount > min_amount),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_threshold_doc_level UNIQUE (doc_type, level, is_active)
);

COMMENT ON TABLE approval_thresholds IS 'Configurable approval thresholds per document type';
COMMENT ON COLUMN approval_thresholds.max_amount IS 'NULL = unlimited (for Level 3)';

-- Insert default thresholds
INSERT INTO approval_thresholds (doc_type, level, min_amount, max_amount) VALUES
  -- Purchase Requisitions
  ('PR', 1, 0, 50000),
  ('PR', 2, 50000, 200000),
  ('PR', 3, 200000, NULL),
  -- Purchase Orders
  ('PO', 1, 0, 50000),
  ('PO', 2, 50000, 200000),
  ('PO', 3, 200000, NULL),
  -- Stock Adjustments
  ('ADJUSTMENT', 1, 0, 50000),
  ('ADJUSTMENT', 2, 50000, 200000),
  ('ADJUSTMENT', 3, 200000, NULL)
ON CONFLICT DO NOTHING;

-- =============================================
-- STEP 3: CREATE APPROVAL ROUTING FUNCTIONS
-- =============================================

-- Function: Determine approval level based on amount
CREATE OR REPLACE FUNCTION get_approval_level(
  p_doc_type TEXT,
  p_amount NUMERIC
)
RETURNS INT AS $$
DECLARE
  v_level INT;
BEGIN
  -- Get level based on thresholds
  SELECT level INTO v_level
  FROM approval_thresholds
  WHERE doc_type = p_doc_type
    AND is_active = true
    AND p_amount >= min_amount
    AND (max_amount IS NULL OR p_amount < max_amount)
  LIMIT 1;

  -- Default to Level 3 if no match (safety fallback)
  RETURN COALESCE(v_level, 3);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_approval_level(TEXT, NUMERIC) IS 'Determine approval level based on document type and amount';

-- Function: Find approver for a specific level
CREATE OR REPLACE FUNCTION find_approver_for_level(p_level INT)
RETURNS UUID AS $$
DECLARE
  v_approver_id UUID;
BEGIN
  -- Level 1: approval_limit >= 50000
  -- Level 2: approval_limit >= 200000
  -- Level 3: approval_limit IS NULL (GM = unlimited)

  IF p_level = 1 THEN
    SELECT id INTO v_approver_id
    FROM user_profiles
    WHERE is_active = true
      AND approval_limit >= 50000
    ORDER BY approval_limit ASC
    LIMIT 1;

  ELSIF p_level = 2 THEN
    SELECT id INTO v_approver_id
    FROM user_profiles
    WHERE is_active = true
      AND approval_limit >= 200000
      AND approval_limit < 999999999  -- Not GM
    ORDER BY approval_limit ASC
    LIMIT 1;

  ELSIF p_level = 3 THEN
    SELECT id INTO v_approver_id
    FROM user_profiles
    WHERE is_active = true
      AND approval_limit IS NULL  -- GM has NULL = unlimited
    ORDER BY created_at ASC
    LIMIT 1;

  END IF;

  RETURN v_approver_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION find_approver_for_level(INT) IS 'Find an active approver with appropriate approval_limit for the level';

-- Function: Route approval to appropriate level
CREATE OR REPLACE FUNCTION route_approval(
  p_doc_type TEXT,
  p_doc_id BIGINT,
  p_amount NUMERIC
)
RETURNS VOID AS $$
DECLARE
  v_level INT;
  v_approver_id UUID;
BEGIN
  -- Determine approval level
  v_level := get_approval_level(p_doc_type, p_amount);

  -- Find approver
  v_approver_id := find_approver_for_level(v_level);

  IF v_approver_id IS NULL THEN
    RAISE EXCEPTION 'No approver found for level % (doc_type: %, amount: %)', v_level, p_doc_type, p_amount;
  END IF;

  -- Create approval record
  INSERT INTO approvals (doc_type, doc_id, level, approver, status)
  VALUES (p_doc_type, p_doc_id, v_level, v_approver_id, 'Pending');

END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION route_approval(TEXT, BIGINT, NUMERIC) IS 'Route document to appropriate approver based on amount thresholds';

-- =============================================
-- STEP 4: CREATE TRIGGER - PR APPROVAL ROUTING
-- =============================================

CREATE OR REPLACE FUNCTION trg_pr_route_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- Only route if status changed to 'Pending' (submitted for approval)
  IF NEW.status = 'Pending' AND (OLD.status IS NULL OR OLD.status != 'Pending') THEN
    -- Route based on estimated amount
    PERFORM route_approval('PR', NEW.pr_id, NEW.total_estimated_amount);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_pr_approval_routing
  AFTER INSERT OR UPDATE ON purchase_requisitions
  FOR EACH ROW
  EXECUTE FUNCTION trg_pr_route_approval();

COMMENT ON FUNCTION trg_pr_route_approval() IS 'Automatically route PR to appropriate approver when submitted';

-- =============================================
-- STEP 5: CREATE TRIGGER - PO APPROVAL ROUTING
-- =============================================

CREATE OR REPLACE FUNCTION trg_po_route_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- Only route if status changed to 'Pending' (submitted for approval)
  IF NEW.status = 'Pending' AND (OLD.status IS NULL OR OLD.status != 'Pending') THEN
    -- Route based on total amount
    PERFORM route_approval('PO', NEW.po_id, NEW.total_amount);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_po_approval_routing
  AFTER INSERT OR UPDATE ON purchase_orders
  FOR EACH ROW
  EXECUTE FUNCTION trg_po_route_approval();

COMMENT ON FUNCTION trg_po_route_approval() IS 'Automatically route PO to appropriate approver when submitted';

-- =============================================
-- STEP 6: CREATE TRIGGER - ADJUSTMENT APPROVAL ROUTING
-- =============================================

CREATE OR REPLACE FUNCTION trg_adjustment_route_approval()
RETURNS TRIGGER AS $$
DECLARE
  v_total_value NUMERIC;
BEGIN
  -- Only route if status changed to 'Pending'
  IF NEW.status = 'Pending' AND (OLD.status IS NULL OR OLD.status != 'Pending') THEN
    -- Calculate total adjustment value
    SELECT SUM(ABS(qty_adjusted) * COALESCE(unit_cost, 0)) INTO v_total_value
    FROM stock_adjustment_items
    WHERE adjustment_id = NEW.adjustment_id;

    v_total_value := COALESCE(v_total_value, 0);

    -- Route based on total value
    PERFORM route_approval('ADJUSTMENT', NEW.adjustment_id, v_total_value);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_adjustment_approval_routing
  AFTER INSERT OR UPDATE ON stock_adjustments
  FOR EACH ROW
  EXECUTE FUNCTION trg_adjustment_route_approval();

-- =============================================
-- STEP 7: CREATE FUNCTION - APPROVE DOCUMENT
-- =============================================

CREATE OR REPLACE FUNCTION approve_document(
  p_approval_id BIGINT,
  p_comments TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_doc_type TEXT;
  v_doc_id BIGINT;
  v_approver UUID;
  v_status TEXT;
BEGIN
  -- Get approval details
  SELECT doc_type, doc_id, approver, status INTO v_doc_type, v_doc_id, v_approver, v_status
  FROM approvals
  WHERE approval_id = p_approval_id;

  -- Validate approval exists and is pending
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Approval record not found';
  END IF;

  IF v_status != 'Pending' THEN
    RAISE EXCEPTION 'Approval already processed (status: %)', v_status;
  END IF;

  -- Validate approver is current user
  IF v_approver != auth.uid() THEN
    RAISE EXCEPTION 'Only assigned approver can approve this document';
  END IF;

  -- Update approval record
  UPDATE approvals
  SET status = 'Approved',
      comments = p_comments,
      decided_at = now(),
      updated_at = now()
  WHERE approval_id = p_approval_id;

  -- Update source document status
  IF v_doc_type = 'PR' THEN
    UPDATE purchase_requisitions
    SET status = 'Approved',
        approved_by = auth.uid(),
        approved_at = now()
    WHERE pr_id = v_doc_id;

  ELSIF v_doc_type = 'PO' THEN
    UPDATE purchase_orders
    SET status = 'Approved',
        approved_by = auth.uid(),
        approved_at = now()
    WHERE po_id = v_doc_id;

  ELSIF v_doc_type = 'ADJUSTMENT' THEN
    UPDATE stock_adjustments
    SET status = 'Approved',
        approved_by = auth.uid(),
        approved_at = now()
    WHERE adjustment_id = v_doc_id;

  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION approve_document(BIGINT, TEXT) IS 'Approve a document and update source record status';

-- =============================================
-- STEP 8: CREATE FUNCTION - REJECT DOCUMENT
-- =============================================

CREATE OR REPLACE FUNCTION reject_document(
  p_approval_id BIGINT,
  p_comments TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_doc_type TEXT;
  v_doc_id BIGINT;
  v_approver UUID;
  v_status TEXT;
BEGIN
  -- Get approval details
  SELECT doc_type, doc_id, approver, status INTO v_doc_type, v_doc_id, v_approver, v_status
  FROM approvals
  WHERE approval_id = p_approval_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Approval record not found';
  END IF;

  IF v_status != 'Pending' THEN
    RAISE EXCEPTION 'Approval already processed (status: %)', v_status;
  END IF;

  IF v_approver != auth.uid() THEN
    RAISE EXCEPTION 'Only assigned approver can reject this document';
  END IF;

  -- Update approval record
  UPDATE approvals
  SET status = 'Rejected',
      comments = p_comments,
      decided_at = now(),
      updated_at = now()
  WHERE approval_id = p_approval_id;

  -- Update source document status
  IF v_doc_type = 'PR' THEN
    UPDATE purchase_requisitions
    SET status = 'Rejected',
        rejection_reason = p_comments
    WHERE pr_id = v_doc_id;

  ELSIF v_doc_type = 'PO' THEN
    UPDATE purchase_orders
    SET status = 'Cancelled'
    WHERE po_id = v_doc_id;

  ELSIF v_doc_type = 'ADJUSTMENT' THEN
    UPDATE stock_adjustments
    SET status = 'Rejected'
    WHERE adjustment_id = v_doc_id;

  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION reject_document(BIGINT, TEXT) IS 'Reject a document and update source record status';

-- =============================================
-- STEP 9: CREATE APPROVAL SUMMARY VIEWS
-- =============================================

-- Pending Approvals per User
CREATE OR REPLACE VIEW v_pending_approvals AS
SELECT
  a.approval_id,
  a.doc_type,
  a.doc_id,
  a.level,
  CASE
    WHEN a.level = 1 THEN 'Level 1 (<PKR 50,000)'
    WHEN a.level = 2 THEN 'Level 2 (PKR 50,000-200,000)'
    WHEN a.level = 3 THEN 'Level 3 (>PKR 200,000)'
  END AS level_description,
  up.full_name AS approver_name,
  a.status,
  a.created_at AS submitted_at,
  EXTRACT(EPOCH FROM (NOW() - a.created_at)) / 3600 AS hours_pending,
  CASE
    WHEN a.doc_type = 'PR' THEN pr.pr_number
    WHEN a.doc_type = 'PO' THEN po.po_number
    WHEN a.doc_type = 'ADJUSTMENT' THEN adj.adjustment_number
  END AS document_number,
  CASE
    WHEN a.doc_type = 'PR' THEN pr.total_estimated_amount
    WHEN a.doc_type = 'PO' THEN po.total_amount
  END AS document_amount,
  CASE
    WHEN a.doc_type = 'PR' THEN req_up.full_name
    WHEN a.doc_type = 'PO' THEN po_up.full_name
    WHEN a.doc_type = 'ADJUSTMENT' THEN adj_up.full_name
  END AS requested_by_name
FROM approvals a
JOIN user_profiles up ON a.approver = up.id
LEFT JOIN purchase_requisitions pr ON a.doc_type = 'PR' AND a.doc_id = pr.pr_id
LEFT JOIN user_profiles req_up ON pr.requested_by = req_up.id
LEFT JOIN purchase_orders po ON a.doc_type = 'PO' AND a.doc_id = po.po_id
LEFT JOIN user_profiles po_up ON po.created_by = po_up.id
LEFT JOIN stock_adjustments adj ON a.doc_type = 'ADJUSTMENT' AND a.doc_id = adj.adjustment_id
LEFT JOIN user_profiles adj_up ON adj.created_by = adj_up.id
WHERE a.status = 'Pending'
ORDER BY a.created_at ASC;

COMMENT ON VIEW v_pending_approvals IS 'All pending approvals with document details and aging';

-- Approval History
CREATE OR REPLACE VIEW v_approval_history AS
SELECT
  a.approval_id,
  a.doc_type,
  a.doc_id,
  a.level,
  up.full_name AS approver_name,
  a.status,
  a.comments,
  a.created_at AS submitted_at,
  a.decided_at,
  EXTRACT(EPOCH FROM (a.decided_at - a.created_at)) / 3600 AS decision_time_hours,
  CASE
    WHEN a.doc_type = 'PR' THEN pr.pr_number
    WHEN a.doc_type = 'PO' THEN po.po_number
    WHEN a.doc_type = 'ADJUSTMENT' THEN adj.adjustment_number
  END AS document_number
FROM approvals a
JOIN user_profiles up ON a.approver = up.id
LEFT JOIN purchase_requisitions pr ON a.doc_type = 'PR' AND a.doc_id = pr.pr_id
LEFT JOIN purchase_orders po ON a.doc_type = 'PO' AND a.doc_id = po.po_id
LEFT JOIN stock_adjustments adj ON a.doc_type = 'ADJUSTMENT' AND a.doc_id = adj.adjustment_id
WHERE a.status IN ('Approved', 'Rejected')
ORDER BY a.decided_at DESC;

COMMENT ON VIEW v_approval_history IS 'Historical approval decisions with decision time metrics';

-- =============================================
-- STEP 10: CREATE UPDATED_AT TRIGGER
-- =============================================

CREATE TRIGGER trg_approvals_updated_at
  BEFORE UPDATE ON approvals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_approval_thresholds_updated_at
  BEFORE UPDATE ON approval_thresholds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- View approval thresholds
SELECT * FROM approval_thresholds ORDER BY doc_type, level;

-- Test approval level detection
SELECT
  'PR with 25,000' AS test_case,
  get_approval_level('PR', 25000) AS calculated_level,
  1 AS expected_level;

SELECT
  'PO with 125,000' AS test_case,
  get_approval_level('PO', 125000) AS calculated_level,
  2 AS expected_level;

SELECT
  'PO with 350,000' AS test_case,
  get_approval_level('PO', 350000) AS calculated_level,
  3 AS expected_level;

-- =============================================
-- ROLLBACK INSTRUCTIONS
-- =============================================

/*
-- To rollback this migration:

DROP VIEW IF EXISTS v_pending_approvals;
DROP VIEW IF EXISTS v_approval_history;

DROP TRIGGER IF EXISTS trg_pr_approval_routing ON purchase_requisitions;
DROP TRIGGER IF EXISTS trg_po_approval_routing ON purchase_orders;
DROP TRIGGER IF EXISTS trg_adjustment_approval_routing ON stock_adjustments;
DROP TRIGGER IF EXISTS trg_approvals_updated_at ON approvals;
DROP TRIGGER IF EXISTS trg_approval_thresholds_updated_at ON approval_thresholds;

DROP FUNCTION IF EXISTS trg_pr_route_approval();
DROP FUNCTION IF EXISTS trg_po_route_approval();
DROP FUNCTION IF EXISTS trg_adjustment_route_approval();
DROP FUNCTION IF EXISTS get_approval_level(TEXT, NUMERIC);
DROP FUNCTION IF EXISTS find_approver_for_level(INT);
DROP FUNCTION IF EXISTS route_approval(TEXT, BIGINT, NUMERIC);
DROP FUNCTION IF EXISTS approve_document(BIGINT, TEXT);
DROP FUNCTION IF EXISTS reject_document(BIGINT, TEXT);

DROP TABLE IF EXISTS approvals CASCADE;
DROP TABLE IF EXISTS approval_thresholds CASCADE;
*/

-- =============================================
-- END OF MIGRATION
-- =============================================
