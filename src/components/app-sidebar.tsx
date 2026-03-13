import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BookMarked, Settings, Shield, Shuffle, LogOut } from "lucide-react";
import { useLogout, useIsAdmin } from "@/hooks/auth-hooks";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { label: "Gerador", to: "/dashboard", icon: Shuffle },
  { label: "Salvas", to: "/dashboard/saved", icon: BookMarked },
  { label: "Configurações", to: "/dashboard/settings", icon: Settings },
  { label: "Admin", to: "/dashboard/admin", icon: Shield, adminOnly: true },
];

export function AppSidebar() {
  const { logout } = useLogout();
  const isAdmin = useIsAdmin();
  const state = useRouterState();
  const currentPath = state.location.pathname;

  return (
    <aside className="w-64 flex-shrink-0 bg-sidebar-background border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Shuffle className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-sidebar-foreground">Lotofácil</span>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.filter(item => !item.adminOnly || isAdmin).map((item) => {
          const Icon = item.icon;
          const active =
            currentPath === item.to || currentPath.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border flex items-center justify-between">
        <ThemeToggle />
        <button
          onClick={() => logout()}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
