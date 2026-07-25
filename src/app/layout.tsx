import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Glover Library',
  description: 'Glover Library digital catalog and physical book checkout.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
