import { Inter } from 'next/font/google';

// Define fonts with subsets and display options for optimization
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

// Export font variables for use in layout
export const fontVariables = {
  inter: inter.variable,
};
