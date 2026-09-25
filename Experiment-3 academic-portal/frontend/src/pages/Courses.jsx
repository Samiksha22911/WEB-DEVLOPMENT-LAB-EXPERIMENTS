import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import DataTable from "../components/DataTable";
import { useAuth } from "../context/AuthContext";
import * as coursesApi from "../api/coursesApi";

const emptyForm = { code: "", name: "", credits: "", department: "", semester: "" };

export default function Courses() {
  const { user } = useAuth();
  const isAdmin = user.role === "admin";

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    setCourses(await coursesApi.getAll());
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

  const openEdit = (course) => {
    setEditing(course);
    setForm({ ...emptyForm, ...course });
    setError("");
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) await coursesApi.update(editing.id, form);
      else await coursesApi.create(form);
      setModalOpen(false);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    await coursesApi.remove(deleteTarget.id);
    setDeleteTarget(null);
    await load();
  };

  const columns = [
    { key: "code", label: "Code" },
    { key: "name", label: "Course Name" },
    { key: "credits", label: "Credits" },
    { key: "department", label: "Dept" },
    { key: "semester", label: "Semester" },
  ];

  return (
    <Layout>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Courses</h1>
          <p className="text-sm text-slate-500">
            {isAdmin ? "Manage courses offered by the college" : "Courses available this semester"}
          </p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={openCreate}>
            + Add Course
          </button>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <DataTable
          columns={columns}
          rows={courses}
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

      <Modal open={modalOpen} title={editing ? "Edit Course" : "Add Course"} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Course Code</label>
              <input className="input" name="code" value={form.code} onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Credits</label>
              <input className="input" type="number" name="credits" value={form.credits} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="label">Course Name</label>
            <input className="input" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Department</label>
              <input className="input" name="department" value={form.department} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Semester</label>
              <input className="input" type="number" name="semester" value={form.semester} onChange={handleChange} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editing ? "Save Changes" : "Add Course"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        message={`Delete course "${deleteTarget?.name}"? This cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Layout>
  );
}
