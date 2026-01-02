import { Button } from "@/components/ui/Button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { PanelLeft } from "lucide-react"

export function SidebarTrigger({ className, ...props }) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft className="h-5 w-5" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

export function SiteHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-1 border-b bg-white transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16 sticky top-0 z-10">
      <div className="flex w-full items-center gap-1 px-2 lg:gap-2 lg:px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 -ml-3 h-4"
        />
        <h1 className="text-base font-medium">Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
            {/* User or Actions could go here */}
        </div>
      </div>
    </header>
  )
}
