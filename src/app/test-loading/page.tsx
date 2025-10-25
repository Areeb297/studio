/**
 * Test Loading Spinner Page
 *
 * This page has an artificial 3-second delay to demonstrate
 * the loading spinner in action. Navigate to /test-loading
 * to see the branded loading spinner.
 */

// Simulate a slow data fetch
async function getSlowData() {
  // Wait for 3 seconds
  await new Promise((resolve) => setTimeout(resolve, 3000))

  return {
    message: "Data loaded successfully!",
    timestamp: new Date().toISOString(),
  }
}

export default async function TestLoadingPage() {
  const data = await getSlowData()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">
            Loading Spinner Test Page
          </h1>
          <p className="text-lg text-muted-foreground">
            This page has a 3-second artificial delay to demonstrate the loading spinner.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Success! ✅</h2>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              <strong>Message:</strong> {data.message}
            </p>
            <p className="text-muted-foreground">
              <strong>Loaded at:</strong> {data.timestamp}
            </p>
          </div>
        </div>

        <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 space-y-4">
          <h3 className="text-xl font-semibold">How to Test:</h3>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Click "Back" or navigate to another page</li>
            <li>Then click to navigate back to /test-loading</li>
            <li>You'll see the branded teal loading spinner for 3 seconds</li>
            <li>The spinner uses the Rahah24 primary color with glow effect</li>
          </ol>
        </div>

        <div className="flex gap-4 justify-center">
          <a
            href="/dashboard"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Go to Dashboard
          </a>
          <a
            href="/"
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    </div>
  )
}
