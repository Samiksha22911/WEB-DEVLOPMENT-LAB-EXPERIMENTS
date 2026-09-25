import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (u) => {
    setUsername(u);
    setPassword("password123");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-lg font-bold text-white">
            M
          </div>
          <h1 className="text-xl font-semibold text-slate-800">MITS Academic Portal</h1>
          <p className="text-sm text-slate-500">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>
          )}
          <div>
            <label className="label">Username</label>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="border-t border-slate-100 pt-3 text-center text-xs text-slate-400">
            Demo accounts (password: password123)
          </div>
          <div className="flex justify-center gap-2">
            <button type="button" onClick={() => fillDemo("admin")} className="btn-secondary text-xs">
              Admin
            </button>
            <button type="button" onClick={() => fillDemo("aarav")} className="btn-secondary text-xs">
              Student: Aarav
            </button>
            <button type="button" onClick={() => fillDemo("diya")} className="btn-secondary text-xs">
              Student: Diya
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
