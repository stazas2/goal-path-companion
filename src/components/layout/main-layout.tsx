
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "../theme-toggle";
import { Button } from "@/components/ui/button";

interface NavItemProps {
  to: string;
  children: ReactNode;
  active: boolean;
}

function NavItem({ to, children, active }: NavItemProps) {
  return (
    <Link to={to}>
      <Button
        variant={active ? "default" : "ghost"}
        className={`w-full justify-start ${active ? "" : "text-muted-foreground"}`}
      >
        {children}
      </Button>
    </Link>
  );
}

export function MainLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex min-h-screen">
      {/* Side Navigation */}
      <div className="w-64 border-r bg-card p-4 hidden md:block">
        <div className="flex flex-col h-full">
          <div className="space-y-1 py-4">
            <h2 className="mb-6 text-lg font-semibold tracking-tight text-center">
              Goal Path Companion
            </h2>
            <NavItem to="/" active={currentPath === "/"}>
              Dashboard
            </NavItem>
            <NavItem to="/plan" active={currentPath === "/plan"}>
              Plan
            </NavItem>
            <NavItem to="/reflection" active={currentPath === "/reflection"}>
              Reflection
            </NavItem>
            <NavItem to="/motivation" active={currentPath === "/motivation"}>
              Motivation
            </NavItem>
          </div>
          <div className="mt-auto pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Toggle theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-10 md:hidden">
        <div className="flex justify-around p-2">
          <Link to="/" className={`p-2 rounded-md ${currentPath === "/" ? "text-primary" : "text-muted-foreground"}`}>
            Dashboard
          </Link>
          <Link to="/plan" className={`p-2 rounded-md ${currentPath === "/plan" ? "text-primary" : "text-muted-foreground"}`}>
            Plan
          </Link>
          <Link to="/reflection" className={`p-2 rounded-md ${currentPath === "/reflection" ? "text-primary" : "text-muted-foreground"}`}>
            Reflection
          </Link>
          <div className="p-2">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 pb-20 md:pb-8">
        {children}
      </div>
    </div>
  );
}
