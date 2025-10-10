import { ConvexProvider, ConvexReactClient } from 'convex/react';
import type { AppProps } from 'next/app';

/**
 * Initialize Convex client with the public URL from environment variables
 * This client will be used to connect to the Convex backend
 */
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * Main App component that wraps the entire Next.js application
 * Provides Convex context to all child components through ConvexProvider
 * 
 * @param Component - The page component to render
 * @param pageProps - Props passed to the page component
 * @returns JSX element with ConvexProvider wrapping the page component
 */
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConvexProvider client={convex}>
      <Component {...pageProps} />
    </ConvexProvider>
  );
}