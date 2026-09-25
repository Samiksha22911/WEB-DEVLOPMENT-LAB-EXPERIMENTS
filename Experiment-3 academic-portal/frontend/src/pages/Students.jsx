import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import DataTable from "../components/DataTable";
import * as studentsApi from "../api/studentsApi";

const emptyForm = { name: "", rollNo: "", email: "", department: "", year: "", phone: "" };

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await studentsApi.getAll();
    setStudents(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (student) => {
    setEditing(student);
    setForm({ ...emptyForm, ...student });
    setError("");
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await studentsApi.update(editing.id, form);
      } else {
        await studentsApi.create(form);
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    await studentsApi.remove(deleteTarget.id);
    setDeleteTarget(null);
    await load();
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: "rollNo", label: "Roll No" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "department", label: "Dept" },
    { key: "year", label: "Year" },
    { key: "phone", label: "Phone" },
  ];

  return (
    <Layout>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Students</h1>
          <p className="text-sm text-slate-500">Manage student records (Create, Read, Update, Delete)</p>
        </div>
        <div className="flex gap-2">
          <input
            className="input w-56"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn-primary" onClick={openCreate}>
            + Add Student
          </button>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          actions={(row) => (
            <div className="flex justify-end gap-2">
              <button className="btn-secondary" onClick={() => openEdit(row)}>
                Edit
              </button>
              <button className="btn-danger" onClick={() => setDeleteTarget(row)}>
                Delete
              </button>
            </div>
          )}
        />
      )}

      <Modal open={modalOpen} title={editing ? "Edit Student" : "Add Student"} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
          <div>
            <label className="label">Full Name</label>
            <input className="input" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Roll No</label>
              <input className="input" name="rollNo" value={form.rollNo} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Department</label>
              <input className="input" name="department" value={form.department} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Year</label>
              <input className="input" type="number" name="year" value={form.year} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" name="phone" value={form.phone} onChange={handleChange} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editing ? "Save Changes" : "Add Student"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        message={`Delete student "${deleteTarget?.name}"? This cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Layout>
  );
}
