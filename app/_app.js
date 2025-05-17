'use client';

// Disable static generation for the entire application
export const dynamic = 'force-dynamic';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
