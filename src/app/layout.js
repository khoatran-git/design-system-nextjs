import './globals.css'

export const metadata = {
  title: 'shadcn/ui Components Showcase',
  description: 'A showcase of all available shadcn/ui components',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background">
        {children}
      </body>
    </html>
  )
}
