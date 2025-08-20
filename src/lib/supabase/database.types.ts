export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      sales_orders: {
        Row: {
          id: string;
          order_number: string;
          order_date: string | null;
          customer_id: string | null;
          waiter_id: string | null;
          subtotal: number;
          tax_amount: number | null;
          service_charge: number | null;
          discount_amount: number | null;
          delivery_charges: number | null;
          total_amount: number;
          payment_status: string | null;
          order_status: string | null;
          kitchen_status: string | null;
          special_instructions: string | null;
          created_at: string | null;
          updated_at?: string | null;
        };
        Insert: {
          id?: string;
          order_number: string;
          order_date?: string | null;
          customer_id?: string | null;
          waiter_id?: string | null;
          subtotal: number;
          tax_amount?: number | null;
          service_charge?: number | null;
          discount_amount?: number | null;
          delivery_charges?: number | null;
          total_amount: number;
          payment_status?: string | null;
          order_status?: string | null;
          kitchen_status?: string | null;
          special_instructions?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["sales_orders"]["Insert"]>;
        Relationships: [];
      };
      sales_order_items: {
        Row: {
          id: string;
          sales_order_id: string;
          menu_item_id: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          special_instructions: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          sales_order_id: string;
          menu_item_id?: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          special_instructions?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["sales_order_items"]["Insert"]>;
        Relationships: [];
      };
      vendors: {
        Row: {
          id: string;
          vendor_code: string;
          name: string;
          contact_person: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          country: string | null;
          category: string | null;
          status: string;
          rating: number | null;
          payment_terms: string | null;
          credit_limit: number | null;
          tax_id: string | null;
          bank_account: string | null;
          website: string | null;
          certifications: Json | null;
          total_orders: number | null;
          total_value: number | null;
          on_time_delivery: number | null;
          quality_rating: number | null;
          last_order_date: string | null;
          registration_date: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          vendor_code: string;
          name: string;
          contact_person?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string | null;
          category?: string | null;
          status?: string;
          rating?: number | null;
          payment_terms?: string | null;
          credit_limit?: number | null;
          tax_id?: string | null;
          bank_account?: string | null;
          website?: string | null;
          certifications?: Json | null;
          total_orders?: number | null;
          total_value?: number | null;
          on_time_delivery?: number | null;
          quality_rating?: number | null;
          last_order_date?: string | null;
          registration_date?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["vendors"]["Insert"]>;
        Relationships: [];
      };
      purchase_requisitions: {
        Row: {
          id: string;
          pr_number: string;
          title: string;
          description: string | null;
          requestor_id: string;
          department: string;
          priority: string;
          status: string;
          total_amount: number | null;
          required_date: string | null;
          approval_workflow: Json | null;
          rejection_reason: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          pr_number: string;
          title: string;
          description?: string | null;
          requestor_id: string;
          department: string;
          priority?: string;
          status?: string;
          total_amount?: number | null;
          required_date?: string | null;
          approval_workflow?: Json | null;
          rejection_reason?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["purchase_requisitions"]["Insert"]>;
        Relationships: [];
      };
      purchase_requisition_items: {
        Row: {
          id: string;
          pr_id: string;
          item_name: string;
          description: string | null;
          quantity: number;
          unit_price: number | null;
          total_price: number | null;
          specifications: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          pr_id: string;
          item_name: string;
          description?: string | null;
          quantity: number;
          unit_price?: number | null;
          total_price?: number | null;
          specifications?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["purchase_requisition_items"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "purchase_requisition_items_pr_id_fkey";
            columns: ["pr_id"];
            referencedRelation: "purchase_requisitions";
            referencedColumns: ["id"];
          }
        ];
      };
      purchase_orders: {
        Row: {
          id: string;
          po_number: string;
          title: string;
          description: string | null;
          vendor_id: string;
          created_by: string;
          department: string;
          priority: string;
          status: string;
          total_amount: number;
          delivery_date: string | null;
          payment_terms: string | null;
          approval_workflow: Json | null;
          delivery_status: Json | null;
          pr_id: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          po_number: string;
          title: string;
          description?: string | null;
          vendor_id: string;
          created_by: string;
          department: string;
          priority?: string;
          status?: string;
          total_amount: number;
          delivery_date?: string | null;
          payment_terms?: string | null;
          approval_workflow?: Json | null;
          delivery_status?: Json | null;
          pr_id?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["purchase_orders"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "purchase_orders_vendor_id_fkey";
            columns: ["vendor_id"];
            referencedRelation: "vendors";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "purchase_orders_pr_id_fkey";
            columns: ["pr_id"];
            referencedRelation: "purchase_requisitions";
            referencedColumns: ["id"];
          }
        ];
      };
      purchase_order_items: {
        Row: {
          id: string;
          po_id: string;
          item_name: string;
          description: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          specifications: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          po_id: string;
          item_name: string;
          description?: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          specifications?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["purchase_order_items"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_po_id_fkey";
            columns: ["po_id"];
            referencedRelation: "purchase_orders";
            referencedColumns: ["id"];
          }
        ];
      };
      vendor_documents: {
        Row: {
          id: string;
          vendor_id: string;
          document_name: string;
          document_type: string;
          file_path: string | null;
          status: string;
          expiry_date: string | null;
          uploaded_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          vendor_id: string;
          document_name: string;
          document_type: string;
          file_path?: string | null;
          status?: string;
          expiry_date?: string | null;
          uploaded_at?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["vendor_documents"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "vendor_documents_vendor_id_fkey";
            columns: ["vendor_id"];
            referencedRelation: "vendors";
            referencedColumns: ["id"];
          }
        ];
      };
      approval_workflows: {
        Row: {
          id: string;
          entity_type: string;
          entity_id: string;
          step_number: number;
          step_name: string;
          approver_id: string;
          approver_role: string;
          status: string;
          approved_at: string | null;
          comments: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          entity_type: string;
          entity_id: string;
          step_number: number;
          step_name: string;
          approver_id: string;
          approver_role: string;
          status?: string;
          approved_at?: string | null;
          comments?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["approval_workflows"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}


