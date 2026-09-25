import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import DataTable from "../components/DataTable";
import { useAuth } from "../context/AuthContext";
import * as feedbackApi from "../api/feedbackApi";
import * as studentsApi from "../api/studentsApi";

const emptyForm = { subject: "", message: "" };

export default function Feedback() {
  const { user } = useAuth();
  const isAdmin = user.role === "admin";

  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    const [fb, std] = await Promise.all([feedbackApi.getAll(), isAdmin ? studentsApi.getAll() : Promise.resolve([])]);
    setRecords(fb);
    setStudents(std);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const studentName = (id) => students.find((s) => String(s.id) === String(id))?.name || `#${id}`;

  const openCreate = () => {
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await feedbackApi.create(form);
      setModalOpen(false);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const toggleStatus = async (row) => {
    const next = row.status === "Open" ? "Resolved" : "Open";
    await feedbackApi.update(row.id, { status: next });
    await load();
  };

  const handleDelete = async () => {
    await feedbackApi.remove(deleteTarget.id);
    setDeleteTarget(null);
    await load();
  };

  const columns = [
    ...(isAdmin ? [{ key: "studentId", label: "Student", render: (r) => studentName(r.studentId) }] : []),
    { key: "subject", label: "Subject" },
    { key: "message", label: "Message" },
    { key: "date", label: "Date" },
    {
      key: "status",
      label: "Status",
      render: (r) => (
        <span className={`badge ${r.status === "Open" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>
          {r.status}
        </span>
      ),
    },
  ];

  return (
    <Layout>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Feedback</h1>
          <p className="text-sm text-slate-500">
            {isAdmin ? "Review feedback submitted by students" : "Share feedback or raise a concern"}
          </p>
        </div>
        {!isAdmin && (
          <button className="btn-primary" onClick={openCreate}>
            + New Feedback
          </button>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <DataTable
          columns={columns}
          rows={records}
          actions={(row) => (
            <div className="flex justify-end gap-2">
              {isAdmin && (
                <button className="btn-secondary" onClick={() => toggleStatus(row)}>
                  Mark {row.status === "Open" ? "Resolved" : "Open"}
                </button>
              )}
              <button className="btn-danger" onClick={() => setDeleteTarget(row)}>
                Delete
              </button>
            </div>
          )}
        />
      )}

      <Modal open={modalOpen} title="Submit Feedback" onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-3">
          {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
          <div>
            <label className="label">Subject</label>
            <input className="input" name="subject" value={form.subject} onChange={handleChange} required />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea
              className="input min-h-[100px]"
              name="message"
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Submit
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        message="Delete this feedback entry? This cannot be undone."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </Layout>
  );
}
