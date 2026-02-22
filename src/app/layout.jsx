import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'LearnHub - AI-Powered Learning Platform',
  description: 'Comprehensive Learning Management System with AI course generation, quizzes, and study assistant',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100`}
        style={{ minHeight: '100vh' }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
