import { PortableText } from '@portabletext/react'

// Component for rendering code blocks
const CodeBlock = ({ node }) => {
  const { title, language, code, description } = node
  
  return (
    <div className="my-6 border rounded-lg overflow-hidden">
      {title && (
        <div className="px-4 py-2 bg-muted border-b">
          <h4 className="text-sm font-semibold">{title}</h4>
        </div>
      )}
      <div className="relative">
        <pre className="p-4 bg-slate-900 text-slate-100 overflow-x-auto text-sm">
          <code>{code || '// No code provided'}</code>
        </pre>
        {language && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-black/20 rounded text-xs text-white/70">
            {language}
          </div>
        )}
      </div>
      {description && (
        <div className="px-4 py-2 text-sm text-muted-foreground border-t bg-muted/50">
          {description}
        </div>
      )}
    </div>
  )
}

// Component for rendering component previews
const ComponentPreview = ({ node }) => {
  const { title, description, html } = node
  
  return (
    <div className="my-6 border rounded-lg overflow-hidden">
      {title && (
        <div className="px-4 py-2 bg-muted border-b">
          <h4 className="text-sm font-semibold">{title}</h4>
        </div>
      )}
      <div className="p-6 bg-background">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <div className="text-muted-foreground text-center py-8">
            No preview available
          </div>
        )}
      </div>
      {description && (
        <div className="px-4 py-2 text-sm text-muted-foreground border-t bg-muted/50">
          {description}
        </div>
      )}
    </div>
  )
}

// Component for rendering design tokens
const DesignTokens = ({ node }) => {
  const { title, tokens } = node
  
  return (
    <div className="my-6 border rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-muted border-b">
        <h4 className="text-sm font-semibold">{title || 'Design Tokens'}</h4>
      </div>
      <div className="p-4">
        <div className="space-y-2">
          {tokens?.map((token, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div className="flex-1">
                <div className="font-mono text-sm">{token.name}</div>
                {token.description && (
                  <div className="text-xs text-muted-foreground">{token.description}</div>
                )}
              </div>
              <div className="font-mono text-sm bg-muted px-2 py-1 rounded">
                {token.value}
              </div>
            </div>
          )) || (
            <div className="text-muted-foreground text-center py-4">
              No tokens defined
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Custom components for Portable Text
export const portableTextComponents = {
  types: {
    codeBlock: ({ value }) => <CodeBlock node={value} />,
    componentPreview: ({ value }) => <ComponentPreview node={value} />,
    designTokens: ({ value }) => <DesignTokens node={value} />,
    image: ({ value }) => (
      <div className="my-6">
        <img
          src={value.asset?.url}
          alt={value.alt || ''}
          className="max-w-full h-auto rounded-lg border"
        />
        {value.caption && (
          <p className="text-sm text-muted-foreground text-center mt-2">
            {value.caption}
          </p>
        )}
      </div>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value.href}
        target={value.blank ? '_blank' : '_self'}
        rel={value.blank ? 'noopener noreferrer' : undefined}
        className="text-primary underline hover:no-underline"
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
  },
  block: {
    h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-semibold mt-6 mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold mt-4 mb-2">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-semibold mt-3 mb-2">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary/20 pl-4 my-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
}

// Main component for rendering Portable Text content
export default function PortableTextRenderer({ content }) {
  if (!content) {
    return (
      <div className="text-muted-foreground text-center py-8">
        No content available
      </div>
    )
  }

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <PortableText value={content} components={portableTextComponents} />
    </div>
  )
}