'use client'

import {PortableText, PortableTextReactComponents} from '@portabletext/react'
import Link from 'next/link'
import {urlFor} from '@/lib/sanity.client'

const components: Partial<PortableTextReactComponents> = {
  types: {
    image: ({value}: any) => {
      if (!value?.asset?._ref) {
        return null
      }
      return (
        <img
          alt={value.alt || 'Image'}
          loading="lazy"
          src={urlFor(value).url()}
          className="w-full rounded-lg my-4"
        />
      )
    },
    code: ({value}: any) => (
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
        <code className="text-sm font-mono">{value.code}</code>
      </pre>
    ),
  },
  list: {
    bullet: ({children}: any) => (
      <ul className="list-disc list-inside space-y-2 my-4">{children}</ul>
    ),
    number: ({children}: any) => (
      <ol className="list-decimal list-inside space-y-2 my-4">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({children}: any) => <li className="ml-2">{children}</li>,
    number: ({children}: any) => <li className="ml-2">{children}</li>,
  },
  block: {
    h1: ({children}: any) => (
      <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>
    ),
    h2: ({children}: any) => (
      <h2 className="text-3xl font-bold mt-6 mb-3">{children}</h2>
    ),
    h3: ({children}: any) => (
      <h3 className="text-2xl font-bold mt-4 mb-2">{children}</h3>
    ),
    h4: ({children}: any) => (
      <h4 className="text-xl font-bold mt-3 mb-2">{children}</h4>
    ),
    normal: ({children}: any) => (
      <p className="text-base leading-7 my-2">{children}</p>
    ),
    blockquote: ({children}: any) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-4">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({value, children}: any) => {
      const target = (value?.href || '').startsWith('http')
        ? '_blank'
        : undefined
      return (
        <Link
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noreferrer' : ''}
          className="text-primary underline hover:text-primary/80"
        >
          {children}
        </Link>
      )
    },
    strong: ({children}: any) => <strong className="font-bold">{children}</strong>,
    em: ({children}: any) => <em className="italic">{children}</em>,
    code: ({children}: any) => (
      <code className="bg-muted px-2 py-1 rounded font-mono text-sm">
        {children}
      </code>
    ),
  },
}

interface SanityPortableTextProps {
  content: any
}

export function SanityPortableText({content}: SanityPortableTextProps) {
  if (!content) return null
  return <PortableText value={content} components={components} />
}
