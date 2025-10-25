/**
 * Global Loading UI for Next.js App Router
 *
 * This file provides the default loading UI that Next.js displays
 * automatically during route transitions in the App Router.
 *
 * It uses the LoadingSpinner component with fullscreen variant
 * to provide a branded, smooth loading experience across all pages.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/loading
 */

import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function Loading() {
  return <LoadingSpinner variant="fullscreen" size="lg" delay={0} />
}
