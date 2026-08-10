'use client'

import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'

const COMPONENTS = [
  { name: 'Accordion', slug: 'accordion' },
  { name: 'Alert', slug: 'alert' },
  { name: 'Alert Dialog', slug: 'alert-dialog' },
  { name: 'Avatar', slug: 'avatar' },
  { name: 'Badge', slug: 'badge' },
  { name: 'Button', slug: 'button' },
  { name: 'Card', slug: 'card' },
  { name: 'Checkbox', slug: 'checkbox' },
  { name: 'Collapsible', slug: 'collapsible' },
  { name: 'Command', slug: 'command' },
  { name: 'Dialog', slug: 'dialog' },
  { name: 'Dropdown Menu', slug: 'dropdown-menu' },
  { name: 'Hover Card', slug: 'hover-card' },
  { name: 'Input', slug: 'input' },
  { name: 'Label', slug: 'label' },
  { name: 'Progress', slug: 'progress' },
  { name: 'Radio Group', slug: 'radio-group' },
  { name: 'Scroll Area', slug: 'scroll-area' },
  { name: 'Select', slug: 'select' },
  { name: 'Separator', slug: 'separator' },
  { name: 'Slider', slug: 'slider' },
  { name: 'Switch', slug: 'switch' },
  { name: 'Tabs', slug: 'tabs' },
  { name: 'Textarea', slug: 'textarea' },
  { name: 'Toast', slug: 'toast' },
  { name: 'Toggle', slug: 'toggle' },
  { name: 'Tooltip', slug: 'tooltip' },
]

const COMPONENT_DESCRIPTIONS = {
  'accordion': 'A vertically stacked set of interactive headings that each reveal a section of content.',
  'alert': 'Displays a callout for user attention.',
  'alert-dialog': 'A dialog that interrupts the user with important content and expects a response.',
  'avatar': 'An image element with a fallback for representing the user.',
  'badge': 'Displays a small, self-contained piece of information.',
  'button': 'Triggers an action or event, such as submitting a form or displaying a dialog.',
  'card': 'Displays content within a contained format.',
  'checkbox': 'A control that allows the user to toggle between checked and not checked.',
  'collapsible': 'An interactive component for showing and hiding content.',
  'command': 'Fast, composable, unstyled command menu with a search.',
  'dialog': 'A window overlaid on either the primary window or another dialog window.',
  'dropdown-menu': 'Displays a menu to the user — such as a set of actions or functions.',
  'hover-card': 'For sighted users to preview content available behind a link.',
  'input': 'Displays a form input field or filter.',
  'label': 'Renders an accessible label associated with controls.',
  'progress': 'Displays an indicator showing the completion progress of a task.',
  'radio-group': 'A set of checkable buttons, known as radio buttons, where no more than one can be checked at a time.',
  'scroll-area': 'Augments native scroll functionality for custom, cross-browser styling.',
  'select': 'Displays a list of options for the user to pick from — triggered by a button.',
  'separator': 'Visually or semantically separates content.',
  'slider': 'An input where the user selects a value from within a given range.',
  'switch': 'A control that allows the user to toggle between checked and unchecked states.',
  'tabs': 'A set of layered sections of content — known as tab panels — that are displayed one at a time.',
  'textarea': 'Displays a form textarea or a place to accept multiple lines of text from the user.',
  'toast': 'A succinct message that is displayed temporarily.',
  'toggle': 'A two-state button that can be either on or off.',
  'tooltip': 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
}

export default function Home() {
  const [selectedComponent, setSelectedComponent] = useState('button')

  const component = COMPONENTS.find(c => c.slug === selectedComponent)
  const description = COMPONENT_DESCRIPTIONS[selectedComponent]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">shadcn/ui</h1>
              <p className="text-sm text-muted-foreground">Component Documentation</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">v1.0</Badge>
              <a href="https://github.com/khoatran-git/design-system" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">GitHub</Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 border-r bg-muted/30 overflow-y-auto">
          <div className="sticky top-0 p-4 border-b bg-background">
            <h2 className="text-sm font-semibold">Components</h2>
            <p className="text-xs text-muted-foreground mt-1">27 components</p>
          </div>
          
          <nav className="p-4 space-y-1">
            {COMPONENTS.map((comp) => (
              <button
                key={comp.slug}
                onClick={() => setSelectedComponent(comp.slug)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedComponent === comp.slug
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'hover:bg-accent text-foreground'
                }`}
              >
                {comp.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {component && (
            <div className="min-h-full">
              {/* Banner Section */}
              <div className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="px-8 py-12">
                  <div className="max-w-4xl">
                    <div className="flex items-center gap-3 mb-4">
                      <h1 className="text-4xl font-bold tracking-tight">{component.name}</h1>
                      <Badge>{component.slug}</Badge>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                      {description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs Section */}
              <div className="px-8 py-8 max-w-4xl">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 max-w-md">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="specs">Specs</TabsTrigger>
                    <TabsTrigger value="documentation">Documentation</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Overview</h3>
                      <div className="p-6 border rounded-lg bg-muted/50 text-muted-foreground text-center">
                        Overview content coming soon...
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="specs" className="mt-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Specifications</h3>
                      <div className="p-6 border rounded-lg bg-muted/50 text-muted-foreground text-center">
                        Specifications content coming soon...
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="documentation" className="mt-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Documentation</h3>
                      <div className="p-6 border rounded-lg bg-muted/50 text-muted-foreground text-center">
                        Documentation content coming soon...
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Footer Info */}
                <div className="mt-12 pt-8 border-t">
                  <div className="grid grid-cols-3 gap-8 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">Component</h4>
                      <p className="text-muted-foreground">{component.name}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Slug</h4>
                      <p className="text-muted-foreground">{component.slug}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Status</h4>
                      <p className="text-muted-foreground">Available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
