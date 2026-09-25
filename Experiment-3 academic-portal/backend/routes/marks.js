const express = require("express");
const { Model } = require("../utils/db");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();
const Marks = Model("marks");

// GET /api/marks - admin: all (optionally ?studentId=). student: own only.
router.get("/", authenticate, (req, res) => {
  if (req.user.role === "admin") {
    const { studentId, courseId } = req.query;
    let rows = Marks.all();
    if (studentId) rows = rows.filter((r) => String(r.studentId) === String(studentId));
    if (courseId) rows = rows.filter((r) => String(r.courseId) === String(courseId));
    return res.json(rows);
  }
  const rows = Marks.where((r) => String(r.studentId) === String(req.user.studentId));
  res.json(rows);
});

// POST /api/marks - admin only
router.post("/", authenticate, authorize("admin"), (req, res) => {
  const { studentId, courseId, examType, marks, maxMarks } = req.body;
  if (!studentId || !courseId || !examType || marks === undefined || !maxMarks) {
    return res.status(400).json({ message: "studentId, courseId, examType, marks and maxMarks are required" });
  }
  const record = Marks.create({ studentId, courseId, examType, marks, maxMarks });
  res.status(201).json(record);
});

// PUT /api/marks/:id - admin only
router.put("/:id", authenticate, authorize("admin"), (req, res) => {
  const updated = Marks.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: "Marks record not found" });
  res.json(updated);
});

// DELETE /api/marks/:id - admin only
router.delete("/:id", authenticate, authorize("admin"), (req, res) => {
  const ok = Marks.remove(req.params.id);
  if (!ok) return res.status(404).json({ message: "Marks record not found" });
  res.json({ message: "Marks record deleted" });
});

module.exports = router;
