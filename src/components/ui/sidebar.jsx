import * as React from "react"
import { cn } from "@/utils"

const SidebarContext = React.createContext({})

const SidebarProvider = ({ children, className }) => {
  const [open, setOpen] = React.useState(false)
  
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <div className={cn("flex", className)}>
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

const Sidebar = React.forwardRef(({ className, children, ...props }, ref) => (
  <aside
    ref__={ref}
    className={cn(
      "flex h-screen w-64 flex-col border-r bg-background",
      className
    )}
    {...props}
  >
    {children}
  </aside>
))
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div ref__={ref} className={cn("p-4", className)} {...props} />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref__={ref} className={cn("flex-1 overflow-auto", className)} {...props} />
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref__={ref} className={cn("p-4 border-t", className)} {...props} />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div ref__={ref} className={cn("p-2", className)} {...props} />
))
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef(({ className, ...props }, ref) => (
  <div ref__={ref} className={cn("px-2 py-1 text-xs font-semibold text-muted-foreground", className)} {...props} />
))
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref__={ref} className={cn("", className)} {...props} />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => (
  <nav ref__={ref} className={cn("space-y-1", className)} {...props} />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref__={ref} className={cn("", className)} {...props} />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuButton = React.forwardRef(({ className, asChild, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "button"
  return (
    <Comp
      ref__={ref}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarTrigger = ({ className, ...props }) => {
  const { setOpen } = React.useContext(SidebarContext)
  return (
    <button
      onClick={() => setOpen(prev => !prev)}
      className={cn("p-2 hover:bg-accent rounded-md", className)}
      {...props}
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
      </svg>
    </button>
  )
}

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
}