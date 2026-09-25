import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import * as studentsApi from "../api/studentsApi";
import * as coursesApi from "../api/coursesApi";
import * as attendanceApi from "../api/attendanceApi";
import * as marksApi from "../api/marksApi";
import * as feedbackApi from "../api/feedbackApi";

function StatCard({ label, value, icon, color }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`flex h-11 w-11 items-center justify-center rounded-lg text-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-2xl font-semibold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (user.role === "admin") {
        const [students, courses, attendance, marks, feedback] = await Promise.all([
          studentsApi.getAll(),
          coursesApi.getAll(),
          attendanceApi.getAll(),
          marksApi.getAll(),
          feedbackApi.getAll(),
        ]);
        setStats({
          students: students.length,
          courses: courses.length,
          attendance: attendance.length,
          marks: marks.length,
          openFeedback: feedback.filter((f) => f.status === "Open").length,
        });
      } else {
        const [courses, attendance, marks, feedback] = await Promise.all([
          coursesApi.getAll(),
          attendanceApi.getAll(),
          marksApi.getAll(),
          feedbackApi.getAll(),
        ]);
        const present = attendance.filter((a) => a.status === "Present").length;
        const pct = attendance.length ? Math.round((present / attendance.length) * 100) : 0;
        setStats({
          courses: courses.length,
          attendancePct: pct,
          marks: marks.length,
          feedback: feedback.length,
        });
      }
      setLoading(false);
    }
    load();
  }, [user]);

  if (loading) return <Layout><Loader /></Layout>;

  return (
    <Layout>
      <h1 className="mb-1 text-xl font-semibold text-slate-800">Welcome, {user.name} 👋</h1>
      <p className="mb-6 text-sm text-slate-500">
        {user.role === "admin"
          ? "Here's an overview of the academic portal."
          : "Here's a quick snapshot of your academics."}
      </p>

      {user.role === "admin" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Students" value={stats.students} icon="🎓" color="bg-brand-50 text-brand-600" />
          <StatCard label="Courses Offered" value={stats.courses} icon="📚" color="bg-emerald-50 text-emerald-600" />
          <StatCard label="Attendance Records" value={stats.attendance} icon="🗓️" color="bg-amber-50 text-amber-600" />
          <StatCard label="Marks Entries" value={stats.marks} icon="📝" color="bg-purple-50 text-purple-600" />
          <StatCard label="Open Feedback" value={stats.openFeedback} icon="💬" color="bg-rose-50 text-rose-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Enrolled Courses" value={stats.courses} icon="📚" color="bg-brand-50 text-brand-600" />
          <StatCard label="Attendance" value={`${stats.attendancePct}%`} icon="🗓️" color="bg-amber-50 text-amber-600" />
          <StatCard label="Marks Recorded" value={stats.marks} icon="📝" color="bg-purple-50 text-purple-600" />
          <StatCard label="Feedback Submitted" value={stats.feedback} icon="💬" color="bg-rose-50 text-rose-600" />
        </div>
      )}
    </Layout>
  );
}
