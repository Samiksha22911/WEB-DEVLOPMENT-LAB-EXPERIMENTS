import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import * as studentsApi from "../api/studentsApi";

export default function Profile() {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await studentsApi.getOne(user.studentId);
      setStudent(data);
      setLoading(false);
    }
    load();
  }, [user]);

  if (loading) return <Layout><Loader /></Layout>;
  if (!student) return <Layout><p className="text-slate-500">No profile data found.</p></Layout>;

  const rows = [
    ["Full Name", student.name],
    ["Roll Number", student.rollNo],
    ["Email", student.email],
    ["Department", student.department],
    ["Year", student.year],
    ["Phone", student.phone],
  ];

  return (
    <Layout>
      <h1 className="mb-1 text-xl font-semibold text-slate-800">My Profile</h1>
      <p className="mb-6 text-sm text-slate-500">Your academic record on file</p>

      <div className="card max-w-xl">
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-2xl font-semibold text-brand-700">
            {student.name?.[0]}
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-800">{student.name}</p>
            <p className="text-sm text-slate-500">{student.rollNo}</p>
          </div>
        </div>
        <dl className="divide-y divide-slate-100">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between py-2.5 text-sm">
              <dt className="text-slate-500">{label}</dt>
              <dd className="font-medium text-slate-800">{value || "—"}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs text-slate-400">
          To update your profile details, please contact the college administration.
        </p>
      </div>
    </Layout>
  );
}
