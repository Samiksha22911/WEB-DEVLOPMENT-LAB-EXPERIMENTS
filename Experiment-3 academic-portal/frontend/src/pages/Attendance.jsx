import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import DataTable from "../components/DataTable";
import { useAuth } from "../context/AuthContext";
import * as attendanceApi from "../api/attendanceApi";
import * as studentsApi from "../api/studentsApi";
import * as coursesApi from "../api/coursesApi";

const emptyForm = { studentId: "", courseId: "", date: "", status: "Present" };

export default function Attendance() {
  const { user } = useAuth();
  const isAdmin = user.role === "admin";

  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    const [att, crs, std] = await Promise.all([
      attendanceApi.getAll(),
      coursesApi.getAll(),
      isAdmin ? studentsApi.getAll() : Promise.resolve([]),
    ]);
    setRecords(att);
    setCourses(crs);
    setStudents(std);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const studentName = (id) => students.find((s) => String(s.id) === String(id))?.name || `#${id}`;
  const courseName = (id) => courses.find((c) => String(c.id) === String(id))?.name || `#${id}`;

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (rec) => {
    setEditing(rec);
    setForm({ ...emptyForm, ...rec });
    setError("");
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) await attendanceApi.update(editing.id, form);
      else await attendanceApi.create(form);
      setModalOpen(false);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    await attendanceApi.remove(deleteTarget.id);
    setDeleteTarget(null);
    await load();
  };

  const present = records.filter((r) => r.status === "Present").length;
  const pct = records.length ? Math.round((present / records.length) * 100) : 0;

  const columns = [
    ...(isAdmin ? [{ key: "studentId", label: "Student", render: (r) => studentName(r.studentId) }] : []),
    { key: "courseId", label: "Course", render: (r) => courseName(r.courseId) },
    { key: "date", label: "Date" },
    {
      key: "status",
      label: "Status",
      render: (r) => (
        <span
          className={`badge ${
            r.status === "Present" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
          }`}
        >
          {r.status}
        </span>
      ),
    },
  ];

  return (
    <Layout>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">
            {isAdmin ? "Attendance" : "My Attendance"}
          </h1>
          <p className="text-sm text-slate-500">
            {isAdmin ? "Mark and manage student attendance" : `Overall attendance: ${pct}%`}
          </p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={openCreate}>
            + Mark Attendance
          </button>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <DataTable
          columns={columns}
          rows={records}
          actions={
            isAdmin
              ? (row) => (
                  <div className="flex justify-end gap-2">
                    <button className="btn-secondary" onClick={() => openEdit(row)}>
                      Edit
                    </button>
                    <button className="btn-danger" onClick={() => setDeleteTarget(row)}>
                      Delete
                    </button>
                  </div>
                )
              : undefined
          }
        />
      )}

      <Modal open={modalOpen} title={editing ? "Edit Attendance" : "Mark Attendance"} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
          <div>
            <label className="label">Student</label>
            <select className="input" name="studentId" value={form.studentId} onChange={handleChange} required>
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.rollNo})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Course</label>
            <select className="input" name="courseId" value={form.courseId} onChange={handleChange} required>
              <option value="">Select course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Date</label>
              <input className="input" type="date" name="date" value={form.date} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" name="status" value={form.status} onChange={handleChange}>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editing ? "Save Changes" : "Add Record"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        message="Delete this attendance record? This cannot be undone."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Layout>
  );
}
