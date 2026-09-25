const express = require("express");
const { Model } = require("../utils/db");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();
const Courses = Model("courses");

// GET /api/courses - any authenticated user can view courses
router.get("/", authenticate, (req, res) => {
  res.json(Courses.all());
});

router.get("/:id", authenticate, (req, res) => {
  const course = Courses.find(req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json(course);
});

// POST /api/courses - admin only
router.post("/", authenticate, authorize("admin"), (req, res) => {
  const { code, name, credits, department, semester } = req.body;
  if (!code || !name) {
    return res.status(400).json({ message: "code and name are required" });
  }
  const course = Courses.create({ code, name, credits, department, semester });
  res.status(201).json(course);
});

// PUT /api/courses/:id - admin only
router.put("/:id", authenticate, authorize("admin"), (req, res) => {
  const updated = Courses.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: "Course not found" });
  res.json(updated);
});

// DELETE /api/courses/:id - admin only
router.delete("/:id", authenticate, authorize("admin"), (req, res) => {
  const ok = Courses.remove(req.params.id);
  if (!ok) return res.status(404).json({ message: "Course not found" });
  res.json({ message: "Course deleted" });
});

module.exports = router;
