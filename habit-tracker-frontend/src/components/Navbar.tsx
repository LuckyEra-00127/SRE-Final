import { BarChart3, Home, LogOut, Menu, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const navItems = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/habits/new", label: "Create Habit", icon: PlusCircle },
  { to: "/weekly-summary", label: "Weekly Summary", icon: BarChart3 }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition ${
      isActive ? "bg-primary-50 text-primary-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white shadow-sm">
            <BarChart3 className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-900">Habit Tracker</p>
            <p className="text-xs font-medium text-slate-500">Personal progress hub</p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
          <button type="button" onClick={handleLogout} className="btn-secondary ml-2">
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </button>
        </nav>

        <button
          type="button"
          className="btn-secondary px-3 md:hidden"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass} onClick={() => setOpen(false)}>
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
            <button type="button" onClick={handleLogout} className="btn-secondary mt-2">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
