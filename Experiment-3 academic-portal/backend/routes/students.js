const express = require("express");
const { Model } = require("../utils/db");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();
const Students = Model("students");

// GET /api/students - admin: all students. student: only self.
router.get("/", authenticate, (req, res) => {
  if (req.user.role === "admin") return res.json(Students.all());
  const self = Students.find(req.user.studentId);
  return res.json(self ? [self] : []);
});

// GET /api/students/:id
router.get("/:id", authenticate, (req, res) => {
  const student = Students.find(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });

  if (req.user.role !== "admin" && String(req.user.studentId) !== String(student.id)) {
    return res.status(403).json({ message: "Access denied" });
  }
  res.json(student);
});

// POST /api/students - admin only
router.post("/", authenticate, authorize("admin"), (req, res) => {
  const { name, rollNo, email, department, year, phone } = req.body;
  if (!name || !rollNo || !email) {
    return res.status(400).json({ message: "name, rollNo and email are required" });
  }
  const student = Students.create({ name, rollNo, email, department, year, phone });
  res.status(201).json(student);
});

// PUT /api/students/:id - admin only
router.put("/:id", authenticate, authorize("admin"), (req, res) => {
  const updated = Students.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: "Student not found" });
  res.json(updated);
});

// DELETE /api/students/:id - admin only
router.delete("/:id", authenticate, authorize("admin"), (req, res) => {
  const ok = Students.remove(req.params.id);
  if (!ok) return res.status(404).json({ message: "Student not found" });
  res.json({ message: "Student deleted" });
});

module.exports = router;
