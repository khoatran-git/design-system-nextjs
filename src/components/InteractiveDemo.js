'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'
import { Alert, AlertTitle, AlertDescription } from './ui/alert'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Switch } from './ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Slider } from './ui/slider'
import { Toggle } from './ui/toggle'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { AlertCircle, Bell, Bold, CheckCircle, Info, Moon, Plus, Trash2, Zap } from 'lucide-react'

const DemoSection = ({ title, description, children }) => (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <div className="p-6 border rounded-lg bg-card">
      {children}
    </div>
  </div>
)

export default function InteractiveDemo() {
  const [checkboxChecked, setCheckboxChecked] = useState(false)
  const [switchEnabled, setSwitchEnabled] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [selectedRadio, setSelectedRadio] = useState('option1')
  const [sliderValue, setSliderValue] = useState([50])
  const [progressValue, setProgressValue] = useState(65)
  const [selectedOption, setSelectedOption] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [boldActive, setBoldActive] = useState(false)

  return (
    <div className="space-y-8 py-12">
      {/* Alerts */}
      <DemoSection 
        title="Alerts" 
        description="Display alerts with different severity levels"
      >
        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>This is an informational alert message.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Operation completed successfully!</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <Zap className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>Please review this important warning.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>An error has occurred. Please try again.</AlertDescription>
          </Alert>
        </div>
      </DemoSection>

      {/* Buttons */}
      <DemoSection 
        title="Buttons" 
        description="Various button styles and states"
      >
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
        </div>
      </DemoSection>

      {/* Checkbox */}
      <DemoSection 
        title="Checkbox" 
        description="Toggle checkbox states"
      >
        <div className="flex items-center space-x-3">
          <Checkbox 
            checked={checkboxChecked}
            onCheckedChange={setCheckboxChecked}
            id="agree"
          />
          <label htmlFor="agree" className="text-sm font-medium cursor-pointer">
            I agree to the terms and conditions
          </label>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Current state: {checkboxChecked ? 'Checked' : 'Unchecked'}
        </p>
      </DemoSection>

      {/* Input */}
      <DemoSection 
        title="Input" 
        description="Text input with placeholder"
      >
        <Input 
          placeholder="Enter your email..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          type="email"
        />
        <p className="text-xs text-muted-foreground mt-3">
          Input value: {inputValue || '(empty)'}
        </p>
      </DemoSection>

      {/* Textarea */}
      <DemoSection 
        title="Textarea" 
        description="Multi-line text input"
      >
        <Textarea placeholder="Enter your message..." className="min-h-24" />
      </DemoSection>

      {/* Radio Group */}
      <DemoSection 
        title="Radio Group" 
        description="Select one option from a group"
      >
        <RadioGroup value={selectedRadio} onValueChange={setSelectedRadio}>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="option1" id="option1" />
            <label htmlFor="option1" className="text-sm font-medium cursor-pointer">Option 1</label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="option2" id="option2" />
            <label htmlFor="option2" className="text-sm font-medium cursor-pointer">Option 2</label>
          </div>
          <div className="flex items-center space-x-3">
            <RadioGroupItem value="option3" id="option3" />
            <label htmlFor="option3" className="text-sm font-medium cursor-pointer">Option 3</label>
          </div>
        </RadioGroup>
        <p className="text-xs text-muted-foreground mt-3">
          Selected: {selectedRadio}
        </p>
      </DemoSection>

      {/* Switch */}
      <DemoSection 
        title="Switch" 
        description="Toggle boolean states"
      >
        <div className="flex items-center space-x-3">
          <Switch 
            checked={switchEnabled}
            onCheckedChange={setSwitchEnabled}
            id="notifications"
          />
          <label htmlFor="notifications" className="text-sm font-medium cursor-pointer">
            Enable notifications
          </label>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Status: {switchEnabled ? 'Enabled' : 'Disabled'}
        </p>
      </DemoSection>

      {/* Progress */}
      <DemoSection 
        title="Progress" 
        description="Visual progress indicator"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Upload Progress: {progressValue}%</p>
            <Progress value={progressValue} />
          </div>
          <Button 
            size="sm"
            onClick={() => setProgressValue(Math.min(progressValue + 10, 100))}
          >
            Increase Progress
          </Button>
        </div>
      </DemoSection>

      {/* Slider */}
      <DemoSection 
        title="Slider" 
        description="Adjustable range selector"
      >
        <div className="space-y-4">
          <Slider 
            value={sliderValue}
            onValueChange={setSliderValue}
            max={100}
            step={1}
            className="w-full"
          />
          <p className="text-sm">Value: {sliderValue[0]}</p>
        </div>
      </DemoSection>

      {/* Select */}
      <DemoSection 
        title="Select" 
        description="Dropdown selection component"
      >
        <Select value={selectedOption} onValueChange={setSelectedOption}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="opt1">Option 1</SelectItem>
            <SelectItem value="opt2">Option 2</SelectItem>
            <SelectItem value="opt3">Option 3</SelectItem>
            <SelectItem value="opt4">Option 4</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-3">
          Selected: {selectedOption || '(none)'}
        </p>
      </DemoSection>

      {/* Dialog */}
      <DemoSection 
        title="Dialog" 
        description="Modal dialog component"
      >
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>
                This is a dialog component. You can add any content here.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm">Dialog content goes here.</p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setDialogOpen(false)}>
                  Confirm
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DemoSection>

      {/* Tabs */}
      <DemoSection 
        title="Tabs" 
        description="Tabbed content switching"
      >
        <Tabs defaultValue="tab1" className="w-full">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="mt-4">
            <p>Content for Tab 1</p>
          </TabsContent>
          <TabsContent value="tab2" className="mt-4">
            <p>Content for Tab 2</p>
          </TabsContent>
          <TabsContent value="tab3" className="mt-4">
            <p>Content for Tab 3</p>
          </TabsContent>
        </Tabs>
      </DemoSection>

      {/* Toggle */}
      <DemoSection 
        title="Toggle Button" 
        description="Button with toggle state"
      >
        <div className="flex gap-2">
          <Toggle 
            pressed={boldActive}
            onPressedChange={setBoldActive}
            aria-label="Toggle bold"
          >
            <Bold className="h-4 w-4" />
          </Toggle>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Bold: {boldActive ? 'Active' : 'Inactive'}
        </p>
      </DemoSection>

      {/* Tooltip */}
      <DemoSection 
        title="Tooltip" 
        description="Hover information display"
      >
        <TooltipProvider>
          <div className="flex gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>This is a tooltip message</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </DemoSection>

      {/* Badges */}
      <DemoSection 
        title="Badges" 
        description="Small status indicators"
      >
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </DemoSection>
    </div>
  )
}
