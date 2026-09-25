const express = require("express");
const { Model } = require("../utils/db");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();
const Attendance = Model("attendance");

// GET /api/attendance - admin: all (optionally ?studentId=). student: own only.
router.get("/", authenticate, (req, res) => {
  if (req.user.role === "admin") {
    const { studentId, courseId } = req.query;
    let rows = Attendance.all();
    if (studentId) rows = rows.filter((r) => String(r.studentId) === String(studentId));
    if (courseId) rows = rows.filter((r) => String(r.courseId) === String(courseId));
    return res.json(rows);
  }
  const rows = Attendance.where((r) => String(r.studentId) === String(req.user.studentId));
  res.json(rows);
});

// POST /api/attendance - admin only
router.post("/", authenticate, authorize("admin"), (req, res) => {
  const { studentId, courseId, date, status } = req.body;
  if (!studentId || !courseId || !date || !status) {
    return res.status(400).json({ message: "studentId, courseId, date and status are required" });
  }
  const record = Attendance.create({ studentId, courseId, date, status });
  res.status(201).json(record);
});

// PUT /api/attendance/:id - admin only
router.put("/:id", authenticate, authorize("admin"), (req, res) => {
  const updated = Attendance.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: "Attendance record not found" });
  res.json(updated);
});

// DELETE /api/attendance/:id - admin only
router.delete("/:id", authenticate, authorize("admin"), (req, res) => {
  const ok = Attendance.remove(req.params.id);
  if (!ok) return res.status(404).json({ message: "Attendance record not found" });
  res.json({ message: "Attendance record deleted" });
});

module.exports = router;
