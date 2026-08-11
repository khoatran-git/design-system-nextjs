// Simple content renderer without @portabletext/react dependency
// This avoids React version conflicts during build

import { urlFor } from '@/lib/sanity.client'

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

// Simple block renderer for basic content
const renderBlock = (block) => {
  if (!block || typeof block !== 'object') {
    return null
  }

  // Handle different block types
  switch (block._type) {
    case 'block':
      const style = block.style || 'normal'
      const text = block.children?.map(child => child.text).join('') || ''
      
      switch (style) {
        case 'h1':
          return <h1 key={block._key} className="text-3xl font-bold mt-8 mb-4">{text}</h1>
        case 'h2':
          return <h2 key={block._key} className="text-2xl font-semibold mt-6 mb-3">{text}</h2>
        case 'h3':
          return <h3 key={block._key} className="text-xl font-semibold mt-4 mb-2">{text}</h3>
        case 'h4':
          return <h4 key={block._key} className="text-lg font-semibold mt-3 mb-2">{text}</h4>
        case 'blockquote':
          return (
            <blockquote key={block._key} className="border-l-4 border-primary/20 pl-4 my-4 italic text-muted-foreground">
              {text}
            </blockquote>
          )
        default:
          return <p key={block._key} className="mb-4 leading-relaxed">{text}</p>
      }
    
    case 'codeBlock':
      return <CodeBlock key={block._key} node={block} />
    
    case 'componentPreview':
      return <ComponentPreview key={block._key} node={block} />
    
    case 'designTokens':
      return <DesignTokens key={block._key} node={block} />
    
    case 'image':
      // Get the image URL using Sanity's urlFor helper
      const imageUrl = urlFor(block)?.url()
      
      return (
        <div key={block._key} className="my-6">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={block.alt || 'Image'}
                className="max-w-full h-auto rounded-lg border shadow-sm"
              />
              {block.caption && (
                <p className="text-sm text-muted-foreground text-center mt-2 italic">
                  {block.caption}
                </p>
              )}
            </>
          ) : (
            <div className="p-4 border border-dashed border-muted-foreground/25 rounded-lg text-center text-muted-foreground">
              <p>Image could not be loaded</p>
              {block.alt && <p className="text-xs mt-1">{block.alt}</p>}
            </div>
          )}
        </div>
      )
    
    default:
      // Fallback for unknown types
      if (typeof block === 'string') {
        return <p key={Math.random()} className="mb-4">{block}</p>
      }
      return null
  }
}

// Main component for rendering content without PortableText dependency
export default function SimpleContentRenderer({ content }) {
  if (!content || !Array.isArray(content) || content.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-8">
        No content available
      </div>
    )
  }

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {content.map((block, index) => renderBlock(block))}
    </div>
  )
}