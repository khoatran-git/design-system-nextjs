'use client'

import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'

const components = [
  {
    name: 'Accordion',
    description: 'A vertically stacked set of interactive headings that each reveal a section of content.',
    category: 'Disclosure'
  },
  {
    name: 'Alert',
    description: 'Displays a callout for user attention.',
    category: 'Feedback'
  },
  {
    name: 'Alert Dialog',
    description: 'A modal dialog that interrupts the user with important content and expects a response.',
    category: 'Feedback'
  },
  {
    name: 'Avatar',
    description: 'An image element with a fallback for representing the user.',
    category: 'Media'
  },
  {
    name: 'Badge',
    description: 'A small and adaptive tag for adding metadata.',
    category: 'Data Display'
  },
  {
    name: 'Breadcrumb',
    description: 'Displays the current location within a hierarchy.',
    category: 'Navigation'
  },
  {
    name: 'Button',
    description: 'Displays a button or a component that looks like a button.',
    category: 'Forms'
  },
  {
    name: 'Calendar',
    description: 'A date picker component with month navigation.',
    category: 'Forms'
  },
  {
    name: 'Card',
    description: 'Displays a card with header, content, and footer.',
    category: 'Layout'
  },
  {
    name: 'Carousel',
    description: 'A carousel with motion and swipe built in using Embla.',
    category: 'Media'
  },
  {
    name: 'Checkbox',
    description: 'A control that allows the user to toggle between checked and not checked.',
    category: 'Forms'
  },
  {
    name: 'Collapsible',
    description: 'An interactive component which expands/collapses a panel.',
    category: 'Disclosure'
  },
  {
    name: 'Combobox',
    description: 'Autocomplete input and command palette with a list of suggestions.',
    category: 'Forms'
  },
  {
    name: 'Command',
    description: 'Fast, composable, unstyled command menu with a list of suggestions.',
    category: 'Forms'
  },
  {
    name: 'Context Menu',
    description: 'A menu that appears on right-click or long-press.',
    category: 'Navigation'
  },
  {
    name: 'Data Table',
    description: 'A powerful table and datagrid built with TanStack Table.',
    category: 'Data Display'
  },
  {
    name: 'Date Picker',
    description: 'A date picker component with a calendar and input.',
    category: 'Forms'
  },
  {
    name: 'Dialog',
    description: 'A window overlaid on either the primary window or another dialog window.',
    category: 'Feedback'
  },
  {
    name: 'Drawer',
    description: 'A dialog that slides in from the edge of the screen.',
    category: 'Feedback'
  },
  {
    name: 'Dropdown Menu',
    description: 'A menu of links or actions offered to the user — usually navigation.',
    category: 'Navigation'
  },
  {
    name: 'Hover Card',
    description: 'A card component that appears on hover.',
    category: 'Disclosure'
  },
  {
    name: 'Input',
    description: 'Displays a form input field.',
    category: 'Forms'
  },
  {
    name: 'Input Group',
    description: 'A form input with supporting visual elements.',
    category: 'Forms'
  },
  {
    name: 'Label',
    description: 'Renders an accessible label associated with controls.',
    category: 'Forms'
  },
  {
    name: 'Menu',
    description: 'A menu component with keyboard navigation.',
    category: 'Navigation'
  },
  {
    name: 'Menubar',
    description: 'A menu bar component with keyboard navigation.',
    category: 'Navigation'
  },
  {
    name: 'Navigation Menu',
    description: 'A collection of links for navigating websites.',
    category: 'Navigation'
  },
  {
    name: 'Pagination',
    description: 'Pagination component with arrow buttons.',
    category: 'Navigation'
  },
  {
    name: 'Popover',
    description: 'A non-modal dialog that floats around a trigger element.',
    category: 'Disclosure'
  },
  {
    name: 'Progress',
    description: 'Displays an indicator showing the completion progress of a task.',
    category: 'Feedback'
  },
  {
    name: 'Radio Group',
    description: 'A set of checkable buttons—known as radio buttons—where no more than one can be checked at a time.',
    category: 'Forms'
  },
  {
    name: 'Scroll Area',
    description: 'Augments native scroll functionality for custom, cross-browser styling.',
    category: 'Layout'
  },
  {
    name: 'Select',
    description: 'Displays a list of options for the user to pick from.',
    category: 'Forms'
  },
  {
    name: 'Separator',
    description: 'Visually or semantically separates content.',
    category: 'Layout'
  },
  {
    name: 'Sheet',
    description: 'Extends the Dialog component to display content that complements the main content.',
    category: 'Feedback'
  },
  {
    name: 'Sidebar',
    description: 'A responsive sidebar navigation component.',
    category: 'Navigation'
  },
  {
    name: 'Skeleton',
    description: 'Use to build loading states.',
    category: 'Feedback'
  },
  {
    name: 'Slider',
    description: 'An input where the user selects a value from within a given range.',
    category: 'Forms'
  },
  {
    name: 'Switch',
    description: 'A control that allows the user to toggle between checked and not checked.',
    category: 'Forms'
  },
  {
    name: 'Table',
    description: 'A responsive table component.',
    category: 'Data Display'
  },
  {
    name: 'Tabs',
    description: 'A set of layered sections of content—known as tab panels—displayed one at a time.',
    category: 'Navigation'
  },
  {
    name: 'Textarea',
    description: 'Displays a form textarea field.',
    category: 'Forms'
  },
  {
    name: 'Toast',
    description: 'A succinct message that is displayed temporarily.',
    category: 'Feedback'
  },
  {
    name: 'Toggle',
    description: 'A two-state button that can be either on or off.',
    category: 'Forms'
  },
  {
    name: 'Toggle Group',
    description: 'A set of two-state buttons that can be toggled on or off.',
    category: 'Forms'
  },
  {
    name: 'Tooltip',
    description: 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    category: 'Disclosure'
  },
]

const categories = [...new Set(components.map(c => c.category))].sort()

export default function ComponentsGrid() {
  return (
    <div className="w-full">
      {categories.map((category) => (
        <div key={category} className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">{category}</h2>
            <p className="text-muted-foreground mt-2">
              {components.filter(c => c.category === category).length} components
            </p>
          </div>
          <Separator className="mb-6" />
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {components
              .filter(c => c.category === category)
              .map((component) => (
                <Card key={component.name} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{component.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {component.description}
                    </CardDescription>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
