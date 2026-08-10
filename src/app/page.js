'use client'

import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { ChevronDown } from 'lucide-react'

// Free version components from shadcncraft
const COMPONENTS = [
  { name: 'Alert', slug: 'alert' },
  { name: 'Avatar', slug: 'avatar' },
  { name: 'Badge', slug: 'badge' },
  { name: 'Button', slug: 'button' },
  { name: 'Card', slug: 'card' },
  { name: 'Checkbox', slug: 'checkbox' },
  { name: 'Dialog', slug: 'dialog' },
  { name: 'Input', slug: 'input' },
  { name: 'Label', slug: 'label' },
  { name: 'Progress', slug: 'progress' },
  { name: 'Radio Group', slug: 'radio-group' },
  { name: 'Select', slug: 'select' },
  { name: 'Separator', slug: 'separator' },
  { name: 'Switch', slug: 'switch' },
  { name: 'Tabs', slug: 'tabs' },
  { name: 'Textarea', slug: 'textarea' },
  { name: 'Toggle', slug: 'toggle' },
  { name: 'Tooltip', slug: 'tooltip' },
]

const COMPONENT_DESCRIPTIONS = {
  'alert': 'Displays a callout for user attention.',
  'avatar': 'An image element with a fallback for representing the user.',
  'badge': 'Displays a small, self-contained piece of information.',
  'button': 'Triggers an action or event, such as submitting a form or displaying a dialog.',
  'card': 'Displays content within a contained format.',
  'checkbox': 'A control that allows the user to toggle between checked and not checked.',
  'dialog': 'A window overlaid on either the primary window or another dialog window.',
  'input': 'Displays a form input field or filter.',
  'label': 'Renders an accessible label associated with controls.',
  'progress': 'Displays an indicator showing the completion progress of a task.',
  'radio-group': 'A set of checkable buttons, known as radio buttons, where no more than one can be checked at a time.',
  'select': 'Displays a list of options for the user to pick from — triggered by a button.',
  'separator': 'Visually or semantically separates content.',
  'switch': 'A control that allows the user to toggle between checked and unchecked states.',
  'tabs': 'A set of layered sections of content — known as tab panels — that are displayed one at a time.',
  'textarea': 'Displays a form textarea or a place to accept multiple lines of text from the user.',
  'toggle': 'A two-state button that can be either on or off.',
  'tooltip': 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
}

export default function Home() {
  const [selectedComponent, setSelectedComponent] = useState('button')
  const [expandedMenu, setExpandedMenu] = useState('components')

  const component = COMPONENTS.find(c => c.slug === selectedComponent)
  const description = COMPONENT_DESCRIPTIONS[selectedComponent]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Group Design System</h1>
              <p className="text-sm text-muted-foreground">The ultimate design system</p>
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
        {/* Left Sidebar - Independently Scrollable */}
        <aside className="w-64 border-r bg-muted/30 flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-background flex-shrink-0">
            <h2 className="text-sm font-semibold">Menu</h2>
          </div>
          
          {/* Scrollable Navigation */}
          <nav className="p-4 space-y-2 overflow-y-auto flex-1">
            {/* Get Started */}
            <button
              className="w-full text-left px-3 py-2.5 rounded-md text-sm transition-all duration-200 text-foreground hover:bg-accent hover:text-accent-foreground active:bg-primary active:text-primary-foreground"
            >
              Get Started
            </button>

            {/* Foundation */}
            <button
              className="w-full text-left px-3 py-2.5 rounded-md text-sm transition-all duration-200 text-foreground hover:bg-accent hover:text-accent-foreground active:bg-primary active:text-primary-foreground"
            >
              Foundation
            </button>

            {/* Components (Collapsible) */}
            <div>
              <button
                onClick={() => setExpandedMenu(expandedMenu === 'components' ? null : 'components')}
                className="w-full text-left px-3 py-2.5 rounded-md text-sm transition-all duration-200 text-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-between"
              >
                <span>Components</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${expandedMenu === 'components' ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Components List (Nested) */}
              {expandedMenu === 'components' && (
                <div className="pl-4 mt-1 space-y-1 border-l border-border">
                  {COMPONENTS.map((comp) => (
                    <button
                      key={comp.slug}
                      onClick={() => setSelectedComponent(comp.slug)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                        selectedComponent === comp.slug
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      {comp.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Resources */}
            <button
              className="w-full text-left px-3 py-2.5 rounded-md text-sm transition-all duration-200 text-foreground hover:bg-accent hover:text-accent-foreground active:bg-primary active:text-primary-foreground"
            >
              Resources
            </button>
          </nav>
        </aside>

        {/* Main Content Area - Independently Scrollable */}
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
