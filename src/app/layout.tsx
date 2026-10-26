import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EventCraft AI - GenAI Event Planning Assistant',
  description:
    'Plan weddings, birthdays, and community events in seconds with interactive budgets, timelines, vendor checklists, and creative ideas powered by Gemini 2.5 Flash.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-50/50 text-neutral-900 selection:bg-neutral-900 selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
