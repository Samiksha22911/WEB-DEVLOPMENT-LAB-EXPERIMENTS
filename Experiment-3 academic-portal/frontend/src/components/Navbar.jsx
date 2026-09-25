import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
          M
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight text-slate-800">MITS Academic Portal</p>
          <p className="text-xs text-slate-400 leading-tight">Academic Management System</p>
        </div>
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-700">{user.name}</p>
            <p className="text-xs capitalize text-slate-400">{user.role}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <button onClick={handleLogout} className="btn-secondary ml-2">
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
