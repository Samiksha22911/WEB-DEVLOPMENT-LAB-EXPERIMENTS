const express = require("express");
const { Model } = require("../utils/db");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();
const Feedback = Model("feedback");

// GET /api/feedback - admin: all. student: own only.
router.get("/", authenticate, (req, res) => {
  if (req.user.role === "admin") return res.json(Feedback.all());
  const rows = Feedback.where((r) => String(r.studentId) === String(req.user.studentId));
  res.json(rows);
});

// POST /api/feedback - student submits feedback for themselves; admin can submit on behalf too
router.post("/", authenticate, (req, res) => {
  const { subject, message } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ message: "subject and message are required" });
  }
  const studentId = req.user.role === "admin" ? req.body.studentId : req.user.studentId;
  const record = Feedback.create({
    studentId,
    subject,
    message,
    date: new Date().toISOString().slice(0, 10),
    status: "Open",
  });
  res.status(201).json(record);
});

// PUT /api/feedback/:id - admin can update status/response; student can edit own open feedback
router.put("/:id", authenticate, (req, res) => {
  const existing = Feedback.find(req.params.id);
  if (!existing) return res.status(404).json({ message: "Feedback not found" });

  if (req.user.role !== "admin" && String(existing.studentId) !== String(req.user.studentId)) {
    return res.status(403).json({ message: "Access denied" });
  }

  const updated = Feedback.update(req.params.id, req.body);
  res.json(updated);
});

// DELETE /api/feedback/:id - admin, or the owning student
router.delete("/:id", authenticate, (req, res) => {
  const existing = Feedback.find(req.params.id);
  if (!existing) return res.status(404).json({ message: "Feedback not found" });

  if (req.user.role !== "admin" && String(existing.studentId) !== String(req.user.studentId)) {
    return res.status(403).json({ message: "Access denied" });
  }

  Feedback.remove(req.params.id);
  res.json({ message: "Feedback deleted" });
});

module.exports = router;
