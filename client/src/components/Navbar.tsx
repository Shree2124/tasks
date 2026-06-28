import { CheckCircle2, LayoutDashboard, LogOut, Shield, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  onLogout: () => void;
  isLoggingOut?: boolean;
}

const navLinkClass = (active: boolean) =>
  `inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
    active
      ? "bg-blue-600 text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

export default function Navbar({ onLogout, isLoggingOut }: NavbarProps) {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ")
    : "User";

  const isAdmin = user?.role === "admin";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <CheckCircle2 className="h-5 w-5 text-white" aria-hidden />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
              TaskFlow
            </h1>
            <p className="hidden text-xs text-slate-500 sm:block">
              Stay organized, ship more
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          <Link to="/dashboard" className={navLinkClass(pathname === "/dashboard")}>
            <LayoutDashboard className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Tasks</span>
          </Link>
          {isAdmin && (
            <Link to="/admin" className={navLinkClass(pathname === "/admin")}>
              <Shield className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 sm:flex">
            <User className="h-4 w-4 text-blue-600" aria-hidden />
            <span className="max-w-[140px] truncate text-sm text-slate-700">
              {displayName}
            </span>
          </div>
          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">
              {isLoggingOut ? "Signing out..." : "Logout"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
