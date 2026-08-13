import './globals.css'
import { ThemeProvider } from '../components/theme-provider'

export const metadata = {
  title: 'Group Design System',
  description: 'The ultimate design system with components, patterns, and foundations',
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
