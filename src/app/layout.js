import './globals.css'
import { ThemeProvider } from '../components/theme-provider'

export const metadata = {
  title: 'The Design Dictionary',
  description: 'A comprehensive design source of truth with components, patterns, and foundations',
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
