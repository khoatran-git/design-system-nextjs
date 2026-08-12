import './globals.css'
import { ThemeProvider } from '../components/theme-provider'

export const metadata = {
  title: 'shadcn/ui Components Showcase',
  description: 'A showcase of all available shadcn/ui components',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
