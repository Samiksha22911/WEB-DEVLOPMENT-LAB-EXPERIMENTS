import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2 bg-slate-50">
      <p className="text-4xl font-bold text-brand-500">404</p>
      <p className="text-slate-600">Page not found</p>
      <Link to="/dashboard" className="btn-primary mt-3">
        Back to Dashboard
      </Link>
    </div>
  );
}
