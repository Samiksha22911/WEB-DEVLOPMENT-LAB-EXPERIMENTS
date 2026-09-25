import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const adminLinks = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠" },
  { to: "/students", label: "Students", icon: "🎓" },
  { to: "/courses", label: "Courses", icon: "📚" },
  { to: "/attendance", label: "Attendance", icon: "🗓️" },
  { to: "/marks", label: "Marks", icon: "📝" },
  { to: "/feedback", label: "Feedback", icon: "💬" },
];

const studentLinks = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠" },
  { to: "/profile", label: "My Profile", icon: "👤" },
  { to: "/courses", label: "Courses", icon: "📚" },
  { to: "/attendance", label: "My Attendance", icon: "🗓️" },
  { to: "/marks", label: "My Marks", icon: "📝" },
  { to: "/feedback", label: "Feedback", icon: "💬" },
];

export default function Sidebar() {
  const { user } = useAuth();
  const links = user?.role === "admin" ? adminLinks : studentLinks;

  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white md:block">
      <nav className="flex flex-col gap-1 p-4">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50"
              }`
            }
          >
            <span>{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
