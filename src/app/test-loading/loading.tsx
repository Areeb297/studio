/**
 * Loading UI for Test Loading Page
 *
 * This demonstrates the loading spinner with custom text
 * specific to this route.
 */

import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function TestLoading() {
  return (
    <LoadingSpinner
      variant="fullscreen"
      size="lg"
      text="Testing loading spinner..."
      delay={0}
    />
  )
}
