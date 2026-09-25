// Seeds demo data: one admin, two students (with linked user accounts),
// courses, attendance, marks and feedback so the app works out of the box.

const bcrypt = require("bcryptjs");
const { writeTable } = require("./db");

function run() {
  const passwordHash = bcrypt.hashSync("password123", 10);

  const students = [
    { id: 1, name: "Aarav Sharma", rollNo: "MITS21CS001", email: "aarav@mits.edu", department: "CSE", year: 3, phone: "9876500001" },
    { id: 2, name: "Diya Patel", rollNo: "MITS21CS002", email: "diya@mits.edu", department: "CSE", year: 3, phone: "9876500002" },
    { id: 3, name: "Rohan Verma", rollNo: "MITS21EC010", email: "rohan@mits.edu", department: "ECE", year: 2, phone: "9876500003" },
  ];

  const users = [
    { id: 1, username: "admin", password: passwordHash, role: "admin", name: "College Admin", studentId: null },
    { id: 2, username: "aarav", password: passwordHash, role: "student", name: "Aarav Sharma", studentId: 1 },
    { id: 3, username: "diya", password: passwordHash, role: "student", name: "Diya Patel", studentId: 2 },
  ];

  const courses = [
    { id: 1, code: "CS301", name: "Database Management Systems", credits: 4, department: "CSE", semester: 5 },
    { id: 2, code: "CS302", name: "Operating Systems", credits: 4, department: "CSE", semester: 5 },
    { id: 3, code: "EC201", name: "Digital Electronics", credits: 3, department: "ECE", semester: 3 },
  ];

  const attendance = [
    { id: 1, studentId: 1, courseId: 1, date: "2026-09-01", status: "Present" },
    { id: 2, studentId: 1, courseId: 1, date: "2026-09-02", status: "Absent" },
    { id: 3, studentId: 1, courseId: 2, date: "2026-09-01", status: "Present" },
    { id: 4, studentId: 2, courseId: 1, date: "2026-09-01", status: "Present" },
  ];

  const marks = [
    { id: 1, studentId: 1, courseId: 1, examType: "Mid-Term", marks: 38, maxMarks: 50 },
    { id: 2, studentId: 1, courseId: 2, examType: "Mid-Term", marks: 42, maxMarks: 50 },
    { id: 3, studentId: 2, courseId: 1, examType: "Mid-Term", marks: 45, maxMarks: 50 },
  ];

  const feedback = [
    { id: 1, studentId: 1, subject: "Library Timings", message: "Could the library stay open till 9 PM during exams?", date: "2026-09-10", status: "Open" },
  ];

  writeTable("students", students);
  writeTable("users", users);
  writeTable("courses", courses);
  writeTable("attendance", attendance);
  writeTable("marks", marks);
  writeTable("feedback", feedback);

  console.log("Seed complete:");
  console.log("  admin  / password123  (role: admin)");
  console.log("  aarav  / password123  (role: student)");
  console.log("  diya   / password123  (role: student)");
}

run();
