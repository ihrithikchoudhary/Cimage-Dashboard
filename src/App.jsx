import { useEffect, useRef, useState } from "react";
import cimageLogo from "./assets/cimagelogo.jpg";
import portalData from "./data/portalData.json";
import videosData from "./data/videosData.json";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";

// ─── Data ───────────────────────────────────────────────────────────────────

const STUDENT = portalData.student;

const DEFAULT_PROFILE = portalData.defaultProfile;

const STORAGE_PREFIX = "cimage-student-dashboard:";

const readStoredValue = (key, fallback) => {
  if (typeof window === "undefined") return fallback;

  try {
    const stored = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const writeStoredValue = (key, value) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  } catch {
    // Storage can fail in private mode or when the browser quota is full.
  }
};

const usePersistentState = (key, fallback) => {
  const [value, setValue] = useState(() => readStoredValue(key, fallback));

  useEffect(() => {
    writeStoredValue(key, value);
  }, [key, value]);

  return [value, setValue];
};

//Teachers list 
const TEACHERS = portalData.teachers;

const OFFICIAL_TEACHER_BY_SUBJECT = Object.fromEntries(
  TEACHERS.map(teacher => [teacher.subject, teacher])
);

const FACULTY_SUBJECT_MAP = portalData.facultySubjectMap || {};

const getOfficialTeacherName = (subject, fallback = "Faculty") =>
  FACULTY_SUBJECT_MAP[subject] || OFFICIAL_TEACHER_BY_SUBJECT[subject]?.name || fallback;

const ADMIN_CREDENTIALS = portalData.adminCredentials;

const STUDENT_DIRECTORY = portalData.studentDirectory;

const ATTENDANCE_DATA = portalData.attendanceData;

const FEES = portalData.fees;

const ASSIGNMENTS = portalData.assignments;

const ANNOUNCEMENTS = portalData.announcements;

const RESULTS = portalData.results;

const LECTURES_BY_SEMESTER = videosData.lecturesBySemester;

const PERSONAL_VIDEOS_BY_SEMESTER = videosData.personalVideosBySemester;

const TEST_SETTINGS = portalData.testSettings;

const TEST_QUESTIONS = portalData.testQuestions;

const GALLERY_EVENTS = portalData.galleryEvents;

const NAV_ITEMS = portalData.navItems;

// ─── Icons (inline SVG) ──────────────────────────────────────────────────────

const Icon = ({ name, size = 18 }) => {
  const icons = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    attendance: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="m9 16 2 2 4-4"/></>,
    courses: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
    fees: <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></>,
    assignments: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
    results: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    lectures: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3V9z"/><path d="M7 21h10"/></>,
    gallery: <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></>,
    onlineTest: <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
    activities: <><path d="M3 3v18h18"/><path d="m7 14 3-3 3 2 5-6"/><circle cx="7" cy="14" r="1"/><circle cx="10" cy="11" r="1"/><circle cx="13" cy="13" r="1"/><circle cx="18" cy="7" r="1"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    inbox: <><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></>,
    megaphone: <><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></>,
    ai: <><path d="M12 2l1.6 5.1L19 8.5l-5.1 1.7L12 16l-1.9-5.8L5 8.5l5.4-1.4L12 2z"/><path d="M19 15l.8 2.3L22 18l-2.2.7L19 21l-.8-2.3L16 18l2.2-.7L19 15z"/><path d="M5 14l.6 1.8L7.5 16l-1.9.2L5 18l-.6-1.8L2.5 16l1.9-.2L5 14z"/></>,
    send: <><path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/></>,
    phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.6a2 2 0 0 1-.45 2.11L8 9.71a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.83.29 1.7.5 2.6.62A2 2 0 0 1 22 16.92z"/></>,
    whatsapp: <><path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.3-4.7A8.5 8.5 0 1 1 20.5 11.8z"/><path d="M8.6 8.4c.2 3.3 2 5.1 5.3 5.9l1.1-1.1c.2-.2.5-.3.8-.2l1.7.7"/><path d="M8.6 8.4 9.7 7c.2-.2.5-.3.8-.2l1.3.6"/></>,
    profile: <><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></>,
    chevronDown: <><polyline points="6 9 12 15 18 9"/></>,
    clipboard: <><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 14l2 2 4-4"/></>,
    check: <><path d="m20 6-11 11-5-5"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    menu: <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name] || null}
    </svg>
  );
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const GradeChip = ({ grade }) => {
  const map = { O: "#166534", "A+": "#185FA5", A: "#854F0B", B: "#6b7280" };
  const bg = { O: "#dcfce7", "A+": "#dbeafe", A: "#fef3c7", B: "#f3f4f6" };
  return (
    <span style={{ background: bg[grade] || "#f3f4f6", color: map[grade] || "#374151", fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 999 }}>
      {grade}
    </span>
  );
};

const getInitials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .map(part => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getDialHref = (phone) => `tel:${String(phone || "").replace(/[^\d+]/g, "")}`;

const getWhatsAppHref = (phone, teacherName) => {
  const digits = String(phone || "").replace(/\D/g, "");
  const message = `Hello ${teacherName}, I am contacting you from Cimage Student Portal.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
};

const createFacultyId = (faculty = {}) =>
  faculty.id || `${String(faculty.name || "faculty").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${String(faculty.subject || "subject").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

const normalizeFacultyMembers = (facultyMembers = []) =>
  (Array.isArray(facultyMembers) ? facultyMembers : []).map((faculty, index) => ({
    id: createFacultyId(faculty) || `faculty-${index + 1}`,
    name: "",
    subject: "",
    education: "",
    joined: "",
    photo: "",
    phone: "",
    whatsapp: "",
    ...faculty,
  }));

const normalizeAnnouncements = (announcements = []) =>
  (Array.isArray(announcements) ? announcements : []).map((announcement, index) => ({
    id: announcement.id || `announcement-${index + 1}`,
    title: announcement.title || "Announcement",
    category: announcement.category || "General",
    date: announcement.date || "",
    message: announcement.message || "",
    unread: Boolean(announcement.unread),
  }));

const getAnnouncementDate = () =>
  new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const getDateInputValue = (date = new Date()) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

const toDateInputValue = (value) => {
  if (!value) return "";
  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;

  const monthMap = {
    jan: "01",
    january: "01",
    feb: "02",
    february: "02",
    mar: "03",
    march: "03",
    apr: "04",
    april: "04",
    may: "05",
    jun: "06",
    june: "06",
    jul: "07",
    july: "07",
    aug: "08",
    august: "08",
    sep: "09",
    sept: "09",
    september: "09",
    oct: "10",
    october: "10",
    nov: "11",
    november: "11",
    dec: "12",
    december: "12",
  };
  const match = text.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);

  if (match) {
    const [, day, month, year] = match;
    const monthNumber = monthMap[month.toLowerCase()];
    if (monthNumber) return `${year}-${monthNumber}-${day.padStart(2, "0")}`;
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? "" : getDateInputValue(parsed);
};

const formatDateLabel = (value) => {
  const inputValue = toDateInputValue(value);
  if (!inputValue) return value || "";
  const [year, month, day] = inputValue.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const normalizeAssignments = (assignments = []) =>
  (Array.isArray(assignments) ? assignments : []).map((assignment, index) => {
    const submissionDateInput = assignment.submissionDateInput || toDateInputValue(assignment.submissionDate || assignment.deadline);
    const givenDateInput = assignment.givenDateInput || toDateInputValue(assignment.givenDate) || getDateInputValue();
    const subject = assignment.subject || "";
    return {
      id: String(assignment.id || `assignment-${index + 1}`),
      facultyId: assignment.facultyId || "",
      title: assignment.title || "",
      subject,
      teacher: assignment.teacher || getOfficialTeacherName(subject, ""),
      desc: assignment.desc || assignment.details || "",
      givenDateInput,
      givenDate: assignment.givenDate || formatDateLabel(givenDateInput),
      submissionDateInput,
      submissionDate: assignment.submissionDate || formatDateLabel(submissionDateInput),
      deadline: assignment.deadline || assignment.submissionDate || formatDateLabel(submissionDateInput),
      totalMarks: assignment.totalMarks ?? "",
      status: assignment.status || "pending",
      pdfName: assignment.pdfName || "",
      pdfDataUrl: assignment.pdfDataUrl || "",
      createdAt: assignment.createdAt || "",
      updatedAt: assignment.updatedAt || "",
    };
  });

const getResultGrade = (percentage) => {
  if (percentage >= 90) return "O";
  if (percentage >= 80) return "A+";
  if (percentage >= 70) return "A";
  if (percentage >= 60) return "B+";
  if (percentage >= 50) return "B";
  if (percentage >= 40) return "C";
  return "F";
};

const getResultTotals = (subjects = []) => {
  const totalObtained = subjects.reduce((sum, subject) => sum + (Number(subject.obtainedMarks) || 0), 0);
  const totalMarks = subjects.reduce((sum, subject) => sum + (Number(subject.maxMarks) || 0), 0);
  const percentage = totalMarks > 0 ? Number(((totalObtained / totalMarks) * 100).toFixed(2)) : 0;

  return {
    totalObtained,
    totalMarks,
    percentage,
    grade: getResultGrade(percentage),
  };
};

const getSemesterResultSubjects = (semester, student = {}, facultyMembers = []) => {
  const facultySubjects = normalizeFacultyMembers(facultyMembers).filter(faculty => faculty.name && faculty.subject);
  if (facultySubjects.length) {
    return facultySubjects.map((faculty, index) => ({
      id: `${faculty.id || String(faculty.subject).toLowerCase().replace(/[^a-z0-9]+/g, "-")}-result-${index + 1}`,
      facultyId: faculty.id,
      subject: faculty.subject,
      teacher: faculty.name,
      obtainedMarks: "",
      maxMarks: 40,
    }));
  }

  const semesterSubjects = LECTURES_BY_SEMESTER?.[semester] || LECTURES_BY_SEMESTER?.[String(semester)] || [];
  const fallbackSubjects = getAttendanceSummary(student.attendanceRecords || []).records;
  const source = semesterSubjects.length ? semesterSubjects : fallbackSubjects;

  return source.map((item, index) => ({
    id: `${String(item.subject || `subject-${index + 1}`).toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index + 1}`,
    facultyId: "",
    subject: item.subject || `Subject ${index + 1}`,
    teacher: getOfficialTeacherName(item.subject, item.teacher),
    obtainedMarks: "",
    maxMarks: 40,
  }));
};

const normalizePublishedResults = (results = []) =>
  (Array.isArray(results) ? results : []).map((result, index) => {
    const subjects = (Array.isArray(result.subjects) ? result.subjects : []).map((subject, subjectIndex) => ({
      id: subject.id || `${String(subject.subject || `subject-${subjectIndex + 1}`).toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${subjectIndex + 1}`,
      facultyId: subject.facultyId || "",
      subject: subject.subject || `Subject ${subjectIndex + 1}`,
      teacher: subject.teacher || getOfficialTeacherName(subject.subject, "Faculty"),
      obtainedMarks: subject.obtainedMarks === "" || subject.obtainedMarks === undefined ? "" : Number(subject.obtainedMarks),
      maxMarks: Number(subject.maxMarks) || 40,
    }));
    const totals = getResultTotals(subjects);

    return {
      id: String(result.id || `result-${index + 1}`),
      studentRecordId: String(result.studentRecordId || result.studentInternalId || ""),
      studentId: result.studentId || "",
      studentName: result.studentName || result.name || "",
      email: result.email || "",
      regNo: result.regNo || "",
      rollNo: result.rollNo || "",
      course: result.course || "",
      department: result.department || "",
      session: result.session || "",
      semester: Number(result.semester) || 1,
      examName: result.examName || `Semester ${Number(result.semester) || 1}`,
      sessional: result.sessional || "Sessional 1",
      subjects,
      ...totals,
      publishedDate: result.publishedDate || "",
      publishedTime: result.publishedTime || "",
      updatedAt: result.updatedAt || "",
    };
  });

const normalizeComplaints = (complaints = []) =>
  (Array.isArray(complaints) ? complaints : []).map((complaint, index) => {
    const id = String(complaint.id || complaint.referenceNo || 83000000 + index + 1);
    return {
      id,
      referenceNo: String(complaint.referenceNo || id),
      name: "",
      email: "",
      phone: "",
      studentId: "",
      regNo: "",
      rollNo: "",
      course: "",
      semester: "",
      department: "",
      session: "",
      type: "General",
      details: "",
      date: "",
      time: "",
      status: "Raised",
      ...complaint,
      id,
      referenceNo: String(complaint.referenceNo || id),
    };
  });

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const printComplaintPdf = (complaint) => {
  if (typeof window === "undefined") return;

  const item = normalizeComplaints([complaint])[0];
  const printWindow = window.open("", "_blank", "width=900,height=720");
  if (!printWindow) return;

  const rows = [
    ["Reference No.", item.referenceNo],
    ["Date & Time", `${item.date} ${item.time}`],
    ["Status", item.status],
    ["Complaint Type", item.type],
    ["Student Name", item.name],
    ["Student ID", item.studentId],
    ["Registration No.", item.regNo],
    ["Roll No.", item.rollNo],
    ["Email", item.email],
    ["Phone", item.phone],
    ["Course", item.course],
    ["Semester", item.semester],
    ["Department", item.department],
    ["Session", item.session],
  ];

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>Complaint ${escapeHtml(item.referenceNo)}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111827; margin: 32px; }
          .header { border-bottom: 3px solid #185FA5; padding-bottom: 14px; margin-bottom: 20px; }
          h1 { margin: 0 0 6px; font-size: 24px; }
          .muted { color: #6b7280; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; margin: 18px 0; }
          td { border: 1px solid #e5e7eb; padding: 10px 12px; font-size: 13px; vertical-align: top; }
          td:first-child { width: 190px; background: #f9fafb; font-weight: 700; color: #374151; }
          .details { border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; line-height: 1.55; min-height: 110px; white-space: pre-wrap; }
          .footer { margin-top: 32px; display: flex; justify-content: space-between; gap: 24px; font-size: 12px; color: #6b7280; }
          @media print { button { display: none; } body { margin: 18mm; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Cimage Student Complaint</h1>
          <div class="muted">Print this page and choose Save as PDF to store it on this device.</div>
        </div>
        <table>
          <tbody>
            ${rows.map(([label, value]) => `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(value || "Not provided")}</td></tr>`).join("")}
          </tbody>
        </table>
        <h2 style="font-size:16px;margin:18px 0 8px;">Complaint Details</h2>
        <div class="details">${escapeHtml(item.details)}</div>
        <div class="footer">
          <div>Generated from Cimage Student Portal</div>
          <div>Admin Signature: ____________________</div>
        </div>
        <script>
          window.onload = function () {
            window.focus();
            window.print();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

const clampNumber = (value, min = 0, max = 999) => {
  const number = Number(value);
  if (Number.isNaN(number)) return min;
  return Math.min(max, Math.max(min, number));
};

const getAttendanceColor = (pct) => {
  if (pct < 75) return "#dc2626";
  if (pct < 85) return "#185FA5";
  return "#15803d";
};

const normalizeAttendanceRecords = (records = ATTENDANCE_DATA) => {
  const source = Array.isArray(records) ? records : ATTENDANCE_DATA;

  return source.map((record, index) => {
    const held = clampNumber(record.held ?? record.totalClasses ?? record.classesHeld ?? 24, 0, 999);
    const inferredPresent = Math.round(((Number(record.pct) || 0) / 100) * held);
    const present = clampNumber(record.present ?? record.presentClasses ?? inferredPresent, 0, held);
    const pct = held > 0 ? Math.round((present / held) * 100) : 0;

    return {
      id: record.id || `${String(record.subject || "subject").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index + 1}`,
      subject: record.subject || `Subject ${index + 1}`,
      held,
      present,
      totalClasses: held,
      presentClasses: present,
      pct,
      color: getAttendanceColor(pct),
      warn: pct < 75,
    };
  });
};

const getAttendanceSummary = (records = ATTENDANCE_DATA) => {
  const attendanceRecords = normalizeAttendanceRecords(records);
  const totalClasses = attendanceRecords.reduce((sum, item) => sum + item.held, 0);
  const totalPresent = attendanceRecords.reduce((sum, item) => sum + item.present, 0);
  const pct = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

  return {
    records: attendanceRecords,
    totalClasses,
    totalPresent,
    pct,
  };
};

const getNameFromEmail = (email = "") =>
  email
    .split("@")[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map(part => `${part[0]?.toUpperCase() || ""}${part.slice(1)}`)
    .join(" ") || "Student";

const DEFAULT_STUDENT_PASSWORD = "student123";

const getDefaultAdminUsers = () => [
  {
    id: "admin-root",
    name: "Main Admin",
    email: ADMIN_CREDENTIALS.email,
    password: ADMIN_CREDENTIALS.password,
    status: "Active",
    protected: true,
  },
];

const normalizeAdminUsers = (admins = []) => {
  const source = Array.isArray(admins) && admins.length ? admins : getDefaultAdminUsers();
  const withRoot = source.some(admin => admin.email === ADMIN_CREDENTIALS.email)
    ? source
    : [...getDefaultAdminUsers(), ...source];

  return withRoot.map((admin, index) => ({
    id: admin.id || `admin-${index + 1}`,
    name: admin.name || getNameFromEmail(admin.email || ""),
    email: String(admin.email || "").trim().toLowerCase(),
    password: admin.password || ADMIN_CREDENTIALS.password,
    status: admin.status || "Active",
    protected: Boolean(admin.protected || admin.email === ADMIN_CREDENTIALS.email),
  }));
};

const normalizeStudentRecord = (student = {}, index = 0) => {
  const email = String(student.email || "").trim().toLowerCase();
  const internalId = student.id || student.studentId || `student-${index + 1}`;
  const baseAttendanceRecords = Array.isArray(student.attendanceRecords) ? student.attendanceRecords : [];
  const attendanceSummary = getAttendanceSummary(baseAttendanceRecords);
  const toOptionalNumber = (value) => value === "" || value === null || value === undefined ? "" : Number(value);

  return {
    ...student,
    id: internalId,
    studentId: student.studentId || "",
    name: student.name || "",
    email,
    password: student.password || "",
    phone: student.phone || "",
    fatherName: student.fatherName || "",
    course: student.course || "",
    semester: toOptionalNumber(student.semester),
    totalSemesters: toOptionalNumber(student.totalSemesters),
    cgpa: toOptionalNumber(student.cgpa),
    department: student.department || "",
    rollNo: student.rollNo || "",
    age: toOptionalNumber(student.age),
    regNo: student.regNo || "",
    session: student.session || "",
    university: student.university || "",
    bloodGroup: student.bloodGroup || "",
    admissionDate: student.admissionDate || "",
    lastLogin: student.lastLogin || "",
    status: student.status || "Active",
    attendanceRecords: attendanceSummary.records,
    attendance: attendanceSummary.pct,
    totalClassesHeld: attendanceSummary.totalClasses,
    totalPresentClasses: attendanceSummary.totalPresent,
  };
};

const normalizeStudentRecords = (students = []) =>
  (Array.isArray(students) ? students : []).map((student, index) => normalizeStudentRecord(student, index));

const createStudentRecord = (index = 0) =>
  normalizeStudentRecord({
    id: `student-${Date.now()}`,
    studentId: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    regNo: "",
    rollNo: "",
    course: "",
    department: "",
    semester: "",
    totalSemesters: "",
    cgpa: "",
    age: "",
    fatherName: "",
    bloodGroup: "",
    session: "",
    university: "",
    status: "Active",
    attendanceRecords: [],
  }, index);

const Avatar = ({ profile, size = 34, fontSize = 12 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: "#185FA5", color: "#fff", fontSize, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
    {profile.photo ? (
      <img src={profile.photo} alt={profile.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    ) : (
      getInitials(profile.name)
    )}
  </div>
);

const VirtualIdCard = ({ profile, student = STUDENT }) => (
  <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 18, overflow: "hidden", boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)" }}>
    <div style={{ background: "#111827", padding: 16, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 900 }}>Virtual ID Card</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>{student.university}</div>
      </div>
      <img src={cimageLogo} alt="Cimage College" style={{ width: 40, height: 40, objectFit: "contain", background: "#fff", borderRadius: 10, padding: 4 }} />
    </div>
    <div style={{ padding: 18 }}>
      <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16 }}>
        <Avatar profile={profile} size={72} fontSize={21} />
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: "#111827" }}>{student.name || profile.name}</div>
          <div style={{ fontSize: 11, color: "#6b7280" }}>{student.course} · Session {student.session}</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          ["Father", student.fatherName || "Not set"],
          ["ID No.", student.studentId || "Not set"],
          ["Course", student.course],
          ["Session", student.session],
          ["Contact", student.phone || profile.phone],
          ["Blood", student.bloodGroup || "Not set"],
        ].map(([label, value]) => (
          <div key={label} style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: 10, padding: "9px 10px" }}>
            <div style={{ fontSize: 9, color: "#6b7280", marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: 11, fontWeight: 900, color: "#111827" }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const getNowReportTime = () => {
  const now = new Date();
  return {
    completionDate: now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    completionTime: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
  };
};

const getSubjectQuestions = (subject, semester) =>
  TEST_QUESTIONS?.[String(semester)]?.[subject] || [];

const getAiReply = (question, profile, testReports = [], facultyMembers = TEACHERS, announcements = ANNOUNCEMENTS, student = STUDENT, assignments = ASSIGNMENTS) => {
  const text = question.toLowerCase();
  const visibleAssignments = normalizeAssignments(assignments);
  const pendingAssignments = visibleAssignments.filter(item => item.status === "pending");
  const visibleAnnouncements = normalizeAnnouncements(announcements);
  const unreadAnnouncements = visibleAnnouncements.filter(item => item.unread).length;
  const currentStudent = normalizeStudentRecord(student);
  const attendanceSummary = getAttendanceSummary(currentStudent.attendanceRecords);
  const lowAttendance = attendanceSummary.records.filter(item => item.pct < 75);
  const currentSubjects = LECTURES_BY_SEMESTER[currentStudent.semester]?.map(item => item.subject) || attendanceSummary.records.map(item => item.subject);
  const bestTest = testReports.length ? [...testReports].sort((a, b) => b.obtainedMarks - a.obtainedMarks)[0] : null;
  const words = (...items) => items.some(item => text.includes(item));
  const trained = (intent) => (AI_TRAINING?.dashboardIntents?.[intent] || []).some(item => text.includes(item));
  const reply = (message, actions = []) => ({ text: message, actions });
  const requestedPage = trained("navigate")
    ? NAV_ITEMS.find(item => text.includes(item.label.toLowerCase()) || text.includes(item.id.toLowerCase()))
    : null;

  if (requestedPage) {
    return reply(`Sure. I found the ${requestedPage.label} section. Use the button below to open it.`, [{ label: `Open ${requestedPage.label}`, page: requestedPage.id }]);
  }

  if (words("attendance", "present", "absent", "class percentage", "low class")) {
    const lowText = lowAttendance.length
      ? `Your low-attendance subject is ${lowAttendance.map(item => `${item.subject} (${item.pct}%)`).join(", ")}. Prioritize those classes this week.`
      : "All subjects are above the 75% attendance line right now.";
    return reply(`Your overall attendance is ${attendanceSummary.pct}% from ${attendanceSummary.totalPresent}/${attendanceSummary.totalClasses} classes. ${lowText}`, [{ label: "Open attendance", page: "attendance" }]);
  }

  if (words("fee", "payment", "paid", "due", "money", "balance")) {
    return reply(`Your fee status is clear: Rs ${FEES.paid.toLocaleString("en-IN")} paid out of Rs ${FEES.total.toLocaleString("en-IN")}, with Rs ${FEES.due.toLocaleString("en-IN")} due.`, [{ label: "Open fees", page: "fees" }]);
  }

  if (words("assignment", "deadline", "submit", "homework", "pdf")) {
    const message = pendingAssignments.length
      ? `You have ${pendingAssignments.length} pending assignment${pendingAssignments.length === 1 ? "" : "s"}: ${pendingAssignments.map(item => `${item.title} due ${item.deadline || item.submissionDate}`).join("; ")}.`
      : "You do not have any pending assignments in the dashboard data.";
    return reply(message, [{ label: "Open assignments", page: "assignments" }]);
  }

  if (words("lecture", "video", "watch", "youtube", "class video", "recording")) {
    const currentSubjectsText = currentSubjects.join(", ");
    return reply(`Lecture videos are organized semester-wise. Your current Semester ${currentStudent.semester} subjects include ${currentSubjectsText}. You can select a subject and watch videos inside the portal.`, [{ label: "Open lectures", page: "lectures" }]);
  }

  if (words("gallery", "photo", "image", "event", "download image", "college photo")) {
    return reply("The Gallery shows photos by fixed categories like All images, Today uploaded, Annual Tech Fest, Placement/Workshop, and Cultural Event. Each image has its upload date and download button.", [{ label: "Open gallery", page: "gallery" }]);
  }

  if (words("test", "quiz", "mcq", "online exam", "exam")) {
    const completed = testReports.length;
    return reply(`Online tests are available by semester and subject. MCQs are loaded from portalData.json, each question has ${TEST_SETTINGS?.marksPerQuestion || 2} marks, and you can retake a subject anytime. You have saved ${completed} test attempt${completed === 1 ? "" : "s"} so far.`, [{ label: "Start test", page: "onlineTest" }, { label: "View activities", page: "activities" }]);
  }

  if (words("activity", "activities", "test report", "history", "score history", "marks history")) {
    if (!testReports.length) {
      return reply("No test activity report is saved yet. Complete an online test and your marks, date, time, subject, and teacher details will appear here.", [{ label: "Take online test", page: "onlineTest" }]);
    }
    const best = [...testReports].sort((a, b) => b.obtainedMarks - a.obtainedMarks)[0];
    return reply(`You have ${testReports.length} saved test report${testReports.length === 1 ? "" : "s"}. Your best score is ${best.obtainedMarks}/${best.totalMarks} in ${best.subject}.`, [{ label: "Open activities", page: "activities" }]);
  }

  if (words("result", "grade", "cgpa", "marks", "rank")) {
    const best = [...RESULTS].sort((a, b) => b.total - a.total)[0];
    return reply(`Your current CGPA is ${currentStudent.cgpa}. Your strongest listed result is ${best.subject} with ${best.total}/100 and grade ${best.grade}.`, [{ label: "Open results", page: "results" }]);
  }

  if (words("course", "semester", "subject", "bca", "syllabus")) {
    return reply(`You are in ${currentStudent.course}, semester ${currentStudent.semester}/${currentStudent.totalSemesters}. Current subjects include ${attendanceSummary.records.map(item => item.subject).join(", ")}.`, [{ label: "Open courses", page: "courses" }, { label: "Open lectures", page: "lectures" }]);
  }

  if (words("profile", "setting", "settings", "photo", "phone", "account")) {
    return reply(`Your profile is ${profile.name}, email ${profile.email}, phone ${profile.phone}. You can update profile details and photo from Settings.`, [{ label: "Open settings", page: "settings" }]);
  }

  if (words("notice", "announcement", "news", "reminder")) {
    const unread = visibleAnnouncements.filter(item => item.unread).length;
    const latestNotice = visibleAnnouncements[0]?.title || "No announcements are available right now";
    return reply(`You have ${unread} unread announcement${unread === 1 ? "" : "s"}. Latest notice: ${latestNotice}.`, [{ label: "Open announcements", page: "announcements" }]);
  }

  if (words("complaint", "complain", "grievance", "raise ticket", "report issue") || ((words("issue", "problem")) && words("raise", "submit", "complaint"))) {
    return reply("I can help you raise a student complaint. Click the form button, check your auto-filled student details, choose a category, write the complaint in 30 to 200 words, and submit it.", [{ label: "Complaint form", action: "complaint" }, { label: "View activities", page: "activities" }]);
  }

  if (trained("identity")) {
    return reply(`${currentStudent.name || profile.name}'s portal details: Student ID ${currentStudent.studentId}, roll ${currentStudent.rollNo || "not set"}, registration ${currentStudent.regNo || "not set"}, ${currentStudent.course} semester ${currentStudent.semester}, session ${currentStudent.session}, department ${currentStudent.department}.`, [{ label: "Open settings", page: "settings" }, { label: "Open dashboard", page: "dashboard" }]);
  }

  if (trained("facultyHelp")) {
    return reply(`Faculty help is available from the Courses page. Current faculty cards include ${facultyMembers.map(teacher => `${teacher.name} for ${teacher.subject}`).join("; ")}. Each card has Call and WhatsApp buttons.`, [{ label: "Open courses", page: "courses" }]);
  }

  if (trained("todayPlan")) {
    const firstPending = pendingAssignments[0];
    const firstLow = lowAttendance[0];
    const plan = [
      firstLow ? `Attend or revise ${firstLow.subject} first because it is at ${firstLow.pct}% attendance` : "Keep attendance steady because all subjects are above 75%",
      firstPending ? `Finish ${firstPending.title} before ${firstPending.deadline}` : "No pending assignment is blocking you right now",
      `Revise one current subject today: ${currentSubjects[0]}`,
      testReports.length ? `Review your best test score: ${bestTest.obtainedMarks}/${bestTest.totalMarks} in ${bestTest.subject}` : "Attempt one online test to create your first activity report",
    ];
    return reply(`Today's dashboard plan: ${plan.join(". ")}.`, [{ label: "Open dashboard", page: "dashboard" }, { label: firstPending ? "Open assignments" : "Take online test", page: firstPending ? "assignments" : "onlineTest" }]);
  }

  if (trained("riskCheck")) {
    const risks = [
      ...lowAttendance.map(item => `${item.subject} attendance is ${item.pct}%`),
      ...(pendingAssignments.length ? [`${pendingAssignments.length} assignment${pendingAssignments.length === 1 ? "" : "s"} pending`] : []),
      ...(FEES.due > 0 ? [`fee due is Rs ${FEES.due.toLocaleString("en-IN")}`] : []),
      ...(unreadAnnouncements > 0 ? [`${unreadAnnouncements} unread notice${unreadAnnouncements === 1 ? "" : "s"}`] : []),
    ];
    return reply(risks.length ? `Dashboard risk check: ${risks.join("; ")}. Start with the first item and use the section buttons below.` : "Dashboard risk check: no urgent risk found in attendance, fees, assignments, or announcements.", [{ label: "Open attendance", page: "attendance" }, { label: "Open assignments", page: "assignments" }, { label: "Open announcements", page: "announcements" }]);
  }

  if (trained("summary")) {
    const testText = bestTest ? `best test ${bestTest.obtainedMarks}/${bestTest.totalMarks} in ${bestTest.subject}` : "no saved test attempt yet";
    return reply(`Dashboard summary for ${currentStudent.name || profile.name}: CGPA ${currentStudent.cgpa}, attendance ${attendanceSummary.pct}%, semester ${currentStudent.semester}/${currentStudent.totalSemesters}, fee due Rs ${FEES.due.toLocaleString("en-IN")}, ${pendingAssignments.length} pending assignment${pendingAssignments.length === 1 ? "" : "s"}, ${unreadAnnouncements} unread notice${unreadAnnouncements === 1 ? "" : "s"}, and ${testText}.`, [{ label: "Open dashboard", page: "dashboard" }, { label: "Today's plan", prompt: "What should I do today?" }]);
  }

  if (words("react")) {
    return reply("For React, focus on components, props, state with useState, effects with useEffect, and clean reusable UI. For your portal project, practice building one section at a time.", [{ label: "Watch lectures", page: "lectures" }]);
  }

  if (words("dbms", "database", "sql", "normalization")) {
    return reply("For DBMS, start with entities, attributes, relationships, keys, SQL queries, joins, and normalization. ER diagrams help convert real-world requirements into database structure.", [{ label: "Watch DBMS videos", page: "lectures" }]);
  }

  if (words("data structure", "bst", "tree", "stack", "queue", "linked list")) {
    return reply("For Data Structures, practice arrays, linked lists, stacks, queues, trees, traversal, searching, and sorting. For BST: smaller values go left, larger values go right.", [{ label: "Watch DS videos", page: "lectures" }]);
  }

  if (words("excel", "pivot", "vlookup", "xlookup")) {
    return reply("For Advance Excel, practice formulas, sorting, filtering, charts, pivot tables, VLOOKUP/XLOOKUP, and dashboards. These are useful for reports and office work.", [{ label: "Watch Excel videos", page: "lectures" }]);
  }

  return reply(`Hi ${profile.name.split(" ")[0]}, I can help with the whole portal: attendance, fees, assignments, lectures, gallery, online tests, activities, results, announcements, profile, and study topics. Ask naturally, like "show my pending assignments" or "open my test reports".`, [
    { label: "Complaint form", action: "complaint" },
    { label: "Dashboard", page: "dashboard" },
    { label: "Online test", page: "onlineTest" },
    { label: "Activities", page: "activities" },
  ]);
};

const AI_SUGGESTIONS = portalData.aiSuggestions;

const AI_MODELS = portalData.aiModels;

const AI_TRAINING = portalData.aiTraining;

const AiChatPanel = ({ open, onClose, profile, student, testReports, facultyMembers, announcements, assignments, onNavigate, onOpenComplaint }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: AI_TRAINING?.intro || "Hi, I am your free Edu AI helper. Ask me naturally about any portal section, and I can also show action buttons to take you there.",
      actions: [
        { label: "Dashboard summary", prompt: "Give my dashboard summary" },
        { label: "Today's plan", prompt: "What should I do today?" },
        { label: "Online test", page: "onlineTest" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState(AI_MODELS[0]);
  const latestMessageRef = useRef(null);

  useEffect(() => {
    if (open) {
      latestMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, open]);

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        text: `Chat cleared. ${model} is ready for your next study or dashboard question.`,
        actions: [{ label: "Dashboard", page: "dashboard" }],
      },
    ]);
  };

  const sendMessage = (text = input) => {
    const clean = text.trim();
    if (!clean) return;
    const aiReply = getAiReply(clean, profile, testReports, facultyMembers, announcements, student, assignments);
    setMessages(current => [...current, { role: "student", text: clean }, { role: "assistant", text: `${model}: ${aiReply.text}`, actions: aiReply.actions }]);
    setInput("");
  };

  const runAction = (page) => {
    onNavigate(page);
    onClose();
  };

  const handleAction = (action) => {
    if (action.prompt) {
      sendMessage(action.prompt);
      return;
    }

    if (action.action === "complaint") {
      onOpenComplaint();
      onClose();
      return;
    }
    runAction(action.page);
  };

  if (!open) return null;

  return (
    <div style={{
      position: "fixed",
      right: 24,
      top: 72,
      bottom: 24,
      width: "min(460px, calc(100vw - 32px))",
      background: "#fff",
      border: "1px solid #dbeafe",
      borderRadius: 16,
      boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
      zIndex: 40,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      <div style={{ padding: 18, background: "linear-gradient(135deg, #185FA5, #0f766e)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="ai" size={18} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900 }}>AI Chat Help</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>Portal-aware educational assistant</div>
          </div>
        </div>
        <button onClick={onClose} aria-label="Close AI chat" style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.12)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}>
          <Icon name="x" size={15} />
        </button>
      </div>

      <div style={{ padding: "10px 14px", borderBottom: "1px solid #e5e7eb", display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center", background: "#fff" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 5, minWidth: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: "#6b7280", textTransform: "uppercase" }}>AI setting</span>
          <select
            value={model}
            onChange={event => setModel(event.target.value)}
            style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 9, padding: "8px 10px", fontSize: 12, color: "#111827", background: "#fff", outline: "none" }}
          >
            {AI_MODELS.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <button
          onClick={clearChat}
          type="button"
          style={{ alignSelf: "end", border: "1px solid #fecaca", background: "#fee2e2", color: "#991b1b", borderRadius: 9, padding: "9px 11px", fontSize: 11, fontWeight: 800, cursor: "pointer" }}
        >
          Clear chat
        </button>
      </div>

      <div style={{ padding: 14, borderBottom: "1px solid #eef2ff", background: "#fff" }}>
        <div style={{ fontSize: 10, fontWeight: 900, color: "#6b7280", textTransform: "uppercase", marginBottom: 9 }}>Quick actions</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {AI_SUGGESTIONS.map(item => (
          <button key={item.label} onClick={() => sendMessage(item.prompt)} style={{ border: "1px solid #bfdbfe", background: "#eff6ff", color: "#185FA5", borderRadius: 999, padding: "8px 12px", fontSize: 11, fontWeight: 800, cursor: "pointer", textAlign: "center" }}>
            {item.label}
          </button>
        ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12, background: "#f8fafc" }}>
        {messages.map((message, index) => {
          const isStudent = message.role === "student";
          const isLatest = index === messages.length - 1;
          return (
            <div ref={isLatest ? latestMessageRef : null} key={`${message.role}-${index}`} style={{ display: "flex", justifyContent: isStudent ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: isStudent ? "82%" : "90%",
                borderRadius: isStudent ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
                padding: "10px 12px",
                background: isStudent ? "#185FA5" : "#fff",
                color: isStudent ? "#fff" : "#1f2937",
                border: isStudent ? "none" : "1px solid #e5e7eb",
                fontSize: 12,
                lineHeight: 1.5,
                boxShadow: isStudent ? "none" : "0 8px 18px rgba(15, 23, 42, 0.05)",
              }}>
                {message.text}
                {!isStudent && message.actions?.length > 0 && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                    {message.actions.map(action => (
                      <button
                        key={`${index}-${action.page}-${action.label}`}
                        type="button"
                        onClick={() => handleAction(action)}
                        style={{ border: "1px solid #bfdbfe", background: "#eff6ff", color: "#185FA5", borderRadius: 999, padding: "7px 11px", fontSize: 10, fontWeight: 900, cursor: "pointer", textAlign: "center" }}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={event => { event.preventDefault(); sendMessage(); }} style={{ padding: 14, borderTop: "1px solid #e5e7eb", display: "flex", gap: 8, background: "#fff" }}>
        <input
          value={input}
          onChange={event => setInput(event.target.value)}
          placeholder="Ask: open my fees, show test report, explain DBMS..."
          style={{ flex: 1, minWidth: 0, border: "1px solid #d1d5db", borderRadius: 12, padding: "12px 13px", fontSize: 12, outline: "none" }}
        />
        <button type="submit" aria-label="Send message" style={{ width: 44, height: 44, border: "none", borderRadius: 12, background: "#185FA5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
          <Icon name="send" size={16} />
        </button>
      </form>
    </div>
  );
};

const COMPLAINT_TYPES = portalData.complaintTypes;

const ComplaintModal = ({ open, profile, student = STUDENT, onClose, onSubmit }) => {
  const currentStudent = normalizeStudentRecord(student);
  const [type, setType] = useState(COMPLAINT_TYPES[0]);
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const characterCount = details.trim().length;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (characterCount < 50 || characterCount > 200) {
      setError("Complaint text must be between 50 and 200 characters.");
      return;
    }

    onSubmit({
      name: currentStudent.name || profile.name,
      email: currentStudent.email || profile.email,
      phone: currentStudent.phone || profile.phone,
      studentId: currentStudent.studentId,
      regNo: currentStudent.regNo,
      rollNo: currentStudent.rollNo,
      course: currentStudent.course,
      semester: currentStudent.semester,
      department: currentStudent.department,
      session: currentStudent.session,
      type,
      details: details.trim(),
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      status: "Raised",
    });
    setType(COMPLAINT_TYPES[0]);
    setDetails("");
    setError("");
  };

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <form onSubmit={handleSubmit} style={{ width: "min(620px, 100%)", background: "#fff", borderRadius: 18, boxShadow: "0 28px 80px rgba(15,23,42,0.28)", overflow: "hidden" }}>
        <div style={{ padding: 18, background: "linear-gradient(135deg,#185FA5,#0f766e)", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 900 }}>Raise Complaint</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>Student details are filled automatically</div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close complaint form" style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.14)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="x" size={15} />
          </button>
        </div>

        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
            {[["Name", currentStudent.name || profile.name], ["Student ID", currentStudent.studentId], ["Reg. No.", currentStudent.regNo], ["Session", currentStudent.session]].map(([label, value]) => (
              <div key={label} style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: 11, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 12, fontWeight: 900, color: "#111827" }}>{value}</div>
              </div>
            ))}
          </div>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#374151" }}>Complaint type</span>
            <select value={type} onChange={event => setType(event.target.value)} style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: "11px 12px", fontSize: 13, outline: "none" }}>
              {COMPLAINT_TYPES.map(item => <option key={item}>{item}</option>)}
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#374151" }}>Complaint details</span>
            <textarea
              value={details}
              onChange={event => { setDetails(event.target.value); setError(""); }}
              placeholder="Write your complaint clearly between 50 and 200 characters..."
              rows={7}
              maxLength={200}
              style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: 12, fontSize: 13, outline: "none", resize: "vertical", lineHeight: 1.5 }}
            />
            <span style={{ fontSize: 11, color: characterCount < 50 || characterCount > 200 ? "#991b1b" : "#6b7280" }}>{characterCount}/200 characters · minimum 50 characters</span>
          </label>

          {error && <div style={{ background: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca", borderRadius: 10, padding: "9px 11px", fontSize: 12, fontWeight: 700 }}>{error}</div>}

          <button type="submit" style={{ alignSelf: "flex-end", background: "#185FA5", color: "#fff", border: "none", borderRadius: 10, padding: "11px 18px", fontSize: 13, fontWeight: 900, cursor: "pointer" }}>
            Submit complaint
          </button>
        </div>
      </form>
    </div>
  );
};

// ─── Page Components ──────────────────────────────────────────────────────────

const DashboardPage = ({ profile, student = STUDENT, announcements = ANNOUNCEMENTS, assignments = ASSIGNMENTS }) => {
  const currentStudent = normalizeStudentRecord(student);
  const attendanceSummary = getAttendanceSummary(currentStudent.attendanceRecords);
  const visibleAnnouncements = normalizeAnnouncements(announcements);
  const visibleAssignments = normalizeAssignments(assignments);
  const pendingAssignments = visibleAssignments.filter(item => item.status === "pending");
  const latestAnnouncement = visibleAnnouncements[0];
  const [registrationCopied, setRegistrationCopied] = useState(false);

  const copyRegistrationNumber = async () => {
    try {
      await navigator.clipboard.writeText(currentStudent.regNo);
      setRegistrationCopied(true);
      window.setTimeout(() => setRegistrationCopied(false), 1600);
    } catch {
      setRegistrationCopied(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Welcome Banner */}
      <div style={{
        background: "linear-gradient(135deg, #185FA5 0%, #0c3d7a 100%)",
        borderRadius: 16,
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        flexWrap: "wrap",
        gap: 16,
      }}>
        <div style={{ position: "absolute", right: -30, top: -30, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", right: 60, bottom: -50, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ zIndex: 1 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 4 }}>Welcome back, {(currentStudent.name || profile.name).split(" ")[0]} 👋</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 14 }}>{currentStudent.course} — Semester {currentStudent.semester} · {currentStudent.university}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {[
              { label: "University Registration No.", value: currentStudent.regNo || "Not set", copyable: Boolean(currentStudent.regNo) },
              { label: "College", value: currentStudent.university },
            ].map(({ label, value, copyable }) => (
              <div key={label} style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 10, padding: "8px 10px", minWidth: 170 }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.62)", textTransform: "uppercase", fontWeight: 800, marginBottom: 3 }}>{label}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 12, color: "#fff", fontWeight: 900, lineHeight: 1.25, minWidth: 0 }}>{value}</div>
                  {copyable && (
                    <button
                      type="button"
                      onClick={copyRegistrationNumber}
                      title={registrationCopied ? "Copied" : "Copy registration number"}
                      aria-label={registrationCopied ? "Registration number copied" : "Copy registration number"}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        border: "1px solid rgba(255,255,255,0.24)",
                        background: registrationCopied ? "rgba(34,197,94,0.24)" : "rgba(255,255,255,0.14)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      <Icon name={registrationCopied ? "check" : "clipboard"} size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontStyle: "italic", maxWidth: 280 }}>"Education is the most powerful weapon you can use to change the world."</p>
        </div>
        <div style={{ display: "flex", gap: 12, zIndex: 1 }}>
          {[{ val: currentStudent.cgpa, lbl: "CGPA" }, { val: `${currentStudent.semester}/${currentStudent.totalSemesters}`, lbl: "Semester" }, { val: `${attendanceSummary.pct}%`, lbl: "Attendance" }].map(s => (
            <div key={s.lbl} style={{ background: "rgba(255,255,255,0.13)", borderRadius: 12, padding: "12px 18px", textAlign: "center", minWidth: 72 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", fontFamily: "monospace" }}>{s.val}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
        {[
          { label: "Student ID", value: currentStudent.studentId || "Not set", bg: "#dbeafe", color: "#1e40af" },
          { label: "Roll Number", value: currentStudent.rollNo || "Not set", bg: "#dcfce7", color: "#166534" },
          { label: "Age", value: currentStudent.age ? `${currentStudent.age} yrs` : "Not set", bg: "#fef3c7", color: "#92400e" },
          { label: "Department", value: currentStudent.department, bg: "#ede9fe", color: "#5b21b6" },
        ].map(c => (
          <div key={c.label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 16 }}>
                {c.label === "Student ID" ? "🎓" : c.label === "Roll Number" ? "#" : c.label === "Age" ? "👤" : "🏛️"}
              </span>
            </div>
            <div>
              <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 2 }}>{c.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", fontFamily: "monospace" }}>{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Mid Row */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(340px, 0.75fr)", gap: 16, alignItems: "start" }}>
        {/* Attendance */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 16 }}>Attendance overview</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
            <div style={{ width: 80, height: 80, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="100%" startAngle={90} endAngle={-270} data={[{ value: attendanceSummary.pct, fill: "#185FA5" }, { value: 100 - attendanceSummary.pct, fill: "#e5e7eb" }]}>
                  <RadialBar dataKey="value" cornerRadius={4} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#111827", fontFamily: "monospace" }}>{attendanceSummary.pct}%</div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>{attendanceSummary.totalPresent} / {attendanceSummary.totalClasses} classes</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {attendanceSummary.records.map(s => (
              <div key={s.subject}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                  <span style={{ color: "#374151" }}>{s.subject}</span>
                  <span style={{ fontWeight: 600, color: s.warn ? "#dc2626" : "#374151", fontFamily: "monospace" }}>{s.pct}%</span>
                </div>
                <div style={{ height: 5, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${s.pct}%`, height: "100%", background: s.color, borderRadius: 99, transition: "width 0.6s ease" }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 11, background: "#fee2e2", color: "#991b1b", padding: "6px 10px", borderRadius: 8, display: "inline-flex", alignItems: "center", gap: 5 }}>
            ⚠ 75% Attendance is mandatory to appear in the university examination.
          </div>

          <div style={{ marginTop: 16, borderTop: "1px solid #f3f4f6", paddingTop: 14 }}>
            <h4 style={{ fontSize: 12, fontWeight: 800, color: "#111827", margin: "0 0 10px" }}>Productivity plan</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
              {[
                ["Study streak", "6 days"],
                ["Today target", "2 hrs"],
                ["Revision", "DBMS"],
              ].map(([label, value]) => (
                <div key={label} style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: 10, padding: "9px 10px" }}>
                  <div style={{ fontSize: 9, color: "#6b7280", marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 12, fontWeight: 900, color: "#111827" }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                ["Complete React lecture notes", "#185FA5"],
                ["Revise DBMS normalization", "#15803d"],
                ["Practice 15 MCQs before evening", "#92400e"],
              ].map(([task, color]) => (
                <div key={task} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#374151" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  {task}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <VirtualIdCard profile={{ ...profile, name: currentStudent.name || profile.name }} student={currentStudent} />

          {/* Today's Focus */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20, flex: 1 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 14 }}>Today's focus</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["Lecture", "Continue React.js videos for Semester 4", "#eff6ff", "#185FA5"],
                ["Test", "Online MCQ practice is available subject-wise", "#f0fdf4", "#166534"],
                ["Notice", latestAnnouncement?.title || "No new notice", "#fef3c7", "#92400e"],
              ].map(([label, value, bg, color]) => (
                <div key={label} style={{ background: bg, border: "1px solid #e5e7eb", borderRadius: 12, padding: "11px 12px" }}>
                  <div style={{ fontSize: 10, color, fontWeight: 800, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 12, color: "#111827", fontWeight: 700, lineHeight: 1.35 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 16, alignItems: "start" }}>
        {/* Upcoming deadlines */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 14 }}>Upcoming deadlines</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pendingAssignments.slice(0, 3).map(a => (
              <div key={a.id} style={{ border: "1px solid #f3f4f6", borderRadius: 12, padding: 14, background: "#fff", display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#111827", marginBottom: 5 }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{a.subject} · {getOfficialTeacherName(a.subject, a.teacher)}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 10, color: "#9ca3af" }}>Due</div>
                  <div style={{ fontSize: 12, fontWeight: 900, color: "#111827" }}>{a.submissionDate}</div>
                </div>
              </div>
            ))}
            {!pendingAssignments.length && (
              <div style={{ border: "1px dashed #d1d5db", borderRadius: 12, padding: 16, color: "#6b7280", fontSize: 12, fontWeight: 700, textAlign: "center" }}>
                No pending assignment published right now.
              </div>
            )}
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 14 }}>Academic snapshot</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              ["Pending tasks", pendingAssignments.length],
              ["Unread notices", visibleAnnouncements.filter(a => a.unread).length],
              ["Current sem", currentStudent.semester],
              ["Subjects", attendanceSummary.records.length],
            ].map(([label, value]) => (
              <div key={label} style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: 12, padding: "12px 13px" }}>
                <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#111827", fontFamily: "monospace" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CurrentMonthCalendar = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthName = today.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 18, height: "100%", boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 14 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 900, color: "#111827", margin: 0 }}>This Month calender</h3>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{monthName}</div>
        </div>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: "#eff6ff", color: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, fontFamily: "monospace", flexShrink: 0 }}>
          {today.getDate()}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 8 }}>
        {weekDays.map(day => (
          <div key={day} style={{ textAlign: "center", fontSize: 10, color: "#6b7280", fontWeight: 900 }}>
            {day}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
        {days.map((day, index) => {
          const isToday = day === today.getDate();
          return (
            <div
              key={`${day || "blank"}-${index}`}
              style={{
                minHeight: 34,
                borderRadius: 10,
                border: day ? `1px solid ${isToday ? "#185FA5" : "#f3f4f6"}` : "1px solid transparent",
                background: day ? isToday ? "#185FA5" : "#f9fafb" : "transparent",
                color: isToday ? "#fff" : "#111827",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: isToday ? 900 : 800,
                fontFamily: "monospace",
              }}
            >
              {day || ""}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 14, borderTop: "1px solid #f3f4f6", paddingTop: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#6b7280", fontWeight: 700 }}>
        <span style={{ width: 10, height: 10, borderRadius: 999, background: "#185FA5", display: "inline-block" }} />
        Today is highlighted automatically.
      </div>
    </div>
  );
};

const AttendancePage = ({ student = STUDENT }) => {
  const currentStudent = normalizeStudentRecord(student);
  const attendanceSummary = getAttendanceSummary(currentStudent.attendanceRecords);

  return (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14 }}>
      {[
        ["Overall attendance", `${attendanceSummary.pct}%`],
        ["Present classes", attendanceSummary.totalPresent],
        ["Total classes held", attendanceSummary.totalClasses],
        ["Subjects", attendanceSummary.records.length],
      ].map(([label, value]) => (
        <div key={label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 18 }}>
          <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>{label}</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#111827", fontFamily: "monospace" }}>{value}</div>
        </div>
      ))}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 340px)", gap: 16, alignItems: "stretch" }}>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24, minWidth: 0 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 20 }}>Subject-wise attendance</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={attendanceSummary.records} margin={{ left: -10 }}>
            <XAxis dataKey="subject" tick={{ fontSize: 11, fill: "#6b7280" }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#6b7280" }} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
              {attendanceSummary.records.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <CurrentMonthCalendar />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 12 }}>
      {attendanceSummary.records.map(s => (
        <div key={s.subject} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 6 }}>{s.subject}</div>
            <div style={{ height: 8, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: `${s.pct}%`, height: "100%", background: s.color, borderRadius: 99 }} />
            </div>
            <div style={{ fontSize: 10, color: "#6b7280", marginTop: 5 }}>{s.present} present / {s.held} held</div>
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: s.warn ? "#dc2626" : "#111827", fontFamily: "monospace", minWidth: 48, textAlign: "right" }}>{s.pct}%</div>
          {s.warn && <span style={{ fontSize: 11, background: "#fee2e2", color: "#991b1b", padding: "3px 8px", borderRadius: 8 }}>⚠ Low</span>}
        </div>
      ))}
    </div>
  </div>
  );
};

const CoursesPage = ({ facultyMembers = TEACHERS }) => {
  const visibleFacultyMembers = normalizeFacultyMembers(facultyMembers);

  return (
  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
    <div style={{ background: "linear-gradient(135deg, #185FA5, #0f766e)", borderRadius: 18, padding: 24, color: "#fff", display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap", overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", right: -40, top: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.72)", marginBottom: 6 }}>Current course</div>
        <h3 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 8px", color: "#fff" }}>{STUDENT.course} · Bachelor of Computer Applications</h3>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.78)" }}>{STUDENT.session} · {STUDENT.department}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(88px, 1fr))", gap: 10, position: "relative", zIndex: 1 }}>
        {[
          ["Duration", "3 Years"],
          ["Semester", `${STUDENT.semester}/${STUDENT.totalSemesters}`],
          ["Admission", STUDENT.admissionDate],
        ].map(([label, value]) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 13, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#fff" }}>{value}</div>
          </div>
        ))}
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 18, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 900, color: "#111827", margin: "0 0 14px" }}>Semester progress</h3>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${STUDENT.totalSemesters}, 1fr)`, gap: 8 }}>
            {Array.from({ length: STUDENT.totalSemesters }, (_, index) => {
              const sem = index + 1;
              const active = sem === STUDENT.semester;
              const done = sem < STUDENT.semester;
              return (
                <div key={sem} style={{ border: `1px solid ${active ? "#bfdbfe" : done ? "#bbf7d0" : "#e5e7eb"}`, background: active ? "#eff6ff" : done ? "#f0fdf4" : "#f9fafb", borderRadius: 12, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: active ? "#185FA5" : done ? "#166534" : "#6b7280" }}>Sem {sem}</div>
                  <div style={{ fontSize: 10, color: "#6b7280", marginTop: 3 }}>{active ? "Current" : done ? "Completed" : "Upcoming"}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 900, color: "#111827", margin: "0 0 14px" }}>Faculty members</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 14 }}>
            {visibleFacultyMembers.map(teacher => (
              <div key={teacher.id} style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 14, background: "#fff" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <div style={{ width: 58, height: 58, borderRadius: 14, overflow: "hidden", border: "1px solid #e5e7eb", background: "#f8fafc", flexShrink: 0 }}>
                    <img
                      src={teacher.photo || cimageLogo}
                      alt={teacher.name}
                      onError={event => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = cimageLogo;
                        event.currentTarget.style.objectFit = "contain";
                        event.currentTarget.style.padding = "7px";
                      }}
                      style={{ width: "100%", height: "100%", objectFit: teacher.photo ? "cover" : "contain", objectPosition: "center top", padding: teacher.photo ? 0 : 7, display: "block", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 900, color: "#111827" }}>{teacher.name}</div>
                    <div style={{ fontSize: 11, color: "#185FA5", fontWeight: 800 }}>{teacher.subject}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[["Education", teacher.education], ["Joined", teacher.joined]].map(([label, value]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <span style={{ fontSize: 10, color: "#6b7280" }}>{label}</span>
                      <span style={{ fontSize: 11, color: "#111827", fontWeight: 800, textAlign: "right" }}>{value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
                  <a
                    href={getDialHref(teacher.phone)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, minHeight: 38, borderRadius: 10, background: "#eff6ff", color: "#185FA5", border: "1px solid #bfdbfe", textDecoration: "none", fontSize: 12, fontWeight: 900 }}
                    aria-label={`Call ${teacher.name}`}
                  >
                    <Icon name="phone" size={14} />
                    Call
                  </a>
                  <a
                    href={getWhatsAppHref(teacher.whatsapp || teacher.phone, teacher.name)}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, minHeight: 38, borderRadius: 10, background: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0", textDecoration: "none", fontSize: 12, fontWeight: 900 }}
                    aria-label={`Open WhatsApp chat with ${teacher.name}`}
                  >
                    <Icon name="whatsapp" size={14} />
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  </div>
  );
};

const FeesPage = () => {
  const feePct = Math.round((FEES.paid / FEES.total) * 100);
  const pieData = [{ name: "Paid", value: FEES.paid }, { name: "Due", value: FEES.due }];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 12, color: "#166534", marginBottom: 6 }}>Total paid</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#14532d", fontFamily: "monospace" }}>₹{FEES.paid.toLocaleString()}</div>
        </div>
        <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 12, color: "#991b1b", marginBottom: 6 }}>Amount due</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#7f1d1d", fontFamily: "monospace" }}>₹{FEES.due.toLocaleString()}</div>
        </div>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 16 }}>Payment breakdown</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                <Cell fill="#15803d" />
                <Cell fill="#fca5a5" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 3 }}>Progress</div>
              <div style={{ height: 10, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ width: `${feePct}%`, height: "100%", background: "linear-gradient(90deg,#15803d,#22c55e)", borderRadius: 99 }} />
              </div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{feePct}% of ₹{(FEES.total / 1000).toFixed(0)},000 paid</div>
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div><span style={{ display: "inline-block", width: 10, height: 10, background: "#15803d", borderRadius: 2, marginRight: 5 }} />Paid</div>
              <div><span style={{ display: "inline-block", width: 10, height: 10, background: "#fca5a5", borderRadius: 2, marginRight: 5 }} />Due</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button style={{ padding: "12px 40px", background: "#185FA5", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Pay ₹{FEES.due.toLocaleString()} now →
        </button>
      </div>
    </div>
  );
};

const AssignmentsPage = ({ assignments = ASSIGNMENTS }) => {
  const visibleAssignments = normalizeAssignments(assignments);

  if (!visibleAssignments.length) {
    return (
      <div style={{ background: "#fff", border: "1px dashed #d1d5db", borderRadius: 16, padding: 28, textAlign: "center", color: "#6b7280", fontSize: 13, fontWeight: 700 }}>
        No assignments have been published by admin yet.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {visibleAssignments.map(a => (
        <div key={a.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 8 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#111827", marginBottom: 4 }}>{a.title}</div>
              <span style={{ fontSize: 11, background: "#dbeafe", color: "#1e40af", padding: "2px 8px", borderRadius: 6, fontWeight: 800 }}>{a.subject}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#185FA5", fontFamily: "monospace" }}>{a.totalMarks}</div>
              <div style={{ fontSize: 10, color: "#6b7280" }}>Total marks</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "#4b5563", margin: "10px 0", lineHeight: 1.5 }}>{a.desc || "Download the assignment PDF and follow the teacher instructions."}</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginTop: 14 }}>
            {[
              ["Subject", a.subject],
              ["Teacher", getOfficialTeacherName(a.subject, a.teacher)],
              ["Given date", a.givenDate],
              ["Submission date", a.submissionDate],
              ["Status", a.status],
            ].map(([label, value]) => (
              <div key={label} style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 3 }}>{label}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#111827", textTransform: label === "Status" ? "capitalize" : "none" }}>{value || "Not set"}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", borderTop: "1px solid #f9fafb", paddingTop: 12, marginTop: 14, flexWrap: "wrap" }}>
            <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 700 }}>{a.pdfName || "No PDF file attached"}</div>
            {a.pdfDataUrl ? (
              <a href={a.pdfDataUrl} download={a.pdfName || `${a.title || "assignment"}.pdf`} style={{ ...btnStyle, background: "#dbeafe", color: "#1e40af", borderColor: "#bfdbfe", padding: "8px 12px", fontWeight: 800, textDecoration: "none" }}>
                <Icon name="download" size={14} /> Download PDF Assignment
              </a>
            ) : (
              <button disabled style={{ ...btnStyle, background: "#f3f4f6", color: "#9ca3af", borderColor: "#e5e7eb", padding: "8px 12px", fontWeight: 800, cursor: "not-allowed" }}>
                <Icon name="download" size={14} /> PDF not uploaded
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const LecturesPage = () => {
  const [selectedSemester, setSelectedSemester] = useState(STUDENT.semester);
  const [isPersonalVideos, setIsPersonalVideos] = useState(false);
  
  const videosSource = isPersonalVideos ? PERSONAL_VIDEOS_BY_SEMESTER : LECTURES_BY_SEMESTER;
  const semesterLectures = videosSource[selectedSemester];
  const [selectedSubject, setSelectedSubject] = useState(semesterLectures[0]);
  const [selectedVideo, setSelectedVideo] = useState(semesterLectures[0].videos[0]);

  const chooseSemester = (semester) => {
    const nextLectures = videosSource[semester];
    setSelectedSemester(semester);
    setSelectedSubject(nextLectures[0]);
    setSelectedVideo(nextLectures[0].videos[0]);
  };

  const chooseSubject = (lecture) => {
    setSelectedSubject(lecture);
    setSelectedVideo(lecture.videos[0]);
  };

  const toggleVideoSource = (usePersonal) => {
    setIsPersonalVideos(usePersonal);
    const newSource = usePersonal ? PERSONAL_VIDEOS_BY_SEMESTER : LECTURES_BY_SEMESTER;
    const newLectures = newSource[selectedSemester];
    setSelectedSubject(newLectures[0]);
    setSelectedVideo(newLectures[0].videos[0]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>{isPersonalVideos ? "Personal videos" : "Semester lectures"}</h3>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            {isPersonalVideos 
              ? "Your personal YouTube videos organized by semester." 
              : "Official lecture videos organized by semester."}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 10, padding: 4, gap: 4 }}>
            <button
              onClick={() => toggleVideoSource(false)}
              style={{
                background: !isPersonalVideos ? "#fff" : "transparent",
                border: "none",
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: 12,
                fontWeight: 700,
                color: !isPersonalVideos ? "#185FA5" : "#6b7280",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Semester Lectures
            </button>
            <button
              onClick={() => toggleVideoSource(true)}
              style={{
                background: isPersonalVideos ? "#fff" : "transparent",
                border: "none",
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: 12,
                fontWeight: 700,
                color: isPersonalVideos ? "#185FA5" : "#6b7280",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Personal Videos
            </button>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Select semester</span>
            <select
              value={selectedSemester}
              onChange={event => chooseSemester(Number(event.target.value))}
              style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#111827", background: "#fff", outline: "none", minWidth: 140 }}
            >
              {Array.from({ length: STUDENT.totalSemesters }, (_, index) => index + 1).map(semester => (
                <option key={semester} value={semester}>Semester {semester}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
        {semesterLectures.map(lecture => {
          const selected = selectedSubject.subject === lecture.subject;
          return (
            <button
              key={lecture.subject}
              onClick={() => chooseSubject(lecture)}
              style={{
                background: selected ? "#eff6ff" : "#fff",
                border: `1px solid ${selected ? "#bfdbfe" : "#e5e7eb"}`,
                borderRadius: 14,
                padding: 16,
                textAlign: "left",
                cursor: "pointer",
                boxShadow: selected ? "0 12px 24px rgba(24, 95, 165, 0.12)" : "none",
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, background: lecture.color || "#185FA5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <Icon name="lectures" size={17} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", marginBottom: 4 }}>{lecture.subject}</div>
              {lecture.teacher && <div style={{ fontSize: 11, color: "#6b7280" }}>{getOfficialTeacherName(lecture.subject, lecture.teacher)}</div>}
              <div style={{ fontSize: 11, color: "#185FA5", fontWeight: 700, marginTop: 10 }}>{lecture.videos.length} videos</div>
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2.4fr) minmax(280px, 0.8fr)", gap: 16, alignItems: "start" }}>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>{selectedVideo.title}</h3>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{selectedSubject.subject} {selectedSubject.teacher && `· ${getOfficialTeacherName(selectedSubject.subject, selectedSubject.teacher)}`}</div>
            </div>
            <span style={{ fontSize: 11, background: "#dcfce7", color: "#166534", padding: "4px 9px", borderRadius: 999, fontWeight: 700 }}>{selectedVideo.duration}</span>
          </div>

          <div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", minHeight: 420, borderRadius: 14, overflow: "hidden", background: "#111827" }}>
            <iframe
              title={selectedVideo.title}
              src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 18, position: "sticky", top: 82 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: "#111827", marginBottom: 12 }}>Video list</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 520, overflowY: "auto", paddingRight: 4 }}>
            {selectedSubject.videos.map((video, index) => {
              const selected = selectedVideo.title === video.title;
              return (
                <button
                  key={video.title}
                  onClick={() => setSelectedVideo(video)}
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    width: "100%",
                    textAlign: "left",
                    background: selected ? "#eff6ff" : "#f9fafb",
                    border: `1px solid ${selected ? "#bfdbfe" : "#f3f4f6"}`,
                    borderRadius: 12,
                    padding: 12,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: selected ? "#185FA5" : "#e5e7eb", color: selected ? "#fff" : "#4b5563", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, fontWeight: 800 }}>
                    {index + 1}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#111827", marginBottom: 3 }}>{video.title}</div>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>{selectedSubject.teacher ? getOfficialTeacherName(selectedSubject.subject, selectedSubject.teacher) : "Personal video"} · {video.duration}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const GalleryPage = () => {
  const [selectedCollectionId, setSelectedCollectionId] = useState("all");
  const [galleryEvents, setGalleryEvents] = useState(GALLERY_EVENTS);

  useEffect(() => {
    let ignore = false;

    const loadLocalImages = async () => {
      const paths = ["/imgs/images.json", "/imgs/imgages.json"];

      for (const path of paths) {
        try {
          const response = await fetch(path);
          if (!response.ok) continue;

          const records = await response.json();
          const images = records
            .map((record, index) => {
              const imageSource = typeof record === "string" ? record : record.file || record.path || record.image || record.url || record.src;
              if (!imageSource) return null;
              const url = imageSource.startsWith("data:") || imageSource.startsWith("http") || imageSource.startsWith("/")
                ? imageSource
                : `/imgs/${imageSource}`;

              return {
                title: record.title || `College photo ${index + 1}`,
                description: record.description || "Uploaded college gallery image.",
                uploadDate: record.uploadDate || "13 May 2026",
                url,
                hd: record.hd || url,
              };
            })
            .filter(Boolean);

          if (!ignore && images.length > 0) {
            const localCollection = {
              id: "local-images",
              title: "My uploaded images",
              date: "13 May 2026",
              venue: path.replace("/", "public/"),
              description: "Images loaded directly from the frontend public image JSON file.",
              images,
            };

            setGalleryEvents([localCollection, ...GALLERY_EVENTS]);
          }
          return;
        } catch {
          // Try the next known filename.
        }
      }
    };

    loadLocalImages();

    return () => {
      ignore = true;
    };
  }, []);

  const downloadImage = async (image, eventTitle) => {
    const link = document.createElement("a");
    const fileName = `${eventTitle}-${image.title}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    try {
      const response = await fetch(image.hd);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      link.href = objectUrl;
      link.download = `${fileName}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      link.href = image.hd;
      link.download = `${fileName}.jpg`;
      link.target = "_blank";
      link.rel = "noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const todayUploadDate = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const galleryImages = galleryEvents.flatMap(event =>
    event.images.map(image => ({ ...image, collectionTitle: event.title }))
  );
  const categoryIncludes = (image, terms) => {
    const text = `${image.collectionTitle} ${image.title} ${image.description || ""}`.toLowerCase();
    return terms.some(term => text.includes(term));
  };
  const collections = [
    {
      id: "all",
      title: "All images",
      images: galleryImages,
    },
    {
      id: "today-uploaded",
      title: "Today uploaded",
      images: galleryImages.filter(image => image.uploadDate === todayUploadDate),
    },
    {
      id: "annual-tech-fest",
      title: "Annual Tech Fest",
      images: galleryImages.filter(image => categoryIncludes(image, ["annual", "tech fest", "coding competition", "project presentation"])),
    },
    {
      id: "placement-workshop",
      title: "Placement / Workshop",
      images: galleryImages.filter(image => categoryIncludes(image, ["placement", "workshop", "resume", "interview", "group discussion"])),
    },
    {
      id: "cultural-event",
      title: "Cultural Event",
      images: galleryImages.filter(image => categoryIncludes(image, ["cultural", "freshers", "stage performance", "award ceremony"])),
    },
  ];
  const selectedCollection = collections.find(collection => collection.id === selectedCollectionId) || collections[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 2 }}>
        {collections.map(collection => {
          const selected = collection.id === selectedCollection.id;

          return (
            <button
              key={collection.id}
              type="button"
              onClick={() => setSelectedCollectionId(collection.id)}
              style={{
                border: `1px solid ${selected ? "#185FA5" : "#d1d5db"}`,
                background: selected ? "#185FA5" : "#fff",
                color: selected ? "#fff" : "#374151",
                borderRadius: 999,
                padding: "9px 14px",
                fontSize: 12,
                fontWeight: 900,
                cursor: "pointer",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {collection.title}
              <span style={{
                minWidth: 22,
                height: 22,
                padding: "0 7px",
                borderRadius: 999,
                background: selected ? "rgba(255,255,255,0.18)" : "#eff6ff",
                color: selected ? "#fff" : "#185FA5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
              }}>
                {collection.images.length}
              </span>
            </button>
          );
        })}
      </div>

      {selectedCollection.images.length === 0 ? (
        <div style={{ border: "1px dashed #d1d5db", borderRadius: 12, padding: 24, textAlign: "center", color: "#6b7280", fontSize: 13 }}>
          No images in this category.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
          {selectedCollection.images.map((image, index) => (
            <div key={`${image.collectionTitle}-${image.title}-${index}`} style={{ position: "relative", borderRadius: 12, overflow: "hidden", background: "#111827", aspectRatio: "4 / 3", border: "1px solid #e5e7eb" }}>
              <img src={image.url} alt={image.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: 10, background: "linear-gradient(180deg, rgba(17,24,39,0), rgba(17,24,39,0.82))", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10 }}>
                <span style={{ color: "#fff", fontSize: 11, fontWeight: 900, background: "rgba(17,24,39,0.65)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 999, padding: "6px 9px", backdropFilter: "blur(8px)" }}>
                  {image.uploadDate}
                </span>
                <button
                  type="button"
                  aria-label={`Download ${image.title}`}
                  onClick={() => downloadImage(image, image.collectionTitle)}
                  style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid rgba(255,255,255,0.45)", background: "rgba(17,24,39,0.76)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(8px)", flexShrink: 0 }}
                >
                  <Icon name="download" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const OnlineTestPage = ({ testReports, onSaveReport }) => {
  const [selectedSemester, setSelectedSemester] = useState(STUDENT.semester);
  const semesterSubjects = LECTURES_BY_SEMESTER[selectedSemester];
  const [selectedSubjectName, setSelectedSubjectName] = useState(semesterSubjects[0].subject);
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const selectedSubject = semesterSubjects.find(item => item.subject === selectedSubjectName) || semesterSubjects[0];
  const questions = getSubjectQuestions(selectedSubject.subject, selectedSemester);
  const marksPerQuestion = TEST_SETTINGS?.marksPerQuestion || 2;
  const totalMarks = questions.length * marksPerQuestion;
  const subjectAttempts = testReports.filter(report => report.semester === selectedSemester && report.subject === selectedSubject.subject);
  const latestReport = subjectAttempts[0];

  const resetTestState = () => {
    setStarted(false);
    setAnswers({});
    setResult(null);
  };

  const chooseSemester = (semester) => {
    const nextSubjects = LECTURES_BY_SEMESTER[semester];
    setSelectedSemester(semester);
    setSelectedSubjectName(nextSubjects[0].subject);
    resetTestState();
  };

  const chooseSubject = (subject) => {
    setSelectedSubjectName(subject);
    resetTestState();
  };

  const beginTest = () => {
    setAnswers({});
    setResult(null);
    setStarted(true);
  };

  const submitTest = () => {
    if (!questions.length) return;

    const correctCount = questions.filter((item, index) => answers[index] === item.answer).length;
    const obtainedMarks = correctCount * marksPerQuestion;
    const { completionDate, completionTime } = getNowReportTime();
    const attemptNumber = subjectAttempts.length + 1;
    const subjectSlug = selectedSubject.subject.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const report = {
      id: `sem-${selectedSemester}-${subjectSlug}-attempt-${attemptNumber}-${Date.now()}`,
      title: `${selectedSubject.subject} Online Test`,
      semester: selectedSemester,
      subject: selectedSubject.subject,
      teacher: getOfficialTeacherName(selectedSubject.subject, selectedSubject.teacher),
      attemptNumber,
      testDate: completionDate,
      completionTime,
      obtainedMarks,
      totalMarks,
      correctCount,
      totalQuestions: questions.length,
    };

    setResult(report);
    onSaveReport(report);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: "#111827", margin: "0 0 6px" }}>Online Test</h3>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Select semester and subject. Retakes are allowed and every attempt is saved in Activities.</div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#374151" }}>Semester</span>
              <select value={selectedSemester} onChange={event => chooseSemester(Number(event.target.value))} style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#111827", background: "#fff", minWidth: 150 }}>
                {Array.from({ length: STUDENT.totalSemesters }, (_, index) => index + 1).map(semester => (
                  <option key={semester} value={semester}>Semester {semester}</option>
                ))}
              </select>
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#374151" }}>Subject</span>
              <select value={selectedSubject.subject} onChange={event => chooseSubject(event.target.value)} style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#111827", background: "#fff", minWidth: 220 }}>
                {semesterSubjects.map(subject => (
                  <option key={subject.subject} value={subject.subject}>{subject.subject}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 6px" }}>{selectedSubject.subject} Online Test</h3>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Semester {selectedSemester} · {getOfficialTeacherName(selectedSubject.subject, selectedSubject.teacher)}</div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              ["Questions", questions.length],
              ["Each", `${marksPerQuestion} marks`],
              ["Marks", totalMarks],
              ["Attempts", subjectAttempts.length],
            ].map(([label, value]) => (
              <div key={label} style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: 10, padding: "8px 11px", minWidth: 70 }}>
                <div style={{ fontSize: 10, color: "#6b7280" }}>{label}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#111827" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {questions.length === 0 && (
          <div style={{ border: "1px dashed #d1d5db", background: "#f9fafb", borderRadius: 14, padding: 18, color: "#6b7280", fontSize: 13, fontWeight: 700 }}>
            No MCQs are configured for this subject in portalData.json.
          </div>
        )}

        {latestReport && !started && !result && (
          <div style={{ border: "1px solid #bfdbfe", background: "#eff6ff", borderRadius: 14, padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#1e40af", marginBottom: 4 }}>Latest attempt saved</div>
              <div style={{ fontSize: 12, color: "#1e40af" }}>
                Attempt {latestReport.attemptNumber || subjectAttempts.length}: {latestReport.obtainedMarks}/{latestReport.totalMarks} marks. Total saved attempts: {subjectAttempts.length}.
              </div>
            </div>
            <button disabled={!questions.length} onClick={beginTest} style={{ padding: "11px 18px", background: questions.length ? "#185FA5" : "#9ca3af", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: questions.length ? "pointer" : "not-allowed" }}>
              Retake Test
            </button>
          </div>
        )}

        {!latestReport && !started && !result && questions.length > 0 && (
          <div style={{ border: "1px dashed #bfdbfe", background: "#eff6ff", borderRadius: 14, padding: 18, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#1e40af", marginBottom: 4 }}>Ready to start test</div>
              <div style={{ fontSize: 12, color: "#1e40af" }}>{questions.length} MCQs · {marksPerQuestion} marks each · Total {totalMarks} marks</div>
            </div>
            <button onClick={beginTest} style={{ padding: "11px 18px", background: "#185FA5", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
              Start Test
            </button>
          </div>
        )}

        {started && !result && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {questions.map((item, index) => (
              <div key={item.id || item.question} style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>Q{index + 1}. {item.question}</div>
                  <span style={{ fontSize: 11, color: "#166534", background: "#dcfce7", padding: "3px 8px", borderRadius: 999, fontWeight: 700 }}>{marksPerQuestion} marks</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
                  {item.options.map(option => (
                    <label key={option} style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${answers[index] === option ? "#bfdbfe" : "#e5e7eb"}`, background: answers[index] === option ? "#eff6ff" : "#f9fafb", borderRadius: 10, padding: "10px 12px", cursor: "pointer" }}>
                      <input type="radio" name={`question-${index}`} checked={answers[index] === option} onChange={() => setAnswers(current => ({ ...current, [index]: option }))} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={submitTest} style={{ alignSelf: "flex-end", padding: "11px 20px", background: "#15803d", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
              Complete Test
            </button>
          </div>
        )}

        {result && (
          <div style={{ border: "1px solid #bbf7d0", background: "#f0fdf4", borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#166534", marginBottom: 6 }}>Attempt {result.attemptNumber} completed</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#14532d", fontFamily: "monospace" }}>{result.obtainedMarks}/{result.totalMarks}</div>
            <div style={{ fontSize: 12, color: "#166534", marginTop: 4 }}>Correct answers: {result.correctCount}/{result.totalQuestions}. This report is saved in Activities.</div>
            <button onClick={beginTest} style={{ marginTop: 14, padding: "10px 16px", background: "#15803d", color: "#fff", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 900, cursor: "pointer" }}>
              Retake Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ActivitiesPage = ({ testReports, complaints }) => {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const visibleComplaints = normalizeComplaints(complaints);
  const totalCompleted = testReports.length;
  const averageCorrect = totalCompleted
    ? (testReports.reduce((sum, report) => sum + report.correctCount, 0) / totalCompleted).toFixed(1)
    : "0.0";
  const bestBySubject = Object.values(testReports.reduce((map, report) => {
    const current = map[report.subject];
    if (!current || report.obtainedMarks > current.obtainedMarks) {
      map[report.subject] = report;
    }
    return map;
  }, {})).sort((a, b) => b.obtainedMarks - a.obtainedMarks);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 320px", gap: 16, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: "0 0 6px" }}>Extra curriculum activities</h3>
          <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>Every online test attempt and complaint record is saved here with full details.</p>
        </div>

        {visibleComplaints.map(complaint => (
          <button key={complaint.id} type="button" onClick={() => setSelectedComplaint(complaint)} style={{ background: "#fff", border: "1px solid #bfdbfe", borderRadius: 16, padding: 20, textAlign: "left", cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 900, color: "#111827", marginBottom: 4 }}>Complaint #{complaint.referenceNo}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{complaint.type} · {complaint.date}, {complaint.time}</div>
              </div>
              <span style={{ background: "#dbeafe", color: "#1e40af", borderRadius: 999, padding: "5px 10px", fontSize: 10, fontWeight: 900 }}>{complaint.status}</span>
            </div>
            <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.45, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{complaint.details}</p>
          </button>
        ))}

        {testReports.length === 0 && visibleComplaints.length === 0 ? (
          <div style={{ background: "#fff", border: "1px dashed #d1d5db", borderRadius: 16, padding: 24, textAlign: "center", color: "#6b7280", fontSize: 13 }}>
            No activity record yet. Complete a test or raise a complaint to add your first record.
          </div>
        ) : (
          testReports.map((report, index) => (
            <div key={`${report.id}-${index}`} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#111827", marginBottom: 4 }}>{report.title}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    {report.subject} · {getOfficialTeacherName(report.subject, report.teacher)} · {report.attemptNumber ? `Attempt ${report.attemptNumber}` : "Saved attempt"}
                  </div>
                </div>
                <div style={{ background: "#dbeafe", color: "#1e40af", borderRadius: 12, padding: "9px 12px", textAlign: "center", minWidth: 90 }}>
                  <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "monospace" }}>{report.obtainedMarks}/{report.totalMarks}</div>
                  <div style={{ fontSize: 10, fontWeight: 800 }}>Marks</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
                {[
                  ["Test date", report.testDate],
                  ["Completion time", report.completionTime],
                  ["Semester", `Semester ${report.semester}`],
                  ["Attempt", report.attemptNumber ? `Attempt ${report.attemptNumber}` : "Saved attempt"],
                  ["Correct", `${report.correctCount}/${report.totalQuestions}`],
                ].map(([label, value]) => (
                  <div key={label} style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#111827" }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <aside style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 82 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>Test attempts</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#111827", fontFamily: "monospace" }}>{totalCompleted}</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>Avg. correct</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#111827", fontFamily: "monospace" }}>{averageCorrect}</div>
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 18 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>Best marks by subject</h3>
          <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 14 }}>Repeated subjects are merged. Highest mark is shown.</div>

          {bestBySubject.length === 0 ? (
            <div style={{ border: "1px dashed #d1d5db", borderRadius: 12, padding: 16, textAlign: "center", fontSize: 12, color: "#6b7280" }}>
              No graph data yet.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {bestBySubject.map(report => {
                const pct = Math.round((report.obtainedMarks / report.totalMarks) * 100);
                return (
                  <div key={report.subject}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 11, marginBottom: 5 }}>
                      <span style={{ color: "#374151", fontWeight: 800 }}>{report.subject}</span>
                      <span style={{ color: "#111827", fontFamily: "monospace", fontWeight: 900 }}>{report.obtainedMarks}/{report.totalMarks}</span>
                    </div>
                    <div style={{ height: 10, background: "#f3f4f6", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg, #185FA5, #22c55e)", borderRadius: 999 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      {selectedComplaint && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ width: "min(620px, 100%)", background: "#fff", borderRadius: 18, boxShadow: "0 28px 80px rgba(15,23,42,0.28)", overflow: "hidden" }}>
            <div style={{ padding: 18, background: "#111827", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 900 }}>Complaint #{selectedComplaint.referenceNo || selectedComplaint.id}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)" }}>{selectedComplaint.type} · {selectedComplaint.status}</div>
              </div>
              <button type="button" onClick={() => setSelectedComplaint(null)} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(255,255,255,0.28)", background: "rgba(255,255,255,0.12)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Icon name="x" size={15} />
              </button>
            </div>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
                {[["Name", selectedComplaint.name], ["Student ID", selectedComplaint.studentId], ["Reference No.", selectedComplaint.referenceNo || selectedComplaint.id], ["Session", selectedComplaint.session], ["Date", `${selectedComplaint.date}, ${selectedComplaint.time}`]].map(([label, value]) => (
                  <div key={label} style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: 11, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 12, fontWeight: 900, color: "#111827" }}>{value}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 900, color: "#374151", marginBottom: 6 }}>Complaint details</div>
                <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 14, fontSize: 13, color: "#374151", lineHeight: 1.55 }}>{selectedComplaint.details}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ResultsPage = ({ student = STUDENT, publishedResults = [], facultyMembers = TEACHERS }) => {
  const currentStudent = normalizeStudentRecord(student);
  const officialFacultyMembers = normalizeFacultyMembers(facultyMembers);
  const studentResults = normalizePublishedResults(publishedResults)
    .filter(result =>
      result.studentRecordId === currentStudent.id ||
      (result.studentId && result.studentId === currentStudent.studentId) ||
      (result.email && result.email === currentStudent.email) ||
      (result.regNo && result.regNo === currentStudent.regNo)
    );
  const [selectedResultId, setSelectedResultId] = useState("");
  const selectedResult = studentResults.find(result => result.id === selectedResultId) || studentResults[0];
  const selectedResultSubjects = selectedResult?.subjects.map(subject => {
    const officialFaculty = officialFacultyMembers.find(faculty => faculty.id === subject.facultyId)
      || officialFacultyMembers.find(faculty => faculty.name === subject.teacher);
    return officialFaculty ? { ...subject, facultyId: officialFaculty.id, subject: officialFaculty.subject, teacher: officialFaculty.name } : subject;
  }) || [];

  useEffect(() => {
    if (!studentResults.length) {
      setSelectedResultId("");
      return;
    }

    if (!studentResults.some(result => result.id === selectedResultId)) {
      setSelectedResultId(studentResults[0].id);
    }
  }, [studentResults, selectedResultId]);

  if (!studentResults.length) {
    return (
      <div style={{ background: "#fff", border: "1px dashed #d1d5db", borderRadius: 16, padding: 30, textAlign: "center", color: "#6b7280", fontSize: 13, fontWeight: 700 }}>
        No result marksheet has been published by admin for your student ID yet.
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {studentResults.map(result => (
          <button
            key={result.id}
            onClick={() => setSelectedResultId(result.id)}
            style={{ ...btnStyle, padding: "9px 12px", background: selectedResult?.id === result.id ? "#185FA5" : "#fff", color: selectedResult?.id === result.id ? "#fff" : "#374151", borderColor: selectedResult?.id === result.id ? "#185FA5" : "#e5e7eb", fontWeight: 800 }}
          >
            {result.examName} · {result.sessional}
          </button>
        ))}
      </div>

      {selectedResult && (
        <div style={{ background: "#fff", border: "1px solid #dbeafe", borderRadius: 18, overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg,#185FA5,#0f766e)", color: "#fff", padding: 22, display: "flex", justifyContent: "space-between", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 5 }}>Cimage Professional College</div>
              <h3 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>Internal Examination Marksheet</h3>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 6 }}>{selectedResult.examName} · {selectedResult.sessional}</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 14, padding: "12px 16px", textAlign: "center", minWidth: 120 }}>
              <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "monospace" }}>{selectedResult.percentage}%</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.72)" }}>Overall</div>
            </div>
          </div>

          <div style={{ padding: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10, marginBottom: 18 }}>
              {[
                ["Student name", selectedResult.studentName],
                ["Student ID", selectedResult.studentId],
                ["Registration No.", selectedResult.regNo],
                ["Roll No.", selectedResult.rollNo],
                ["Course", selectedResult.course],
                ["Session", selectedResult.session],
                ["Published", `${selectedResult.publishedDate || "Not set"} ${selectedResult.publishedTime || ""}`],
              ].map(([label, value]) => (
                <div key={label} style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: 11, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 12, fontWeight: 900, color: "#111827", overflowWrap: "anywhere" }}>{value || "Not set"}</div>
                </div>
              ))}
            </div>

            <div style={{ overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: 14 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    {["Subject", "Faculty", "Obtained marks", "Maximum marks", "Percentage"].map(head => (
                      <th key={head} style={{ padding: "11px 14px", textAlign: "left", fontSize: 11, fontWeight: 900, color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedResultSubjects.map((subject, index) => {
                    const pct = subject.maxMarks ? Math.round((Number(subject.obtainedMarks || 0) / Number(subject.maxMarks)) * 100) : 0;
                    return (
                      <tr key={subject.id} style={{ background: index % 2 === 0 ? "#fff" : "#fafafa" }}>
                        <td style={{ padding: "12px 14px", fontWeight: 800, color: "#111827", borderBottom: "1px solid #f3f4f6" }}>{subject.subject}</td>
                        <td style={{ padding: "12px 14px", color: "#4b5563", borderBottom: "1px solid #f3f4f6" }}>{subject.teacher}</td>
                        <td style={{ padding: "12px 14px", color: "#111827", borderBottom: "1px solid #f3f4f6", fontWeight: 900, fontFamily: "monospace" }}>{subject.obtainedMarks}</td>
                        <td style={{ padding: "12px 14px", color: "#4b5563", borderBottom: "1px solid #f3f4f6", fontFamily: "monospace" }}>{subject.maxMarks}</td>
                        <td style={{ padding: "12px 14px", color: pct < 40 ? "#dc2626" : "#166534", borderBottom: "1px solid #f3f4f6", fontFamily: "monospace", fontWeight: 900 }}>{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
              {[
                ["Total marks", `${selectedResult.totalObtained}/${selectedResult.totalMarks}`],
                ["Percentage", `${selectedResult.percentage}%`],
                ["Grade", selectedResult.grade],
                ["Result status", selectedResult.grade === "F" ? "Needs improvement" : "Published"],
              ].map(([label, value]) => (
                <div key={label} style={{ background: label === "Grade" ? "#eff6ff" : "#f9fafb", border: `1px solid ${label === "Grade" ? "#bfdbfe" : "#f3f4f6"}`, borderRadius: 12, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: label === "Grade" ? "#185FA5" : "#111827", fontFamily: "monospace" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AnnouncementsPage = ({ announcements = ANNOUNCEMENTS, onMarkRead }) => {
  const visibleAnnouncements = normalizeAnnouncements(announcements);

  if (!visibleAnnouncements.length) {
    return (
      <div style={{ background: "#fff", border: "1px dashed #d1d5db", borderRadius: 16, padding: 28, textAlign: "center", color: "#6b7280", fontSize: 13, fontWeight: 700 }}>
        No announcements available right now.
      </div>
    );
  }

  return (
  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    {visibleAnnouncements.map(item => (
      <button key={item.id} onClick={() => onMarkRead?.(item.id)} style={{ background: "#fff", border: `1px solid ${item.unread ? "#bfdbfe" : "#e5e7eb"}`, borderRadius: 16, padding: 20, textAlign: "left", cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: item.unread ? "#dbeafe" : "#f3f4f6", color: item.unread ? "#185FA5" : "#6b7280", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="megaphone" size={16} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{item.category} · {item.date}</div>
            </div>
          </div>
          {item.unread && <span style={{ fontSize: 10, fontWeight: 700, color: "#1e40af", background: "#dbeafe", padding: "3px 8px", borderRadius: 999 }}>New</span>}
        </div>
        <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.5, margin: "10px 0 0" }}>{item.message}</p>
      </button>
    ))}
  </div>
  );
};

const SettingsPage = ({ profile, student = STUDENT, onSave }) => {
  const currentStudent = normalizeStudentRecord(student);
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);

  const updateDraft = (key, value) => {
    setSaved(false);
    setDraft(current => ({ ...current, [key]: value }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => updateDraft("photo", reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanedProfile = {
      ...draft,
      name: draft.name.trim() || profile.name,
      phone: draft.phone.trim(),
      email: profile.email,
    };
    setDraft(cleanedProfile);
    onSave(cleanedProfile);
    setSaved(true);
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 10,
    fontSize: 13,
    color: "#111827",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 18 }}>Profile settings</h3>

        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22 }}>
          <Avatar profile={draft} size={76} fontSize={22} />
          <div>
            <label style={{ ...btnStyle, padding: "8px 12px", display: "inline-flex" }}>
              <Icon name="upload" size={14} /> Upload photo
              <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
            </label>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 8 }}>JPG or PNG photo for your student profile.</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Full name</span>
            <input value={draft.name} onChange={event => updateDraft("name", event.target.value)} style={inputStyle} />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Phone</span>
            <input value={draft.phone} onChange={event => updateDraft("phone", event.target.value)} style={inputStyle} />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Email</span>
            <input value={profile.email} readOnly style={{ ...inputStyle, background: "#f9fafb", color: "#6b7280", cursor: "not-allowed" }} />
            <span style={{ fontSize: 11, color: "#6b7280" }}>Email can be changed by admin only.</span>
          </label>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Student ID</span>
            <div style={{ ...inputStyle, background: "#f9fafb", color: "#6b7280" }}>{currentStudent.studentId}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 22 }}>
          <button type="submit" style={{ padding: "10px 18px", background: "#185FA5", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            Save settings
          </button>
          {saved && <span style={{ fontSize: 12, fontWeight: 600, color: "#166534" }}>Settings saved successfully.</span>}
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 16 }}>Notifications</h3>
        {["Email alerts", "SMS alerts", "Push notifications"].map((label, index) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: index < 2 ? "1px solid #f9fafb" : "none" }}>
            <span style={{ fontSize: 13, color: "#374151" }}>{label}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: index === 1 ? "#6b7280" : "#111827" }}>{index === 1 ? "Disabled" : "Enabled"}</span>
          </div>
        ))}
      </div>
    </form>
  );
};

// ─── Button style ─────────────────────────────────────────────────────────────

const btnStyle = {
  display: "inline-flex", alignItems: "center", gap: 5,
  fontSize: 11, padding: "5px 10px", borderRadius: 8,
  border: "1px solid #e5e7eb", background: "#f9fafb",
  color: "#374151", cursor: "pointer", fontWeight: 500,
};

const fieldStyle = {
  width: "100%",
  padding: "11px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 10,
  fontSize: 13,
  color: "#111827",
  outline: "none",
  boxSizing: "border-box",
};

const LoginPage = ({ students = [], adminUsers = [], onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const registeredStudents = normalizeStudentRecords(students);
  const registeredAdmins = normalizeAdminUsers(adminUsers);

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError("Enter your registered email and password.");
      return;
    }

    const adminAccount = registeredAdmins.find(admin => admin.email === cleanEmail);

    if (adminAccount) {
      if (adminAccount.status !== "Active") {
        setError("This admin account is not active.");
        return;
      }
      if (adminAccount.password !== cleanPassword) {
        setError("Incorrect admin password.");
        return;
      }
      onLogin({ role: "admin", email: cleanEmail, name: adminAccount.name, adminId: adminAccount.id });
      return;
    }

    const studentAccount = registeredStudents.find(student => student.email === cleanEmail);

    if (!studentAccount) {
      setError("This email is not registered by admin.");
      return;
    }

    if (studentAccount.status !== "Active") {
      setError("This student account is not active. Please contact admin.");
      return;
    }

    if (studentAccount.password !== cleanPassword) {
      setError("Incorrect student password.");
      return;
    }

    onLogin({ role: "student", email: cleanEmail, studentId: studentAccount.id });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "grid", placeItems: "center", padding: 24, fontFamily: "'Sora', 'Segoe UI', system-ui, sans-serif" }}>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 390, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 26, boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <div style={{ width: 48, height: 48, border: "1px solid #e5e7eb", borderRadius: 12, padding: 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={cimageLogo} alt="Cimage College" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>Cimage Portal</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Student and admin login</div>
          </div>
        </div>

        <label style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Email</span>
          <input value={email} onChange={event => { setEmail(event.target.value); setError(""); }} placeholder="registered email" style={fieldStyle} />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Password</span>
          <input type="password" value={password} onChange={event => { setPassword(event.target.value); setError(""); }} placeholder="Enter password" style={fieldStyle} />
        </label>

        {error && <div style={{ background: "#fee2e2", color: "#991b1b", border: "1px solid #fecaca", borderRadius: 10, padding: "9px 11px", fontSize: 12, marginBottom: 14 }}>{error}</div>}

        <button type="submit" style={{ width: "100%", padding: "11px 0", background: "#185FA5", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
          Login
        </button>

        <div style={{ marginTop: 14, padding: 12, background: "#f9fafb", borderRadius: 10, fontSize: 11, color: "#6b7280", lineHeight: 1.5 }}>
          Students can login only after admin registration. Default admin: <strong>{ADMIN_CREDENTIALS.email}</strong> / <strong>{ADMIN_CREDENTIALS.password}</strong>.
        </div>
      </form>
    </div>
  );
};

const AdminComplaintInbox = ({ complaints = [], onDeleteComplaint, onClearComplaints, onPrintComplaint }) => {
  const visibleComplaints = normalizeComplaints(complaints);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(visibleComplaints[0]?.id || "");
  const query = search.trim().toLowerCase();
  const filteredComplaints = query
    ? visibleComplaints.filter(complaint => complaint.referenceNo.toLowerCase().includes(query))
    : visibleComplaints;
  const selectedComplaint = filteredComplaints.find(complaint => complaint.id === selectedId) || filteredComplaints[0];

  useEffect(() => {
    if (filteredComplaints.length && !filteredComplaints.some(complaint => complaint.id === selectedId)) {
      setSelectedId(filteredComplaints[0].id);
    }

    if (!filteredComplaints.length && selectedId) {
      setSelectedId("");
    }
  }, [filteredComplaints, selectedId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20, display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: "#111827", margin: 0 }}>Complaint Inbox</h2>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 5 }}>Open complaints, search by reference number, print PDF, and delete resolved records.</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <input
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search reference no."
            style={{ ...fieldStyle, width: 230, padding: "10px 12px" }}
          />
          {visibleComplaints.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Delete all complaint records?")) onClearComplaints();
              }}
              style={{ ...btnStyle, padding: "10px 12px", background: "#fee2e2", color: "#991b1b", borderColor: "#fecaca" }}
            >
              <Icon name="x" size={14} /> Clear all
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px minmax(0, 1fr)", gap: 18, alignItems: "start" }}>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: 14, borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: "#111827" }}>Inbox</div>
            <span style={{ fontSize: 11, color: "#185FA5", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 999, padding: "3px 8px", fontWeight: 900 }}>{filteredComplaints.length}</span>
          </div>

          <div style={{ maxHeight: 620, overflowY: "auto" }}>
            {filteredComplaints.length ? filteredComplaints.map(complaint => (
              <button
                key={complaint.id}
                onClick={() => setSelectedId(complaint.id)}
                style={{
                  width: "100%",
                  border: "none",
                  borderBottom: "1px solid #f3f4f6",
                  background: selectedComplaint?.id === complaint.id ? "#eff6ff" : "#fff",
                  padding: 14,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 900, color: "#111827" }}>#{complaint.referenceNo}</div>
                  <div style={{ fontSize: 10, color: "#6b7280", flexShrink: 0 }}>{complaint.date}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#374151", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{complaint.name || "Student"}</div>
                <div style={{ fontSize: 11, color: "#185FA5", marginTop: 3, fontWeight: 800 }}>{complaint.type}</div>
                <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.35, marginTop: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{complaint.details}</div>
              </button>
            )) : (
              <div style={{ padding: 24, textAlign: "center", color: "#6b7280", fontSize: 12, fontWeight: 700 }}>
                {visibleComplaints.length ? "No complaint found for this reference number." : "No complaints submitted yet."}
              </div>
            )}
          </div>
        </div>

        {selectedComplaint ? (
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: 20, background: "linear-gradient(135deg,#185FA5,#0f766e)", color: "#fff", display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900 }}>Reference #{selectedComplaint.referenceNo}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 5 }}>{selectedComplaint.type} · {selectedComplaint.date}, {selectedComplaint.time}</div>
              </div>
              <span style={{ background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.24)", borderRadius: 999, padding: "5px 11px", fontSize: 11, fontWeight: 900 }}>{selectedComplaint.status}</span>
            </div>

            <div style={{ padding: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10, marginBottom: 16 }}>
                {[
                  ["Student Name", selectedComplaint.name],
                  ["Student ID", selectedComplaint.studentId],
                  ["Reg. No.", selectedComplaint.regNo],
                  ["Roll No.", selectedComplaint.rollNo],
                  ["Email", selectedComplaint.email],
                  ["Phone", selectedComplaint.phone],
                  ["Course", selectedComplaint.course],
                  ["Semester", selectedComplaint.semester],
                  ["Department", selectedComplaint.department],
                  ["Session", selectedComplaint.session],
                ].map(([label, value]) => (
                  <div key={label} style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: 11, padding: "10px 12px" }}>
                    <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 12, fontWeight: 900, color: "#111827", overflowWrap: "anywhere" }}>{value || "Not provided"}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: "#374151", marginBottom: 7 }}>Complaint details</div>
                <div style={{ border: "1px solid #e5e7eb", background: "#f9fafb", borderRadius: 12, padding: 15, minHeight: 150, fontSize: 13, color: "#374151", lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{selectedComplaint.details}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 700 }}>Use browser print dialog to save as PDF on this device.</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={() => onPrintComplaint(selectedComplaint)} style={{ ...btnStyle, padding: "10px 13px", background: "#eff6ff", color: "#185FA5", borderColor: "#bfdbfe" }}>
                    <Icon name="download" size={14} /> Print / Save PDF
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete complaint ${selectedComplaint.referenceNo}?`)) onDeleteComplaint(selectedComplaint.id);
                    }}
                    style={{ ...btnStyle, padding: "10px 13px", background: "#fee2e2", color: "#991b1b", borderColor: "#fecaca" }}
                  >
                    <Icon name="x" size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: "#fff", border: "1px dashed #d1d5db", borderRadius: 16, minHeight: 360, display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", fontSize: 13, fontWeight: 700 }}>
            Select a complaint to read details.
          </div>
        )}
      </div>
    </div>
  );
};

const AdminDashboard = ({ students, loggedInStudents, adminUsers = [], currentAdmin, facultyMembers = TEACHERS, assignments = ASSIGNMENTS, publishedResults = [], announcements = ANNOUNCEMENTS, complaints = [], unseenComplaintCount = 0, onAddStudent, onDeleteStudent, onUpdateStudent, onAddAdmin, onUpdateAdmin, onDeleteAdmin, onDeleteComplaint, onClearComplaints, onPrintComplaint, onSaveFaculty, onAddFaculty, onDeleteFaculty, onAddAssignment, onUpdateAssignment, onDeleteAssignment, onClearAssignments, onSaveResult, onDeleteResult, onSendAnnouncement, onViewComplaints, onLogout }) => {
  const [selectedId, setSelectedId] = useState("");
  const normalizedFacultyMembers = normalizeFacultyMembers(facultyMembers);
  const normalizedAssignments = normalizeAssignments(assignments);
  const normalizedPublishedResults = normalizePublishedResults(publishedResults);
  const visibleAnnouncements = normalizeAnnouncements(announcements);
  const visibleComplaints = normalizeComplaints(complaints);
  const visibleAdminUsers = normalizeAdminUsers(adminUsers);
  const [selectedFacultyId, setSelectedFacultyId] = useState("");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState("");
  const [selectedResultId, setSelectedResultId] = useState("");
  const [selectedResultStudentId, setSelectedResultStudentId] = useState("");
  const [selectedResultFacultyId, setSelectedResultFacultyId] = useState("");
  const [selectedAdminId, setSelectedAdminId] = useState(visibleAdminUsers[0]?.id || "");
  const [adminPage, setAdminPage] = useState("dashboard");
  const [studentEditorOpen, setStudentEditorOpen] = useState(false);
  const [adminEditorOpen, setAdminEditorOpen] = useState(false);
  const [facultyEditorOpen, setFacultyEditorOpen] = useState(false);
  const [assignmentEditorOpen, setAssignmentEditorOpen] = useState(false);
  const [creatingFaculty, setCreatingFaculty] = useState(false);
  const [creatingAssignment, setCreatingAssignment] = useState(false);
  const selected = students.find(student => student.id === selectedId) || null;
  const selectedAdmin = visibleAdminUsers.find(admin => admin.id === selectedAdminId) || null;
  const selectedFaculty = normalizedFacultyMembers.find(faculty => faculty.id === selectedFacultyId) || null;
  const selectedAssignment = normalizedAssignments.find(assignment => assignment.id === selectedAssignmentId) || null;
  const selectedResult = normalizedPublishedResults.find(result => result.id === selectedResultId) || null;
  const selectedResultStudent = students.find(student => student.id === selectedResultStudentId) || null;
  const selectedAttendanceSummary = getAttendanceSummary(selected?.attendanceRecords || []);
  const [facultyDraft, setFacultyDraft] = useState(selectedFaculty || {});
  const [assignmentDraft, setAssignmentDraft] = useState({});
  const [resultDraft, setResultDraft] = useState({});
  const [announcementDraft, setAnnouncementDraft] = useState({ title: "", category: "General", message: "" });
  const [announcementSent, setAnnouncementSent] = useState(false);
  const [resultSaved, setResultSaved] = useState(false);
  const [attendanceSaved, setAttendanceSaved] = useState(false);
  const [studentDetailsSaved, setStudentDetailsSaved] = useState(false);
  const [adminDetailsSaved, setAdminDetailsSaved] = useState(false);
  const loggedInCount = students.filter(student => loggedInStudents.includes(student.email)).length;
  const facultyEditorActive = Boolean(facultyEditorOpen && (creatingFaculty || selectedFaculty));
  const canSaveFaculty = Boolean(String(facultyDraft.name || "").trim() && String(facultyDraft.subject || "").trim());
  const assignmentFacultyOptions = normalizedFacultyMembers.filter(faculty => faculty.name && faculty.subject);
  const selectedAssignmentFaculty = assignmentFacultyOptions.find(faculty => faculty.id === assignmentDraft.facultyId) || null;
  const assignmentEditorActive = Boolean(assignmentEditorOpen && (creatingAssignment || selectedAssignment));
  const canSaveAssignment = Boolean(
    String(assignmentDraft.title || "").trim() &&
    selectedAssignmentFaculty &&
    String(assignmentDraft.submissionDateInput || "").trim() &&
    Number(assignmentDraft.totalMarks) > 0
  );
  const resultTotals = getResultTotals(resultDraft.subjects || []);
  const canSaveResult = Boolean(
    selectedResultStudent &&
    Number(resultDraft.semester) &&
    String(resultDraft.sessional || "").trim() &&
    Array.isArray(resultDraft.subjects) &&
    resultDraft.subjects.length &&
    resultDraft.subjects.every(subject =>
      subject.obtainedMarks !== "" &&
      Number(subject.obtainedMarks) >= 0 &&
      Number(subject.obtainedMarks) <= Number(subject.maxMarks || 40)
    )
  );
  const resultFacultyOptions = assignmentFacultyOptions;
  const selectedResultFaculty = resultFacultyOptions.find(faculty => faculty.id === selectedResultFacultyId) || null;
  const complaintIdKey = visibleComplaints.map(complaint => complaint.id).join("|");

  const getBlankFacultyDraft = () => ({
    name: "",
    subject: "",
    education: "",
    joined: "",
    photo: "",
    phone: "",
    whatsapp: "",
  });

  const getBlankAssignmentDraft = () => {
    const today = getDateInputValue();
    return {
      title: "",
      facultyId: "",
      subject: "",
      teacher: "",
      desc: "",
      givenDateInput: today,
      givenDate: formatDateLabel(today),
      submissionDateInput: "",
      submissionDate: "",
      totalMarks: "",
      status: "pending",
      pdfName: "",
      pdfDataUrl: "",
    };
  };

  const getResultDraftForStudent = (student, semester = student?.semester || 1) => {
    const cleanSemester = Number(semester) || 1;
    return {
      semester: cleanSemester,
      examName: `Semester ${cleanSemester}`,
      sessional: "Sessional 1",
      subjects: [],
    };
  };

  const getResultDraftFromRecord = (result) => ({
    semester: result.semester,
    examName: result.examName,
    sessional: result.sessional,
    subjects: result.subjects.map(subject => {
      const officialFaculty = normalizedFacultyMembers.find(faculty => faculty.id === subject.facultyId)
        || normalizedFacultyMembers.find(faculty => faculty.name === subject.teacher);
      return officialFaculty
        ? { ...subject, facultyId: officialFaculty.id, subject: officialFaculty.subject, teacher: officialFaculty.name }
        : { ...subject };
    }),
  });

  const getAssignmentDraftFromRecord = (assignment) => {
    const matchedFaculty = assignmentFacultyOptions.find(faculty => faculty.id === assignment.facultyId)
      || assignmentFacultyOptions.find(faculty => faculty.name === assignment.teacher && faculty.subject === assignment.subject);

    return {
      ...assignment,
      facultyId: matchedFaculty?.id || "",
      teacher: matchedFaculty?.name || "",
      subject: matchedFaculty?.subject || "",
    };
  };

  useEffect(() => {
    if (selectedFaculty) {
      setFacultyDraft(selectedFaculty);
    }
  }, [selectedFaculty?.id]);

  useEffect(() => {
    if (selectedAssignment) {
      setAssignmentDraft(getAssignmentDraftFromRecord(selectedAssignment));
    }
  }, [selectedAssignment?.id]);

  useEffect(() => {
    if (selectedResult) {
      setResultDraft(getResultDraftFromRecord(selectedResult));
    }
  }, [selectedResult?.id]);

  useEffect(() => {
    if (selectedId && !students.some(student => student.id === selectedId)) {
      setSelectedId("");
      setStudentEditorOpen(false);
    }
  }, [selectedId, students]);

  useEffect(() => {
    if (selectedAdminId && !visibleAdminUsers.some(admin => admin.id === selectedAdminId)) {
      setSelectedAdminId("");
      setAdminEditorOpen(false);
    }
  }, [selectedAdminId, visibleAdminUsers]);

  useEffect(() => {
    if (selectedFacultyId && !normalizedFacultyMembers.some(faculty => faculty.id === selectedFacultyId)) {
      setSelectedFacultyId("");
      setFacultyEditorOpen(false);
      setCreatingFaculty(false);
    }
  }, [selectedFacultyId, normalizedFacultyMembers]);

  useEffect(() => {
    if (selectedAssignmentId && !normalizedAssignments.some(assignment => assignment.id === selectedAssignmentId)) {
      setSelectedAssignmentId("");
      setAssignmentEditorOpen(false);
      setCreatingAssignment(false);
    }
  }, [selectedAssignmentId, normalizedAssignments]);

  useEffect(() => {
    if (selectedResultId && !normalizedPublishedResults.some(result => result.id === selectedResultId)) {
      setSelectedResultId("");
      setResultSaved(false);
    }
  }, [selectedResultId, normalizedPublishedResults]);

  useEffect(() => {
    if (adminPage === "complaints" && complaintIdKey) {
      onViewComplaints?.(visibleComplaints.map(complaint => complaint.id));
    }
  }, [adminPage, complaintIdKey]);

  const updateSelected = (key, value) => {
    if (!selected) return;
    setStudentDetailsSaved(false);
    setAttendanceSaved(false);
    onUpdateStudent(selected.id, { [key]: value });
  };

  const updateSelectedAttendance = (index, key, value) => {
    if (!selected) return;
    setAttendanceSaved(false);
    const nextRecords = selectedAttendanceSummary.records.map((record, recordIndex) => {
      if (recordIndex !== index) return record;
      
      if (key === "subject") {
        return { ...record, [key]: value };
      }
      
      const numValue = value === "" ? 0 : Number(value) || 0;
      
      // If updating held, ensure present doesn't exceed held
      if (key === "held") {
        const newHeld = Math.max(0, numValue);
        return { ...record, held: newHeld, present: Math.min(record.present || 0, newHeld) };
      }
      
      // If updating present, cap it at held value
      if (key === "present") {
        return { ...record, present: Math.min(numValue, record.held || 0) };
      }
      
      return { ...record, [key]: numValue };
    });
    onUpdateStudent(selected.id, { attendanceRecords: nextRecords });
  };

  const handleDeleteAttendanceSubject = (index) => {
    if (!selected) return;
    setAttendanceSaved(false);
    onUpdateStudent(selected.id, {
      attendanceRecords: selectedAttendanceSummary.records.filter((_, recordIndex) => recordIndex !== index),
    });
  };

  const handleAddAttendanceSubject = () => {
    if (!selected) return;
    setAttendanceSaved(false);
    onUpdateStudent(selected.id, {
      attendanceRecords: [
        ...selectedAttendanceSummary.records,
        { id: `subject-${Date.now()}`, subject: "", held: 0, present: 0 },
      ],
    });
  };

  const handleSaveAttendance = () => {
    setAttendanceSaved(true);
  };

  const handleSaveStudentDetails = () => {
    setStudentDetailsSaved(true);
  };

  const handleAddStudent = () => {
    const newStudentId = onAddStudent();
    setStudentDetailsSaved(false);
    setAttendanceSaved(false);
    setSelectedId(newStudentId);
    setStudentEditorOpen(true);
  };

  const handleDeleteStudent = () => {
    if (!selected || !window.confirm(`Delete ${selected.name || "this student"}'s portal account?`)) return;
    onDeleteStudent(selected.id);
    setSelectedId("");
    setStudentEditorOpen(false);
  };

  const updateSelectedAdmin = (key, value) => {
    if (!selectedAdmin) return;
    setAdminDetailsSaved(false);
    onUpdateAdmin(selectedAdmin.id, { [key]: value });
  };

  const handleAddAdmin = () => {
    const newAdminId = onAddAdmin();
    setSelectedAdminId(newAdminId);
    setAdminDetailsSaved(false);
    setAdminEditorOpen(true);
  };

  const handleSaveAdminDetails = () => {
    setAdminDetailsSaved(true);
    setAdminEditorOpen(false);
  };

  const handleDeleteAdmin = () => {
    if (!selectedAdmin || selectedAdmin.protected || selectedAdmin.email === currentAdmin?.email) return;
    if (!window.confirm(`Delete admin account ${selectedAdmin.email}?`)) return;
    onDeleteAdmin(selectedAdmin.id);
    setSelectedAdminId("");
    setAdminEditorOpen(false);
  };

  const updateFacultyDraft = (key, value) => {
    setFacultyDraft(current => ({ ...current, [key]: value }));
  };

  const closeFacultyEditor = () => {
    setSelectedFacultyId("");
    setFacultyDraft({});
    setCreatingFaculty(false);
    setFacultyEditorOpen(false);
  };

  const handleAddFaculty = () => {
    setSelectedFacultyId("");
    setFacultyDraft(getBlankFacultyDraft());
    setCreatingFaculty(true);
    setFacultyEditorOpen(true);
  };

  const handleSaveFaculty = () => {
    if (!canSaveFaculty || (!creatingFaculty && !selectedFaculty)) return;
    const cleanedFaculty = {
      ...facultyDraft,
      id: selectedFaculty?.id,
      name: String(facultyDraft.name || "").trim(),
      subject: String(facultyDraft.subject || "").trim(),
      education: String(facultyDraft.education || "").trim(),
      joined: String(facultyDraft.joined || "").trim(),
      photo: String(facultyDraft.photo || "").trim(),
      phone: String(facultyDraft.phone || "").trim(),
      whatsapp: String(facultyDraft.whatsapp || "").trim(),
    };

    if (creatingFaculty) {
      onAddFaculty(cleanedFaculty);
    } else {
      onSaveFaculty(selectedFaculty.id, cleanedFaculty);
    }

    closeFacultyEditor();
  };

  const handleDeleteFaculty = () => {
    if (creatingFaculty) {
      closeFacultyEditor();
      return;
    }

    if (!selectedFaculty) return;

    if (!window.confirm(`Delete faculty ${selectedFaculty.name || "this faculty member"}?`)) return;

    onDeleteFaculty(selectedFaculty.id);
    closeFacultyEditor();
  };

  const updateAssignmentDraft = (key, value) => {
    setAssignmentDraft(current => ({ ...current, [key]: value }));
  };

  const handleAssignmentFacultyChange = (facultyId) => {
    const faculty = assignmentFacultyOptions.find(item => item.id === facultyId);
    setAssignmentDraft(current => ({
      ...current,
      facultyId: faculty?.id || "",
      teacher: faculty?.name || "",
      subject: faculty?.subject || "",
    }));
  };

  const closeAssignmentEditor = () => {
    setSelectedAssignmentId("");
    setAssignmentDraft({});
    setCreatingAssignment(false);
    setAssignmentEditorOpen(false);
  };

  const handleAddAssignment = () => {
    setSelectedAssignmentId("");
    setAssignmentDraft(getBlankAssignmentDraft());
    setCreatingAssignment(true);
    setAssignmentEditorOpen(true);
  };

  const handleAssignmentPdfChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAssignmentDraft(current => ({
        ...current,
        pdfName: file.name,
        pdfDataUrl: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAssignment = () => {
    if (!canSaveAssignment || (!creatingAssignment && !selectedAssignment)) return;
    const submissionDateInput = assignmentDraft.submissionDateInput || toDateInputValue(assignmentDraft.submissionDate);
    const givenDateInput = assignmentDraft.givenDateInput || getDateInputValue();
    const cleanedAssignment = {
      ...assignmentDraft,
      id: selectedAssignment?.id,
      facultyId: selectedAssignmentFaculty.id,
      title: String(assignmentDraft.title || "").trim(),
      subject: String(selectedAssignmentFaculty.subject || "").trim(),
      teacher: String(selectedAssignmentFaculty.name || "").trim(),
      desc: String(assignmentDraft.desc || "").trim(),
      givenDateInput,
      givenDate: formatDateLabel(givenDateInput),
      submissionDateInput,
      submissionDate: formatDateLabel(submissionDateInput),
      deadline: formatDateLabel(submissionDateInput),
      totalMarks: Number(assignmentDraft.totalMarks) || "",
      status: assignmentDraft.status || "pending",
      pdfName: assignmentDraft.pdfName || "",
      pdfDataUrl: assignmentDraft.pdfDataUrl || "",
    };

    if (creatingAssignment) {
      onAddAssignment(cleanedAssignment);
    } else {
      onUpdateAssignment(selectedAssignment.id, cleanedAssignment);
    }

    closeAssignmentEditor();
  };

  const handleDeleteAssignment = () => {
    if (!selectedAssignment) return;
    if (!window.confirm(`Delete assignment ${selectedAssignment.title || "this assignment"}?`)) return;
    onDeleteAssignment(selectedAssignment.id);
    closeAssignmentEditor();
  };

  const handleClearAssignments = () => {
    if (!normalizedAssignments.length) return;
    if (!window.confirm("Delete all published assignments?")) return;
    onClearAssignments();
    closeAssignmentEditor();
  };

  const handleResultStudentChange = (studentId) => {
    const student = students.find(item => item.id === studentId) || null;
    setSelectedResultId("");
    setSelectedResultStudentId(studentId);
    setSelectedResultFacultyId("");
    setResultSaved(false);
    setResultDraft(student ? getResultDraftForStudent(student, student.semester || 1) : {});
  };

  const handleResultSemesterChange = (semester) => {
    const cleanSemester = Number(semester) || 1;
    setSelectedResultFacultyId("");
    setResultSaved(false);
    setResultDraft(current => ({
      ...current,
      semester: cleanSemester,
      examName: `Semester ${cleanSemester}`,
      subjects: [],
    }));
  };

  const updateResultSubjectMarks = (index, value) => {
    setResultSaved(false);
    setResultDraft(current => ({
      ...current,
      subjects: (current.subjects || []).map((subject, subjectIndex) =>
        subjectIndex === index ? { ...subject, obtainedMarks: value === "" ? "" : Number(value) } : subject
      ),
    }));
  };

  const handleAddResultSubject = () => {
    if (!selectedResultFaculty) return;
    setResultSaved(false);
    setResultDraft(current => ({
      ...current,
      subjects: [
        ...(current.subjects || []),
        {
          id: `${selectedResultFaculty.id}-manual-${Date.now()}`,
          facultyId: selectedResultFaculty.id,
          subject: selectedResultFaculty.subject,
          teacher: selectedResultFaculty.name,
          obtainedMarks: "",
          maxMarks: 40,
        },
      ],
    }));
    setSelectedResultFacultyId("");
  };

  const handleDeleteResultSubject = (index) => {
    setResultSaved(false);
    setResultDraft(current => ({
      ...current,
      subjects: (current.subjects || []).filter((_, subjectIndex) => subjectIndex !== index),
    }));
  };

  const handleSelectPublishedResult = (result) => {
    setSelectedResultId(result.id);
    setSelectedResultStudentId(result.studentRecordId);
    setSelectedResultFacultyId("");
    setResultDraft(getResultDraftFromRecord(result));
    setResultSaved(false);
  };

  const handleSaveResult = () => {
    if (!canSaveResult) return;
    const now = new Date();
    const cleanSubjects = (resultDraft.subjects || []).map(subject => ({
      ...subject,
      facultyId: subject.facultyId || "",
      obtainedMarks: Number(subject.obtainedMarks) || 0,
      maxMarks: Number(subject.maxMarks) || 40,
    }));
    const totals = getResultTotals(cleanSubjects);
    const cleanSemester = Number(resultDraft.semester) || 1;
    const resultPayload = {
      id: selectedResult?.id,
      studentRecordId: selectedResultStudent.id,
      studentId: selectedResultStudent.studentId,
      studentName: selectedResultStudent.name,
      email: selectedResultStudent.email,
      regNo: selectedResultStudent.regNo,
      rollNo: selectedResultStudent.rollNo,
      course: selectedResultStudent.course,
      department: selectedResultStudent.department,
      session: selectedResultStudent.session,
      semester: cleanSemester,
      examName: `Semester ${cleanSemester}`,
      sessional: resultDraft.sessional || "Sessional 1",
      subjects: cleanSubjects,
      ...totals,
      publishedDate: selectedResult?.publishedDate || now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      publishedTime: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      updatedAt: now.toISOString(),
    };
    const savedId = onSaveResult(resultPayload);
    setSelectedResultId(savedId || selectedResult?.id || "");
    setResultSaved(true);
  };

  const handleDeleteResult = () => {
    if (!selectedResult) return;
    if (!window.confirm(`Delete ${selectedResult.examName} ${selectedResult.sessional} result for ${selectedResult.studentName || "this student"}?`)) return;
    onDeleteResult(selectedResult.id);
    setSelectedResultId("");
    setResultDraft(selectedResultStudent ? getResultDraftForStudent(selectedResultStudent, selectedResultStudent.semester || 1) : {});
    setResultSaved(false);
  };

  const updateAnnouncementDraft = (key, value) => {
    setAnnouncementSent(false);
    setAnnouncementDraft(current => ({ ...current, [key]: value }));
  };

  const handleSendAnnouncement = (event) => {
    event.preventDefault();
    const cleanedAnnouncement = {
      title: announcementDraft.title.trim(),
      category: announcementDraft.category.trim() || "General",
      message: announcementDraft.message.trim(),
    };

    if (!cleanedAnnouncement.title || !cleanedAnnouncement.message) return;

    onSendAnnouncement(cleanedAnnouncement);
    setAnnouncementDraft({ title: "", category: "General", message: "" });
    setAnnouncementSent(true);
  };

  const adminNavItems = [
    { id: "dashboard", label: "Overview", icon: "dashboard", badge: null },
    { id: "students", label: "Students", icon: "profile", badge: students.length },
    { id: "faculty", label: "Faculty", icon: "courses", badge: normalizedFacultyMembers.length },
    { id: "assignments", label: "Assignments", icon: "assignments", badge: normalizedAssignments.length },
    { id: "results", label: "Results", icon: "results", badge: normalizedPublishedResults.length },
    { id: "announcements", label: "Notifications", icon: "megaphone", badge: visibleAnnouncements.length },
    { id: "admins", label: "Admin Profiles", icon: "settings", badge: visibleAdminUsers.length },
    { id: "complaints", label: "Complaint Inbox", icon: "inbox", badge: unseenComplaintCount > 0 ? unseenComplaintCount : null },
  ];
  const activeAdminPage = adminNavItems.find(item => item.id === adminPage) || adminNavItems[0];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Sora', 'Segoe UI', system-ui, sans-serif" }}>
      <aside style={{ width: 220, background: "#fff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", flexShrink: 0, position: "fixed", left: 0, top: 0, bottom: 0, height: "100vh", overflowY: "auto", zIndex: 30 }}>
        <div style={{ padding: "20px 16px 18px", borderBottom: "1px solid #f3f4f6", marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, border: "1px solid #e5e7eb", borderRadius: 11, padding: 5, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
            <img src={cimageLogo} alt="Cimage College" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div style={{ fontSize: 14, fontWeight: 900, color: "#111827" }}>Admin Portal</div>
          <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 3 }}>Cimage College</div>
        </div>

        <div style={{ fontSize: 9, fontWeight: 800, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 16px 5px" }}>Management</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {adminNavItems.map(item => (
            <button
              key={item.id}
              onClick={() => setAdminPage(item.id)}
              style={{
                width: "100%",
                border: "none",
                borderLeft: `2px solid ${adminPage === item.id ? "#185FA5" : "transparent"}`,
                background: adminPage === item.id ? "#eff6ff" : "transparent",
                color: adminPage === item.id ? "#185FA5" : "#4b5563",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                textAlign: "left",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: adminPage === item.id ? 800 : 600,
              }}
            >
              <Icon name={item.icon} size={16} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge !== null && (
                <span style={{ minWidth: 22, height: 20, borderRadius: 999, background: adminPage === item.id ? "#dbeafe" : "#f3f4f6", color: adminPage === item.id ? "#185FA5" : "#6b7280", fontSize: 10, fontWeight: 900, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 6px" }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={{ marginTop: "auto", padding: 14, borderTop: "1px solid #f3f4f6" }}>
          <div style={{ padding: "10px 11px", border: "1px solid #f3f4f6", borderRadius: 12, background: "#f9fafb", marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentAdmin?.name || "Admin"}</div>
            <div style={{ fontSize: 10, color: "#6b7280", marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentAdmin?.email || "admin"}</div>
          </div>
          <button onClick={onLogout} style={{ ...btnStyle, width: "100%", justifyContent: "center", padding: "9px 12px", background: "#fee2e2", color: "#991b1b", borderColor: "#fecaca" }}>
            <Icon name="logout" size={14} /> Logout
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0, marginLeft: 220 }}>
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "13px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "fixed", top: 0, left: 220, right: 0, zIndex: 25 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#111827" }}>{activeAdminPage.label}</div>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>Manage student portal data</div>
          </div>
          <button
            onClick={() => setAdminPage("complaints")}
            style={{ ...btnStyle, position: "relative", padding: "8px 12px", background: adminPage === "complaints" ? "#185FA5" : "#eff6ff", color: adminPage === "complaints" ? "#fff" : "#185FA5", borderColor: adminPage === "complaints" ? "#185FA5" : "#bfdbfe" }}
          >
            <Icon name="inbox" size={14} /> Inbox
            {unseenComplaintCount > 0 && (
              <span style={{ position: "absolute", top: -7, right: -7, minWidth: 18, height: 18, padding: "0 5px", borderRadius: 999, background: "#dc2626", color: "#fff", border: "2px solid #fff", fontSize: 10, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {unseenComplaintCount}
              </span>
            )}
          </button>
        </div>

      <main style={{ padding: "86px 24px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
        {adminPage === "complaints" ? (
          <AdminComplaintInbox
            complaints={visibleComplaints}
            onDeleteComplaint={onDeleteComplaint}
            onClearComplaints={onClearComplaints}
            onPrintComplaint={onPrintComplaint}
          />
        ) : (
          <>
        {adminPage === "dashboard" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
          {[
            ["Total students", students.length],
            ["Logged in now", loggedInCount],
            ["Active students", students.filter(student => student.status === "Active").length],
            ["Admin profiles", visibleAdminUsers.length],
            ["Faculty members", normalizedFacultyMembers.length],
            ["Assignments", normalizedAssignments.length],
            ["Published results", normalizedPublishedResults.length],
            ["Announcements", visibleAnnouncements.length],
            ["Complaints", visibleComplaints.length],
            ["Watchlist", students.filter(student => student.status === "Watchlist").length],
          ].map(([label, value]) => (
            <div key={label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", fontFamily: "monospace" }}>{value}</div>
            </div>
          ))}
        </div>
        )}

        {adminPage === "assignments" && (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#111827", margin: 0 }}>Assignment management</h3>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>Publish teacher assignments with PDF files for all students.</div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {normalizedAssignments.length > 0 && (
                <button onClick={handleClearAssignments} style={{ ...btnStyle, padding: "9px 12px", background: "#fee2e2", color: "#991b1b", borderColor: "#fecaca" }}>
                  <Icon name="x" size={14} /> Delete all
                </button>
              )}
              <button onClick={handleAddAssignment} style={{ ...btnStyle, padding: "9px 12px", background: "#eff6ff", color: "#185FA5", borderColor: "#bfdbfe" }}>
                <Icon name="assignments" size={14} /> Add Assignment
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: assignmentEditorActive ? "minmax(260px, 0.8fr) minmax(360px, 1.2fr)" : "1fr", gap: 18, alignItems: "start" }}>
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden" }}>
              {normalizedAssignments.length ? normalizedAssignments.map(assignment => (
                <button
                  key={assignment.id}
                  onClick={() => {
                    setSelectedAssignmentId(assignment.id);
                    setAssignmentDraft(getAssignmentDraftFromRecord(assignment));
                    setCreatingAssignment(false);
                    setAssignmentEditorOpen(true);
                  }}
                  style={{
                    width: "100%",
                    border: "none",
                    borderBottom: "1px solid #f3f4f6",
                    background: assignmentEditorOpen && selectedAssignment?.id === assignment.id ? "#eff6ff" : "#fff",
                    padding: 13,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 900, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{assignment.title || "Untitled assignment"}</div>
                    <div style={{ fontSize: 10, color: "#185FA5", marginTop: 3, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{assignment.subject || "Subject"} · {assignment.teacher || "Teacher"}</div>
                    <div style={{ fontSize: 10, color: "#6b7280", marginTop: 3 }}>Due {assignment.submissionDate || "Not set"} · {assignment.pdfName ? "PDF attached" : "No PDF"}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: "#111827", fontFamily: "monospace" }}>{assignment.totalMarks || 0}</div>
                    <div style={{ fontSize: 9, color: "#6b7280" }}>marks</div>
                  </div>
                </button>
              )) : (
                <div style={{ border: "1px dashed #d1d5db", margin: 14, borderRadius: 12, padding: 20, textAlign: "center", color: "#6b7280", fontSize: 12, fontWeight: 700 }}>
                  No assignments published yet.
                </div>
              )}
            </div>

            {assignmentEditorActive ? (
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 900, color: "#111827", margin: 0 }}>{creatingAssignment ? "Publish assignment" : "Edit assignment"}</h3>
                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>Given date is automatically set to today for new assignments.</div>
                  </div>
                  <button type="button" onClick={closeAssignmentEditor} aria-label="Close assignment form" style={{ width: 34, height: 34, border: "1px solid #e5e7eb", background: "#f9fafb", color: "#6b7280", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}>
                    <Icon name="x" size={14} />
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Assignment title</span>
                    <input value={assignmentDraft.title || ""} placeholder="Assignment title" onChange={event => updateAssignmentDraft("title", event.target.value)} style={fieldStyle} />
                  </label>

                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Teacher name</span>
                    <select
                      value={assignmentDraft.facultyId || ""}
                      disabled={!assignmentFacultyOptions.length}
                      onChange={event => handleAssignmentFacultyChange(event.target.value)}
                      style={{ ...fieldStyle, background: assignmentFacultyOptions.length ? "#fff" : "#f9fafb", color: assignmentFacultyOptions.length ? "#111827" : "#9ca3af" }}
                    >
                      <option value="">{assignmentFacultyOptions.length ? "Select faculty" : "Add faculty first"}</option>
                      {assignmentFacultyOptions.map(faculty => (
                        <option key={faculty.id} value={faculty.id}>{faculty.name} - {faculty.subject}</option>
                      ))}
                    </select>
                    <span style={{ fontSize: 11, color: assignmentFacultyOptions.length ? "#6b7280" : "#991b1b", fontWeight: 700 }}>
                      {assignmentFacultyOptions.length ? "Teacher list comes from Faculty management." : "No faculty available. Add faculty in Faculty Management first."}
                    </span>
                  </label>

                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Subject</span>
                    <input readOnly value={assignmentDraft.subject || ""} placeholder="Auto-filled from selected faculty" style={{ ...fieldStyle, background: "#f9fafb", color: assignmentDraft.subject ? "#111827" : "#9ca3af" }} />
                  </label>

                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Given date</span>
                    <input readOnly value={formatDateLabel(assignmentDraft.givenDateInput || assignmentDraft.givenDate || getDateInputValue())} style={{ ...fieldStyle, background: "#f9fafb", color: "#6b7280" }} />
                  </label>

                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Submission date</span>
                    <input type="date" value={assignmentDraft.submissionDateInput || ""} onChange={event => updateAssignmentDraft("submissionDateInput", event.target.value)} style={fieldStyle} />
                  </label>

                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Total marks</span>
                    <input type="number" min="1" value={assignmentDraft.totalMarks || ""} placeholder="30" onChange={event => updateAssignmentDraft("totalMarks", event.target.value)} style={fieldStyle} />
                  </label>

                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Status</span>
                    <select value={assignmentDraft.status || "pending"} onChange={event => updateAssignmentDraft("status", event.target.value)} style={fieldStyle}>
                      <option value="pending">Pending</option>
                      <option value="submitted">Submitted</option>
                      <option value="late">Late</option>
                    </select>
                  </label>

                  <label style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Assignment PDF</span>
                    <input type="file" accept="application/pdf,.pdf" onChange={handleAssignmentPdfChange} style={fieldStyle} />
                    <span style={{ fontSize: 11, color: assignmentDraft.pdfName ? "#166534" : "#6b7280", fontWeight: 700 }}>{assignmentDraft.pdfName || "Upload a PDF file for students to download."}</span>
                  </label>

                  <label style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Assignment instructions</span>
                    <textarea value={assignmentDraft.desc || ""} placeholder="Write assignment details or teacher instructions..." rows={4} onChange={event => updateAssignmentDraft("desc", event.target.value)} style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.45 }} />
                  </label>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginTop: 16, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: canSaveAssignment ? "#6b7280" : "#991b1b" }}>
                    {canSaveAssignment ? "Ready to publish assignment." : "Title, saved faculty, submission date, and marks are required."}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    {!creatingAssignment && (
                      <button onClick={handleDeleteAssignment} style={{ ...btnStyle, padding: "10px 14px", background: "#fee2e2", color: "#991b1b", borderColor: "#fecaca" }}>
                        <Icon name="x" size={14} /> Delete
                      </button>
                    )}
                    <button
                      onClick={handleSaveAssignment}
                      disabled={!canSaveAssignment}
                      style={{ ...btnStyle, padding: "10px 14px", background: canSaveAssignment ? "#185FA5" : "#e5e7eb", color: canSaveAssignment ? "#fff" : "#6b7280", borderColor: canSaveAssignment ? "#185FA5" : "#e5e7eb", cursor: canSaveAssignment ? "pointer" : "not-allowed" }}
                    >
                      <Icon name="check" size={14} /> Save assignment
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        )}

        {adminPage === "results" && (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.15fr) minmax(320px, 0.85fr)", gap: 18, alignItems: "start" }}>
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 900, color: "#111827", margin: 0 }}>Result publishing</h3>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>Add each subject manually. Teacher and subject come from Faculty Management.</div>
              </div>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: "#eff6ff", color: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="results" size={18} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, marginBottom: 16 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#374151" }}>Student ID</span>
                <select value={selectedResultStudentId} onChange={event => handleResultStudentChange(event.target.value)} style={fieldStyle}>
                  <option value="">Select student ID</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>{student.studentId || student.id} - {student.name || "Unnamed"}</option>
                  ))}
                </select>
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#374151" }}>Exam name</span>
                <select value={resultDraft.semester || ""} disabled={!selectedResultStudent} onChange={event => handleResultSemesterChange(event.target.value)} style={{ ...fieldStyle, background: selectedResultStudent ? "#fff" : "#f9fafb" }}>
                  <option value="">Select semester</option>
                  {[1, 2, 3, 4, 5, 6].map(semester => (
                    <option key={semester} value={semester}>Semester {semester}</option>
                  ))}
                </select>
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#374151" }}>Sessional</span>
                <select value={resultDraft.sessional || "Sessional 1"} disabled={!selectedResultStudent} onChange={event => { setResultSaved(false); setResultDraft(current => ({ ...current, sessional: event.target.value })); }} style={{ ...fieldStyle, background: selectedResultStudent ? "#fff" : "#f9fafb" }}>
                  <option>Sessional 1</option>
                  <option>Sessional 2</option>
                </select>
              </label>
            </div>

            {selectedResultStudent ? (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 16 }}>
                  {[
                    ["Name", selectedResultStudent.name],
                    ["ID No.", selectedResultStudent.studentId],
                    ["Reg. No.", selectedResultStudent.regNo],
                    ["Roll No.", selectedResultStudent.rollNo],
                    ["Course", selectedResultStudent.course],
                    ["Session", selectedResultStudent.session],
                  ].map(([label, value]) => (
                    <div key={label} style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: 11, padding: "10px 12px" }}>
                      <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: 12, fontWeight: 900, color: "#111827", overflowWrap: "anywhere" }}>{value || "Not set"}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-end", marginBottom: 12, flexWrap: "wrap" }}>
                  <label style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 260, flex: "1 1 320px" }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#374151" }}>Add subject from Faculty Management</span>
                    <select
                      value={selectedResultFacultyId}
                      disabled={!resultFacultyOptions.length}
                      onChange={event => setSelectedResultFacultyId(event.target.value)}
                      style={{ ...fieldStyle, background: resultFacultyOptions.length ? "#fff" : "#f9fafb", color: resultFacultyOptions.length ? "#111827" : "#9ca3af" }}
                    >
                      <option value="">{resultFacultyOptions.length ? "Select subject and teacher" : "Add faculty first"}</option>
                      {resultFacultyOptions.map(faculty => (
                        <option key={faculty.id} value={faculty.id}>{faculty.subject} - {faculty.name}</option>
                      ))}
                    </select>
                    <span style={{ fontSize: 11, color: resultFacultyOptions.length ? "#6b7280" : "#991b1b", fontWeight: 700 }}>
                      {resultFacultyOptions.length ? "Every added subject uses max marks 40." : "No faculty available. Add faculty in Faculty Management first."}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddResultSubject}
                    disabled={!selectedResultFaculty}
                    style={{ ...btnStyle, padding: "10px 13px", background: selectedResultFaculty ? "#eff6ff" : "#e5e7eb", color: selectedResultFaculty ? "#185FA5" : "#6b7280", borderColor: selectedResultFaculty ? "#bfdbfe" : "#e5e7eb", cursor: selectedResultFaculty ? "pointer" : "not-allowed" }}
                  >
                    <Icon name="assignments" size={14} /> Add subject
                  </button>
                </div>

                <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: "#f9fafb" }}>
                        {["Subject", "Faculty", "Marks obtained", "Max marks", ""].map(head => (
                          <th key={head} style={{ padding: "10px 12px", textAlign: "left", color: "#6b7280", borderBottom: "1px solid #e5e7eb", fontWeight: 900 }}>{head}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(resultDraft.subjects || []).length ? (
                        (resultDraft.subjects || []).map((subject, index) => (
                          <tr key={subject.id}>
                            <td style={{ padding: "10px 12px", borderBottom: "1px solid #f3f4f6", fontWeight: 900, color: "#111827" }}>{subject.subject}</td>
                            <td style={{ padding: "10px 12px", borderBottom: "1px solid #f3f4f6", color: "#4b5563" }}>{subject.teacher}</td>
                            <td style={{ padding: "10px 12px", borderBottom: "1px solid #f3f4f6" }}>
                              <input
                                type="number"
                                min="0"
                                max={subject.maxMarks || 40}
                                value={subject.obtainedMarks}
                                onChange={event => updateResultSubjectMarks(index, event.target.value)}
                                placeholder="0"
                                style={{ ...fieldStyle, padding: "8px 10px", maxWidth: 120 }}
                              />
                            </td>
                            <td style={{ padding: "10px 12px", borderBottom: "1px solid #f3f4f6", fontFamily: "monospace", fontWeight: 900 }}>{subject.maxMarks || 40}</td>
                            <td style={{ padding: "10px 12px", borderBottom: "1px solid #f3f4f6", textAlign: "right" }}>
                              <button
                                type="button"
                                onClick={() => handleDeleteResultSubject(index)}
                                aria-label={`Delete ${subject.subject}`}
                                style={{ width: 32, height: 32, border: "1px solid #fecaca", background: "#fee2e2", color: "#991b1b", borderRadius: 9, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}
                              >
                                <Icon name="x" size={13} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ padding: "18px 12px", textAlign: "center", color: "#6b7280", fontWeight: 800, borderBottom: "1px solid #f3f4f6" }}>
                            No subjects added yet. Select a subject and teacher, then click Add subject.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginTop: 16, flexWrap: "wrap" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(110px, 1fr))", gap: 8 }}>
                    {[
                      ["Total", `${resultTotals.totalObtained}/${resultTotals.totalMarks}`],
                      ["Percentage", `${resultTotals.percentage}%`],
                      ["Grade", resultTotals.grade],
                    ].map(([label, value]) => (
                      <div key={label} style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: 10, padding: "9px 11px" }}>
                        <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 3 }}>{label}</div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: "#111827", fontFamily: "monospace" }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    {selectedResult && (
                      <button onClick={handleDeleteResult} style={{ ...btnStyle, padding: "10px 13px", background: "#fee2e2", color: "#991b1b", borderColor: "#fecaca" }}>
                        <Icon name="x" size={14} /> Delete result
                      </button>
                    )}
                    <button
                      onClick={handleSaveResult}
                      disabled={!canSaveResult}
                      style={{ ...btnStyle, padding: "10px 14px", background: canSaveResult ? "#185FA5" : "#e5e7eb", color: canSaveResult ? "#fff" : "#6b7280", borderColor: canSaveResult ? "#185FA5" : "#e5e7eb", cursor: canSaveResult ? "pointer" : "not-allowed" }}
                    >
                      <Icon name="check" size={14} /> Publish result
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: 12, fontSize: 11, color: resultSaved ? "#166534" : canSaveResult ? "#6b7280" : "#991b1b", fontWeight: 800 }}>
                  {resultSaved ? "Result published successfully. Student can view it in Results." : canSaveResult ? "Review marks and publish the marksheet." : "Select student, semester, sessional, and enter all subject marks within max marks."}
                </div>
              </>
            ) : (
              <div style={{ border: "1px dashed #d1d5db", borderRadius: 14, padding: 24, textAlign: "center", color: "#6b7280", fontSize: 13, fontWeight: 700 }}>
                Select a registered student ID to start result publishing.
              </div>
            )}
          </div>

          <aside style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: 16, borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 900, color: "#111827", margin: 0 }}>Published marksheets</h3>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>Click any result to edit.</div>
              </div>
              <span style={{ fontSize: 11, color: "#185FA5", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 999, padding: "3px 8px", fontWeight: 900 }}>{normalizedPublishedResults.length}</span>
            </div>

            <div style={{ maxHeight: 620, overflowY: "auto" }}>
              {normalizedPublishedResults.length ? normalizedPublishedResults.map(result => (
                <button
                  key={result.id}
                  onClick={() => handleSelectPublishedResult(result)}
                  style={{ width: "100%", border: "none", borderBottom: "1px solid #f3f4f6", background: selectedResult?.id === result.id ? "#eff6ff" : "#fff", padding: 14, textAlign: "left", cursor: "pointer" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 900, color: "#111827" }}>{result.studentName || "Student"}</div>
                    <div style={{ fontSize: 11, fontWeight: 900, color: "#185FA5", fontFamily: "monospace" }}>{result.totalObtained}/{result.totalMarks}</div>
                  </div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{result.studentId || "No ID"} · {result.examName} · {result.sessional}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 5 }}>{result.publishedDate || "Not published"} · Grade {result.grade}</div>
                </button>
              )) : (
                <div style={{ padding: 24, textAlign: "center", color: "#6b7280", fontSize: 12, fontWeight: 700 }}>
                  No result marksheet published yet.
                </div>
              )}
            </div>
          </aside>
        </div>
        )}

        {adminPage === "announcements" && (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 0.95fr) minmax(320px, 1.05fr)", gap: 18, alignItems: "start" }}>
          <form onSubmit={handleSendAnnouncement} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center", marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#111827", margin: 0 }}>Push notification</h3>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>Send announcements to the student bell and announcements page.</div>
              </div>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "#dbeafe", color: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="megaphone" size={16} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Title</span>
                <input value={announcementDraft.title} onChange={event => updateAnnouncementDraft("title", event.target.value)} placeholder="Class schedule update" style={fieldStyle} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Category</span>
                <select value={announcementDraft.category} onChange={event => updateAnnouncementDraft("category", event.target.value)} style={fieldStyle}>
                  <option>General</option>
                  <option>Academic</option>
                  <option>Exam</option>
                  <option>Fees</option>
                  <option>Placement</option>
                  <option>Event</option>
                </select>
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Message</span>
                <textarea
                  value={announcementDraft.message}
                  onChange={event => updateAnnouncementDraft("message", event.target.value)}
                  placeholder="Write the message students should read..."
                  rows={4}
                  style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.45 }}
                />
              </label>
            </div>

            {announcementSent && (
              <div style={{ marginTop: 12, background: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0", borderRadius: 10, padding: "9px 11px", fontSize: 12, fontWeight: 800 }}>
                Announcement sent to student notifications.
              </div>
            )}

            <button
              type="submit"
              disabled={!announcementDraft.title.trim() || !announcementDraft.message.trim()}
              style={{
                ...btnStyle,
                justifyContent: "center",
                width: "100%",
                marginTop: 14,
                padding: "11px 14px",
                background: announcementDraft.title.trim() && announcementDraft.message.trim() ? "#185FA5" : "#e5e7eb",
                color: announcementDraft.title.trim() && announcementDraft.message.trim() ? "#fff" : "#6b7280",
                borderColor: announcementDraft.title.trim() && announcementDraft.message.trim() ? "#185FA5" : "#e5e7eb",
                cursor: announcementDraft.title.trim() && announcementDraft.message.trim() ? "pointer" : "not-allowed",
              }}
            >
              <Icon name="send" size={14} /> Send announcement
            </button>
          </form>

          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#111827", margin: "0 0 14px" }}>Recent notifications</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 310, overflowY: "auto" }}>
              {visibleAnnouncements.length ? visibleAnnouncements.slice(0, 5).map(item => (
                <div key={item.id} style={{ border: "1px solid #f3f4f6", background: item.unread ? "#f8fbff" : "#fff", borderRadius: 12, padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 5 }}>
                    <div style={{ fontSize: 12, fontWeight: 900, color: "#111827" }}>{item.title}</div>
                    {item.unread && <span style={{ fontSize: 10, fontWeight: 800, color: "#1e40af", background: "#dbeafe", padding: "2px 7px", borderRadius: 999 }}>Unread</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.4 }}>{item.message}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 6 }}>{item.category} · {item.date}</div>
                </div>
              )) : (
                <div style={{ border: "1px dashed #d1d5db", borderRadius: 12, padding: 18, textAlign: "center", color: "#6b7280", fontSize: 12, fontWeight: 700 }}>
                  No notifications have been sent yet.
                </div>
              )}
            </div>
          </div>
        </div>
        )}

        {adminPage === "admins" && (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#111827", margin: 0 }}>Admin profiles</h3>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>Create extra admin accounts with their own email and password.</div>
            </div>
            <button onClick={handleAddAdmin} style={{ ...btnStyle, padding: "9px 12px", background: "#eff6ff", color: "#185FA5", borderColor: "#bfdbfe" }}>
              <Icon name="profile" size={14} /> Add Admin
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: adminEditorOpen && selectedAdmin ? "minmax(260px, 0.85fr) minmax(320px, 1.15fr)" : "1fr", gap: 18, alignItems: "start" }}>
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden" }}>
              {visibleAdminUsers.map(admin => (
                <button
                  key={admin.id}
                  onClick={() => {
                    setSelectedAdminId(admin.id);
                    setAdminDetailsSaved(false);
                    setAdminEditorOpen(true);
                  }}
                  style={{
                    width: "100%",
                    border: "none",
                    borderBottom: "1px solid #f3f4f6",
                    background: adminEditorOpen && selectedAdmin?.id === admin.id ? "#eff6ff" : "#fff",
                    padding: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 900, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{admin.name}</div>
                    <div style={{ fontSize: 10, color: "#6b7280", marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{admin.email}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 800, color: admin.status === "Active" ? "#166534" : "#991b1b", background: admin.status === "Active" ? "#dcfce7" : "#fee2e2", borderRadius: 999, padding: "3px 8px", alignSelf: "center", flexShrink: 0 }}>{admin.status}</span>
                </button>
              ))}
            </div>

            {adminEditorOpen && selectedAdmin && (
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: "#111827", margin: 0 }}>Manage admin</h3>
                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>Edit admin login and access status.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminEditorOpen(false);
                      setSelectedAdminId("");
                    }}
                    aria-label="Close admin form"
                    style={{ width: 34, height: 34, border: "1px solid #e5e7eb", background: "#f9fafb", color: "#6b7280", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}
                  >
                    <Icon name="x" size={14} />
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                  {[
                    ["Admin name", "name", "text"],
                    ["Admin email", "email", "email"],
                    ["Password", "password", "text"],
                  ].map(([label, key, type]) => (
                    <label key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{label}</span>
                      <input
                        type={type}
                        value={selectedAdmin[key] || ""}
                        disabled={selectedAdmin.protected && key === "email"}
                        onChange={event => updateSelectedAdmin(key, event.target.value)}
                        style={{ ...fieldStyle, background: selectedAdmin.protected && key === "email" ? "#f9fafb" : "#fff", color: selectedAdmin.protected && key === "email" ? "#6b7280" : "#111827" }}
                      />
                    </label>
                  ))}
                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Status</span>
                    <select value={selectedAdmin.status} disabled={selectedAdmin.protected} onChange={event => updateSelectedAdmin("status", event.target.value)} style={{ ...fieldStyle, background: selectedAdmin.protected ? "#f9fafb" : "#fff" }}>
                      <option>Active</option>
                      <option>Blocked</option>
                    </select>
                  </label>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginTop: 14, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 700 }}>
                    {adminDetailsSaved ? "Admin details saved." : selectedAdmin.protected ? "Main admin is protected." : "Fill admin details, then save."}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={handleSaveAdminDetails} style={{ ...btnStyle, padding: "9px 12px", background: "#185FA5", color: "#fff", borderColor: "#185FA5" }}>
                      <Icon name="check" size={14} /> Save admin
                    </button>
                    <button
                      onClick={handleDeleteAdmin}
                      disabled={selectedAdmin.protected || selectedAdmin.email === currentAdmin?.email}
                      style={{
                        ...btnStyle,
                        padding: "9px 12px",
                        background: selectedAdmin.protected || selectedAdmin.email === currentAdmin?.email ? "#f3f4f6" : "#fee2e2",
                        color: selectedAdmin.protected || selectedAdmin.email === currentAdmin?.email ? "#9ca3af" : "#991b1b",
                        borderColor: selectedAdmin.protected || selectedAdmin.email === currentAdmin?.email ? "#e5e7eb" : "#fecaca",
                        cursor: selectedAdmin.protected || selectedAdmin.email === currentAdmin?.email ? "not-allowed" : "pointer",
                      }}
                    >
                      <Icon name="x" size={14} /> Delete admin
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        )}

        {adminPage === "students" && (
        <div style={{ display: "grid", gridTemplateColumns: studentEditorOpen && selected ? "minmax(0, 1.35fr) minmax(380px, 0.8fr)" : "1fr", gap: 18, alignItems: "start" }}>
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20, overflowX: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#111827", margin: 0 }}>Students</h3>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>Only registered active students can login.</div>
              </div>
              <button onClick={handleAddStudent} style={{ ...btnStyle, padding: "9px 12px", background: "#eff6ff", color: "#185FA5", borderColor: "#bfdbfe" }}>
                <Icon name="profile" size={14} /> Add Student
              </button>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  {["Student", "ID No.", "Roll", "Reg. No.", "Email", "Course", "Attendance", "CGPA", "Portal"].map(head => (
                    <th key={head} style={{ textAlign: "left", padding: "10px 12px", color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.length ? students.map(student => (
                  <tr
                    key={student.id}
                    onClick={() => {
                      setSelectedId(student.id);
                      setStudentEditorOpen(true);
                      setStudentDetailsSaved(false);
                      setAttendanceSaved(false);
                    }}
                    style={{ cursor: "pointer", background: studentEditorOpen && selected?.id === student.id ? "#eff6ff" : "#fff" }}
                  >
                    <td style={{ padding: "11px 12px", borderBottom: "1px solid #f3f4f6", fontWeight: 700 }}>{student.name}</td>
                    <td style={{ padding: "11px 12px", borderBottom: "1px solid #f3f4f6", fontFamily: "monospace" }}>{student.studentId || "Not set"}</td>
                    <td style={{ padding: "11px 12px", borderBottom: "1px solid #f3f4f6", fontFamily: "monospace" }}>{student.rollNo || "Not set"}</td>
                    <td style={{ padding: "11px 12px", borderBottom: "1px solid #f3f4f6", fontFamily: "monospace" }}>{student.regNo || "Not set"}</td>
                    <td style={{ padding: "11px 12px", borderBottom: "1px solid #f3f4f6", color: "#4b5563" }}>{student.email}</td>
                    <td style={{ padding: "11px 12px", borderBottom: "1px solid #f3f4f6" }}>{student.course}</td>
                    <td style={{ padding: "11px 12px", borderBottom: "1px solid #f3f4f6", fontFamily: "monospace" }}>{student.attendance}%</td>
                    <td style={{ padding: "11px 12px", borderBottom: "1px solid #f3f4f6", fontFamily: "monospace" }}>{student.cgpa}</td>
                    <td style={{ padding: "11px 12px", borderBottom: "1px solid #f3f4f6", color: loggedInStudents.includes(student.email) ? "#166534" : "#6b7280", fontWeight: 700 }}>
                      {loggedInStudents.includes(student.email) ? "Logged in" : "Offline"}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={9} style={{ padding: 18, color: "#6b7280", textAlign: "center", borderBottom: "1px solid #f3f4f6" }}>No student accounts created yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {studentEditorOpen && selected && (
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "#111827", margin: 0 }}>Manage student</h3>
                  <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>Student details and attendance save automatically.</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: selectedAttendanceSummary.pct < 75 ? "#dc2626" : "#111827", fontFamily: "monospace" }}>{selectedAttendanceSummary.pct}%</div>
                    <div style={{ fontSize: 10, color: "#6b7280" }}>{selectedAttendanceSummary.totalPresent}/{selectedAttendanceSummary.totalClasses} classes</div>
                  </div>
                  <button onClick={handleDeleteStudent} style={{ ...btnStyle, padding: "8px 10px", background: "#fee2e2", color: "#991b1b", borderColor: "#fecaca" }}>
                    <Icon name="x" size={14} /> Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStudentEditorOpen(false);
                      setSelectedId("");
                    }}
                    aria-label="Close student form"
                    style={{ width: 34, height: 34, border: "1px solid #e5e7eb", background: "#f9fafb", color: "#6b7280", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}
                  >
                    <Icon name="x" size={14} />
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                {[
                  ["Name", "name", "text", "Enter student full name"],
                  ["ID No.", "studentId", "text", "Enter ID no."],
                  ["University Registration No.", "regNo", "text", "Enter registration no."],
                  ["Roll No.", "rollNo", "text", "Enter roll no."],
                  ["Email", "email", "email", "student@email.com"],
                  ["Login password", "password", "text", "Set login password"],
                  ["Phone", "phone", "text", "+91 XXXXX XXXXX"],
                  ["Course", "course", "text", "BCA"],
                  ["Department", "department", "text", "Department name"],
                  ["Semester", "semester", "number", "4"],
                  ["Total semesters", "totalSemesters", "number", "6"],
                  ["CGPA", "cgpa", "number", "8.4"],
                  ["Age", "age", "number", "20"],
                  ["Father name", "fatherName", "text", "Enter father name"],
                  ["Blood group", "bloodGroup", "text", "B+"],
                  ["Session", "session", "text", "2024 - 2027"],
                  ["College name", "university", "text", "College name"],
                ].map(([label, key, type, placeholder]) => (
                  <label key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{label}</span>
                    <input
                      type={type}
                      min={type === "number" ? "0" : undefined}
                      max={key === "cgpa" ? "10" : undefined}
                      step={key === "cgpa" ? "0.1" : undefined}
                      value={selected[key] ?? ""}
                      placeholder={placeholder}
                      onChange={event => updateSelected(key, type === "number" ? event.target.value === "" ? "" : Number(event.target.value) : event.target.value)}
                      style={fieldStyle}
                    />
                  </label>
                ))}
                <label style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Status</span>
                  <select value={selected.status} onChange={event => updateSelected("status", event.target.value)} style={fieldStyle}>
                    <option>Active</option>
                    <option>Watchlist</option>
                    <option>Blocked</option>
                  </select>
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginTop: 14, flexWrap: "wrap" }}>
                <div style={{ fontSize: 11, color: studentDetailsSaved ? "#166534" : "#6b7280", fontWeight: 800 }}>
                  {studentDetailsSaved ? "Student details saved." : "Fill student fields, then save details."}
                </div>
                <button onClick={handleSaveStudentDetails} style={{ ...btnStyle, padding: "9px 12px", background: "#185FA5", color: "#fff", borderColor: "#185FA5" }}>
                  <Icon name="check" size={14} /> Save details
                </button>
              </div>

              <div style={{ marginTop: 18, borderTop: "1px solid #f3f4f6", paddingTop: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 900, color: "#111827", margin: 0 }}>Manual attendance</h4>
                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>Edit present classes and total classes held for each subject.</div>
                  </div>
                  <button onClick={handleAddAttendanceSubject} style={{ ...btnStyle, padding: "8px 10px", background: "#eff6ff", color: "#185FA5", borderColor: "#bfdbfe" }}>
                    <Icon name="attendance" size={14} /> Add subject
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {selectedAttendanceSummary.records.length ? selectedAttendanceSummary.records.map((record, index) => (
                    <div key={record.id} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: record.warn ? "#fff7f7" : "#fff" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.6fr 0.6fr 0.45fr 36px", gap: 8, alignItems: "end" }}>
                        <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                          <span style={{ fontSize: 10, fontWeight: 800, color: "#6b7280" }}>Subject</span>
                          <input value={record.subject} placeholder="Subject name" onChange={event => updateSelectedAttendance(index, "subject", event.target.value)} style={{ ...fieldStyle, padding: "9px 10px" }} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                          <span style={{ fontSize: 10, fontWeight: 800, color: "#6b7280" }}>Present</span>
                          <input type="number" min="0" max={record.held > 0 ? record.held : 0} value={record.present ?? 0} placeholder="0" disabled={!record.held || record.held === 0} onChange={event => updateSelectedAttendance(index, "present", event.target.value)} style={{ ...fieldStyle, padding: "9px 10px", background: !record.held || record.held === 0 ? "#f9fafb" : "#fff" }} />
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                          <span style={{ fontSize: 10, fontWeight: 800, color: "#6b7280" }}>Held</span>
                          <input type="number" min="0" value={record.held ?? 0} placeholder="0" onChange={event => updateSelectedAttendance(index, "held", event.target.value)} style={{ ...fieldStyle, padding: "9px 10px" }} />
                        </label>
                        <div style={{ fontSize: 16, fontWeight: 900, color: record.warn ? "#dc2626" : "#111827", fontFamily: "monospace", textAlign: "right", paddingBottom: 9 }}>{record.pct}%</div>
                        <button
                          type="button"
                          onClick={() => handleDeleteAttendanceSubject(index)}
                          aria-label={`Delete ${record.subject || "subject"}`}
                          style={{ width: 34, height: 34, border: "1px solid #fecaca", background: "#fee2e2", color: "#991b1b", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0, marginBottom: 1 }}
                        >
                          <Icon name="x" size={14} />
                        </button>
                      </div>
                      <div style={{ height: 6, background: "#f3f4f6", borderRadius: 99, overflow: "hidden", marginTop: 10 }}>
                        <div style={{ width: `${record.pct}%`, height: "100%", background: record.color, borderRadius: 99 }} />
                      </div>
                      <div style={{ fontSize: 10, color: !record.subject ? "#991b1b" : !record.held || record.held === 0 ? "#f59e0b" : record.warn ? "#dc2626" : "#166534", fontWeight: 700, marginTop: 8 }}>
                        {!record.subject ? "Enter subject name" : !record.held || record.held === 0 ? "Enter classes held" : record.warn ? `Low attendance: ${record.pct}%` : `Good attendance: ${record.pct}%`}
                      </div>
                    </div>
                  )) : (
                    <div style={{ border: "1px dashed #d1d5db", borderRadius: 12, padding: 18, textAlign: "center", color: "#6b7280", fontSize: 12, fontWeight: 700 }}>
                      No attendance subjects added yet.
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginTop: 14, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 11, color: attendanceSaved ? "#166534" : "#6b7280", fontWeight: 800 }}>
                    {attendanceSaved ? "Attendance saved for this student." : "Review values, then save attendance."}
                  </div>
                  <button onClick={handleSaveAttendance} style={{ ...btnStyle, padding: "9px 12px", background: "#185FA5", color: "#fff", borderColor: "#185FA5" }}>
                    <Icon name="check" size={14} /> Save attendance
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        )}

        {adminPage === "faculty" && (
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#111827", margin: 0 }}>Faculty management</h3>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>Add and edit faculty shown in the student course section.</div>
            </div>
            <button onClick={handleAddFaculty} style={{ ...btnStyle, padding: "9px 12px", background: "#eff6ff", color: "#185FA5", borderColor: "#bfdbfe" }}>
              <Icon name="profile" size={14} /> Add Faculty
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: facultyEditorActive ? "minmax(240px, 0.85fr) minmax(320px, 1.35fr)" : "1fr", gap: 18, alignItems: "start" }}>
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden" }}>
              {normalizedFacultyMembers.map(faculty => (
                <button
                  key={faculty.id}
                  onClick={() => {
                    setSelectedFacultyId(faculty.id);
                    setFacultyDraft(faculty);
                    setCreatingFaculty(false);
                    setFacultyEditorOpen(true);
                  }}
                  style={{
                    width: "100%",
                    border: "none",
                    borderBottom: "1px solid #f3f4f6",
                    background: facultyEditorOpen && selectedFaculty?.id === faculty.id ? "#eff6ff" : "#fff",
                    padding: 12,
                    display: "flex",
                    gap: 11,
                    alignItems: "center",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ width: 42, height: 42, borderRadius: 11, border: "1px solid #e5e7eb", overflow: "hidden", background: "#f8fafc", flexShrink: 0 }}>
                    <img
                      src={faculty.photo || cimageLogo}
                      alt={faculty.name}
                      onError={event => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = cimageLogo;
                        event.currentTarget.style.objectFit = "contain";
                        event.currentTarget.style.padding = "6px";
                      }}
                      style={{ width: "100%", height: "100%", objectFit: faculty.photo ? "cover" : "contain", objectPosition: "center top", padding: faculty.photo ? 0 : 6, boxSizing: "border-box", display: "block" }}
                    />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 900, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{faculty.name || "Faculty name"}</div>
                    <div style={{ fontSize: 10, color: "#185FA5", fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{faculty.subject || "Subject"}</div>
                    <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>{faculty.phone || "No phone saved"}</div>
                  </div>
                </button>
              ))}
            </div>

            {facultyEditorActive ? (
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#111827" }}>{creatingFaculty ? "Add faculty" : "Edit faculty"}</div>
                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>Fill faculty details, then save it for the student course section.</div>
                  </div>
                  <button
                    type="button"
                    onClick={closeFacultyEditor}
                    style={{ ...btnStyle, width: 32, height: 32, padding: 0, justifyContent: "center", background: "#f9fafb" }}
                    aria-label="Close faculty form"
                  >
                    <Icon name="x" size={14} />
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 16 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden", background: "#f8fafc", flexShrink: 0 }}>
                    <img
                      src={facultyDraft.photo || cimageLogo}
                      alt={facultyDraft.name || "Faculty"}
                      onError={event => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = cimageLogo;
                        event.currentTarget.style.objectFit = "contain";
                        event.currentTarget.style.padding = "8px";
                      }}
                      style={{ width: "100%", height: "100%", objectFit: facultyDraft.photo ? "cover" : "contain", objectPosition: "center top", padding: facultyDraft.photo ? 0 : 8, boxSizing: "border-box", display: "block" }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#111827" }}>{facultyDraft.name || "Faculty name"}</div>
                    <div style={{ fontSize: 11, color: "#185FA5", fontWeight: 800 }}>{facultyDraft.subject || "Subject"}</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
                  {[
                    ["Name", "name", "Faculty name"],
                    ["Subject", "subject", "Subject"],
                    ["Education", "education", "MCA, PhD, etc."],
                    ["Joined", "joined", "2021"],
                    ["Phone", "phone", "+91 98765 43210"],
                    ["WhatsApp", "whatsapp", "+91 98765 43210"],
                  ].map(([label, key, placeholder]) => (
                    <label key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{label}</span>
                      <input value={facultyDraft[key] || ""} placeholder={placeholder} onChange={event => updateFacultyDraft(key, event.target.value)} style={fieldStyle} />
                    </label>
                  ))}
                  <label style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: "1 / -1" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Photo path or URL</span>
                    <input value={facultyDraft.photo || ""} placeholder="/imgs/faculty-name.jpg" onChange={event => updateFacultyDraft("photo", event.target.value)} style={fieldStyle} />
                  </label>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginTop: 16, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: canSaveFaculty ? "#6b7280" : "#991b1b" }}>
                    {canSaveFaculty ? "Ready to save faculty details." : "Name and subject are required before save."}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    {!creatingFaculty && (
                      <button
                        onClick={handleDeleteFaculty}
                        style={{ ...btnStyle, padding: "10px 14px", background: "#fee2e2", color: "#991b1b", borderColor: "#fecaca" }}
                      >
                        <Icon name="x" size={14} /> Delete faculty
                      </button>
                    )}
                    <button
                      onClick={handleSaveFaculty}
                      disabled={!canSaveFaculty}
                      style={{ ...btnStyle, padding: "10px 14px", background: canSaveFaculty ? "#185FA5" : "#e5e7eb", color: canSaveFaculty ? "#fff" : "#6b7280", borderColor: canSaveFaculty ? "#185FA5" : "#e5e7eb", cursor: canSaveFaculty ? "pointer" : "not-allowed" }}
                    >
                      <Icon name="check" size={14} /> Save faculty
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        )}
          </>
        )}
      </main>
      </div>
    </div>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [auth, setAuth] = usePersistentState("auth", null);
  const [students, setStudents] = usePersistentState("students", []);
  const [loggedInStudents, setLoggedInStudents] = usePersistentState("logged-in-students", []);
  const [testReports, setTestReports] = usePersistentState("test-reports", []);
  const [complaints, setComplaints] = usePersistentState("complaints", []);
  const [seenComplaintIds, setSeenComplaintIds] = usePersistentState("seen-complaint-ids", []);
  const [assignments, setAssignments] = usePersistentState("assignments", normalizeAssignments(ASSIGNMENTS));
  const [publishedResults, setPublishedResults] = usePersistentState("published-results", []);
  const [active, setActive] = usePersistentState("active-page", "dashboard");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [complaintOpen, setComplaintOpen] = useState(false);
  const [complaintMessage, setComplaintMessage] = useState("");
  const [now, setNow] = useState(new Date());
  const [profile, setProfile] = usePersistentState("profile", DEFAULT_PROFILE);
  const [adminUsers, setAdminUsers] = usePersistentState("admin-users", normalizeAdminUsers());
  const [facultyMembers, setFacultyMembers] = usePersistentState("faculty-members", normalizeFacultyMembers(TEACHERS));
  const [announcements, setAnnouncements] = usePersistentState("announcements", normalizeAnnouncements(ANNOUNCEMENTS));
  const visibleStudents = normalizeStudentRecords(students);
  const visibleAdminUsers = normalizeAdminUsers(adminUsers);
  const visibleFacultyMembers = normalizeFacultyMembers(facultyMembers);
  const visibleAssignments = normalizeAssignments(assignments);
  const visiblePublishedResults = normalizePublishedResults(publishedResults);
  const visibleAnnouncements = normalizeAnnouncements(announcements);
  const visibleComplaints = normalizeComplaints(complaints);
  const seenComplaintSet = new Set((Array.isArray(seenComplaintIds) ? seenComplaintIds : []).map(String));
  const unseenComplaintCount = visibleComplaints.filter(complaint => !seenComplaintSet.has(complaint.id)).length;
  const loggedInStudent = auth?.role === "student"
    ? visibleStudents.find(student => student.email === auth.email)
    : null;
  const currentAdmin = auth?.role === "admin"
    ? visibleAdminUsers.find(admin => admin.email === auth.email)
    : null;
  const currentStudent = auth?.role === "student"
    ? loggedInStudent || normalizeStudentRecord(STUDENT)
    : normalizeStudentRecord(STUDENT);
  const unreadAnnouncements = visibleAnnouncements.filter(item => item.unread).length;
  const currentDateLabel = now.toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short" });
  const currentTimeLabel = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!complaintMessage) return undefined;
    const timer = setTimeout(() => setComplaintMessage(""), 4500);
    return () => clearTimeout(timer);
  }, [complaintMessage]);

  useEffect(() => {
    if (auth?.role === "student" && (!loggedInStudent || loggedInStudent.status !== "Active")) {
      setAuth(null);
      setActive("dashboard");
    }

    if (auth?.role === "admin" && (!currentAdmin || currentAdmin.status !== "Active")) {
      setAuth(null);
      setActive("dashboard");
    }
  }, [auth?.role, auth?.email, loggedInStudent?.id, loggedInStudent?.status, currentAdmin?.id, currentAdmin?.status, setActive, setAuth]);

  const handleLogin = (login) => {
    setAuth(login);
    if (login.role === "student") {
      const matchingStudent = visibleStudents.find(student => student.email === login.email);
      setLoggedInStudents(current => current.includes(login.email) ? current : [...current, login.email]);
      setProfile(current => ({ ...current, email: login.email, name: matchingStudent?.name || getNameFromEmail(login.email), phone: matchingStudent?.phone || current.phone }));
    }
  };

  const handleLogout = () => {
    setProfileOpen(false);
    setNotificationOpen(false);
    setAiOpen(false);
    setAuth(null);
    setActive("dashboard");
  };

  const handleUpdateStudent = (id, updates) => {
    setStudents(current =>
      normalizeStudentRecords(current).map((student, index) =>
        student.id === id ? normalizeStudentRecord({ ...student, ...updates }, index) : student
      )
    );
  };

  const handleAddStudent = () => {
    const nextStudent = createStudentRecord(visibleStudents.length);
    setStudents(current => [nextStudent, ...normalizeStudentRecords(current)]);
    return nextStudent.id;
  };

  const handleDeleteStudent = (id) => {
    const removedStudent = visibleStudents.find(student => student.id === id);
    setStudents(current => normalizeStudentRecords(current).filter(student => student.id !== id));
    if (removedStudent) {
      setLoggedInStudents(current => current.filter(email => email !== removedStudent.email));
      if (auth?.role === "student" && auth.email === removedStudent.email) {
        handleLogout();
      }
    }
  };

  const handleAddAdmin = () => {
    const id = `admin-${Date.now()}`;
    const nextAdmin = {
      id,
      name: "New Admin",
      email: `admin${Date.now().toString().slice(-5)}@cimage.in`,
      password: "admin123",
      status: "Active",
      protected: false,
    };
    setAdminUsers(current => [nextAdmin, ...normalizeAdminUsers(current)]);
    return id;
  };

  const handleUpdateAdmin = (id, updates) => {
    setAdminUsers(current =>
      normalizeAdminUsers(current).map(admin =>
        admin.id === id
          ? {
              ...admin,
              ...updates,
              email: String(updates.email ?? admin.email).trim().toLowerCase(),
              password: updates.password ?? admin.password,
              status: updates.status || admin.status,
              protected: admin.protected,
            }
          : admin
      )
    );
  };

  const handleDeleteAdmin = (id) => {
    setAdminUsers(current => normalizeAdminUsers(current).filter(admin => admin.id !== id || admin.protected));
  };

  const handleSaveFacultyMember = (id, updates) => {
    setFacultyMembers(current =>
      normalizeFacultyMembers(current).map(faculty => faculty.id === id ? { ...faculty, ...updates, id } : faculty)
    );
  };

  const handleAddFacultyMember = (faculty) => {
    const name = String(faculty.name || "").trim();
    const subject = String(faculty.subject || "").trim();
    const id = `${createFacultyId({ name: name || "faculty", subject: subject || "subject" })}-${Date.now()}`;
    const nextFaculty = {
      id,
      name,
      subject,
      education: faculty.education || "",
      joined: faculty.joined || "",
      photo: faculty.photo || "",
      phone: faculty.phone || "",
      whatsapp: faculty.whatsapp || "",
    };
    setFacultyMembers(current => [nextFaculty, ...normalizeFacultyMembers(current)]);
    return id;
  };

  const handleDeleteFacultyMember = (id) => {
    setFacultyMembers(current => normalizeFacultyMembers(current).filter(faculty => faculty.id !== id));
  };

  const handleAddAssignment = (assignment) => {
    const id = `assignment-${Date.now()}`;
    const nextAssignment = normalizeAssignments([{ ...assignment, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }])[0];
    setAssignments(current => [nextAssignment, ...normalizeAssignments(current)]);
    return id;
  };

  const handleUpdateAssignment = (id, updates) => {
    setAssignments(current =>
      normalizeAssignments(current).map(assignment =>
        assignment.id === id
          ? normalizeAssignments([{ ...assignment, ...updates, id, updatedAt: new Date().toISOString() }])[0]
          : assignment
      )
    );
  };

  const handleDeleteAssignment = (id) => {
    setAssignments(current => normalizeAssignments(current).filter(assignment => assignment.id !== id));
  };

  const handleClearAssignments = () => {
    setAssignments([]);
  };

  const handleSaveResult = (result) => {
    const id = result.id || `result-${Date.now()}`;
    const nextResult = normalizePublishedResults([{ ...result, id }])[0];
    setPublishedResults(current => {
      const normalizedCurrent = normalizePublishedResults(current);
      const exists = normalizedCurrent.some(item => item.id === id);
      return exists
        ? normalizedCurrent.map(item => item.id === id ? nextResult : item)
        : [nextResult, ...normalizedCurrent];
    });
    return id;
  };

  const handleDeleteResult = (id) => {
    setPublishedResults(current => normalizePublishedResults(current).filter(result => result.id !== id));
  };

  const handleSendAnnouncement = (announcement) => {
    const nextAnnouncement = {
      id: `announcement-${Date.now()}`,
      title: announcement.title,
      category: announcement.category || "General",
      message: announcement.message,
      date: getAnnouncementDate(),
      unread: true,
    };
    setAnnouncements(current => [nextAnnouncement, ...normalizeAnnouncements(current)]);
  };

  const handleReadAnnouncement = (id) => {
    setAnnouncements(current =>
      normalizeAnnouncements(current).map(item => item.id === id ? { ...item, unread: false } : item)
    );
  };

  const handleClearAnnouncements = () => {
    setAnnouncements([]);
  };

  const handleSaveTestReport = (report) => {
    setTestReports(current => [report, ...current]);
  };

  const handleSaveComplaint = (complaint) => {
    const id = String(83000000 + visibleComplaints.length + 1);
    const referenceNo = `CMP-${id}`;
    setComplaints(current => [{ ...complaint, id, referenceNo }, ...normalizeComplaints(current)]);
    setComplaintOpen(false);
    setComplaintMessage(`Complaint raised successfully. Reference No. ${referenceNo}`);
    setActive("activities");
  };

  const handleDeleteComplaint = (id) => {
    setComplaints(current => normalizeComplaints(current).filter(complaint => complaint.id !== id));
    setSeenComplaintIds(current => (Array.isArray(current) ? current : []).filter(seenId => String(seenId) !== String(id)));
  };

  const handleClearComplaints = () => {
    setComplaints([]);
    setSeenComplaintIds([]);
  };

  const handleViewComplaints = (ids) => {
    const nextIds = (Array.isArray(ids) ? ids : []).map(String).filter(Boolean);
    if (!nextIds.length) return;

    setSeenComplaintIds(current => {
      const currentList = (Array.isArray(current) ? current : []).map(String);
      const nextSeen = new Set(currentList);
      let changed = false;

      nextIds.forEach(id => {
        if (!nextSeen.has(id)) {
          nextSeen.add(id);
          changed = true;
        }
      });

      return changed ? Array.from(nextSeen) : current;
    });
  };

  if (!auth) {
    return <LoginPage students={visibleStudents} adminUsers={visibleAdminUsers} onLogin={handleLogin} />;
  }

  if (auth.role === "admin") {
    return (
      <AdminDashboard
        students={visibleStudents}
        loggedInStudents={loggedInStudents}
        adminUsers={visibleAdminUsers}
        currentAdmin={currentAdmin}
        facultyMembers={visibleFacultyMembers}
        assignments={visibleAssignments}
        publishedResults={visiblePublishedResults}
        announcements={visibleAnnouncements}
        complaints={visibleComplaints}
        unseenComplaintCount={unseenComplaintCount}
        onAddStudent={handleAddStudent}
        onDeleteStudent={handleDeleteStudent}
        onUpdateStudent={handleUpdateStudent}
        onAddAdmin={handleAddAdmin}
        onUpdateAdmin={handleUpdateAdmin}
        onDeleteAdmin={handleDeleteAdmin}
        onDeleteComplaint={handleDeleteComplaint}
        onClearComplaints={handleClearComplaints}
        onPrintComplaint={printComplaintPdf}
        onSaveFaculty={handleSaveFacultyMember}
        onAddFaculty={handleAddFacultyMember}
        onDeleteFaculty={handleDeleteFacultyMember}
        onAddAssignment={handleAddAssignment}
        onUpdateAssignment={handleUpdateAssignment}
        onDeleteAssignment={handleDeleteAssignment}
        onClearAssignments={handleClearAssignments}
        onSaveResult={handleSaveResult}
        onDeleteResult={handleDeleteResult}
        onSendAnnouncement={handleSendAnnouncement}
        onViewComplaints={handleViewComplaints}
        onLogout={handleLogout}
      />
    );
  }

  const pages = {
    dashboard: <DashboardPage profile={profile} student={currentStudent} announcements={visibleAnnouncements} assignments={visibleAssignments} />,
    attendance: <AttendancePage student={currentStudent} />,
    courses: <CoursesPage facultyMembers={visibleFacultyMembers} />,
    lectures: <LecturesPage />,
    gallery: <GalleryPage />,
    onlineTest: <OnlineTestPage testReports={testReports} onSaveReport={handleSaveTestReport} />,
    fees: <FeesPage />,
    assignments: <AssignmentsPage assignments={visibleAssignments} />,
    results: <ResultsPage student={currentStudent} publishedResults={visiblePublishedResults} facultyMembers={visibleFacultyMembers} />,
    announcements: <AnnouncementsPage announcements={visibleAnnouncements} onMarkRead={handleReadAnnouncement} />,
    activities: <ActivitiesPage testReports={testReports} complaints={visibleComplaints} />,
    settings: <SettingsPage profile={profile} student={currentStudent} onSave={setProfile} />,
  };

  const sections = [...new Set(NAV_ITEMS.map(n => n.section))];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'Sora', 'Segoe UI', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <div style={{ width: 200, background: "#fff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", paddingTop: 20, flexShrink: 0, position: "fixed", left: 0, top: 0, bottom: 0, height: "100vh", overflowY: "auto", zIndex: 30 }}>
          <div style={{ padding: "0 16px 20px", borderBottom: "1px solid #f3f4f6", marginBottom: 8 }}>
            <div style={{ width: 42, height: 42, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8, overflow: "hidden", padding: 4 }}>
              <img src={cimageLogo} alt="Cimage College" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Cimage College</div>
            <div style={{ fontSize: 10, color: "#9ca3af" }}>Student Portal</div>
          </div>

          {sections.map(sec => (
            <div key={sec}>
              <div style={{ fontSize: 9, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 16px 4px" }}>{sec}</div>
              {NAV_ITEMS.filter(n => n.section === sec).map(item => (
                <button key={item.id} onClick={() => setActive(item.id)} style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "9px 16px", fontSize: 13, fontWeight: active === item.id ? 600 : 400,
                  color: active === item.id ? "#185FA5" : "#4b5563",
                  background: active === item.id ? "#eff6ff" : "transparent",
                  border: "none", borderLeft: `2px solid ${active === item.id ? "#185FA5" : "transparent"}`,
                  cursor: "pointer", textAlign: "left", transition: "all 0.12s",
                }}>
                  <Icon name={item.id} size={16} />
                  {item.label}
                </button>
              ))}
            </div>
          ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, marginLeft: 200 }}>
        {/* Topbar */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "fixed", top: 0, left: 200, right: 0, zIndex: 25 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>
              <strong style={{ color: "#111827" }}>{currentDateLabel}</strong> · {currentTimeLabel} — Semester {currentStudent.semester}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => {
                setAiOpen(open => !open);
                setNotificationOpen(false);
                setProfileOpen(false);
              }}
              style={{
                height: 34,
                borderRadius: 999,
                border: "1px solid #bfdbfe",
                background: aiOpen ? "#185FA5" : "#eff6ff",
                color: aiOpen ? "#fff" : "#185FA5",
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "0 12px",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              <Icon name="ai" size={15} />
              AI Help
            </button>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => {
                  setNotificationOpen(open => !open);
                  setProfileOpen(false);
                  setAiOpen(false);
                }}
                style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid #e5e7eb", background: notificationOpen ? "#eff6ff" : "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: notificationOpen ? "#185FA5" : "#6b7280", padding: 0 }}
              >
                <Icon name="bell" size={16} />
              </button>
              {unreadAnnouncements > 0 && (
                <div style={{ position: "absolute", top: 3, right: 2, minWidth: 15, height: 15, padding: "0 4px", background: "#dc2626", color: "#fff", borderRadius: 999, border: "1.5px solid #fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {unreadAnnouncements}
                </div>
              )}

              {notificationOpen && (
                <div style={{
                  position: "absolute",
                  right: -8,
                  top: 46,
                  width: 340,
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
                  zIndex: 20,
                  overflow: "hidden",
                }}>
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Announcements</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{unreadAnnouncements} new notice{unreadAnnouncements === 1 ? "" : "s"}</div>
                    </div>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: "#dbeafe", color: "#185FA5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name="megaphone" size={16} />
                    </div>
                  </div>

                  <div style={{ maxHeight: 300, overflowY: "auto" }}>
                    {visibleAnnouncements.length ? visibleAnnouncements.slice(0, 5).map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          handleReadAnnouncement(item.id);
                          setActive("announcements");
                          setNotificationOpen(false);
                        }}
                        style={{ width: "100%", border: "none", background: item.unread ? "#f8fbff" : "#fff", padding: "13px 16px", display: "flex", gap: 10, textAlign: "left", cursor: "pointer", borderBottom: "1px solid #f3f4f6" }}
                      >
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.unread ? "#185FA5" : "#d1d5db", marginTop: 5, flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 3 }}>{item.title}</div>
                          <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.35 }}>{item.message}</div>
                          <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 6 }}>{item.category} · {item.date}</div>
                        </div>
                      </button>
                    )) : (
                      <div style={{ padding: 22, textAlign: "center", color: "#6b7280", fontSize: 12, fontWeight: 700 }}>
                        No notifications to show.
                      </div>
                    )}
                  </div>

                  <div style={{ padding: 12, display: "grid", gridTemplateColumns: visibleAnnouncements.length ? "1fr 1fr" : "1fr", gap: 8 }}>
                    <button
                      onClick={() => {
                        setActive("announcements");
                        setNotificationOpen(false);
                      }}
                      style={{ ...btnStyle, width: "100%", justifyContent: "center", padding: "9px 10px", background: "#eff6ff", color: "#185FA5", borderColor: "#bfdbfe" }}
                    >
                      View all announcements
                    </button>
                    {visibleAnnouncements.length > 0 && (
                      <button
                        onClick={() => {
                          handleClearAnnouncements();
                          setNotificationOpen(false);
                        }}
                        style={{ ...btnStyle, width: "100%", justifyContent: "center", padding: "9px 10px", background: "#fee2e2", color: "#991b1b", borderColor: "#fecaca" }}
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => {
                  setProfileOpen(open => !open);
                  setNotificationOpen(false);
                  setAiOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  border: "1px solid transparent",
                  background: profileOpen ? "#f8fafc" : "transparent",
                  borderRadius: 10,
                  padding: "4px 6px",
                  cursor: "pointer",
                }}
              >
                <Avatar profile={{ ...profile, name: currentStudent.name || profile.name }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{currentStudent.name || profile.name}</span>
                <Icon name="chevronDown" size={14} />
              </button>

              {profileOpen && (
                <div style={{
                  position: "absolute",
                  right: 0,
                  top: 48,
                  width: 300,
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
                  zIndex: 20,
                  overflow: "hidden",
                }}>
                  <div style={{ padding: 16, borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar profile={{ ...profile, name: currentStudent.name || profile.name }} size={42} fontSize={14} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{currentStudent.name || profile.name}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{currentStudent.course} · Semester {currentStudent.semester}</div>
                    </div>
                  </div>

                  <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      ["Student ID", currentStudent.studentId || "Not set"],
                      ["Email", profile.email],
                      ["Phone", currentStudent.phone || profile.phone],
                      ["Last login", currentStudent.lastLogin],
                    ].map(([label, value]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <span style={{ fontSize: 11, color: "#6b7280" }}>{label}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: "#111827", textAlign: "right" }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: 12, borderTop: "1px solid #f3f4f6", display: "flex", gap: 8 }}>
                    <button
                      onClick={() => {
                        setActive("settings");
                        setProfileOpen(false);
                      }}
                      style={{ ...btnStyle, flex: 1, justifyContent: "center", padding: "8px 10px" }}
                    >
                      <Icon name="profile" size={14} /> Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      style={{ ...btnStyle, flex: 1, justifyContent: "center", padding: "8px 10px", background: "#fee2e2", color: "#991b1b", borderColor: "#fecaca" }}
                    >
                      <Icon name="logout" size={14} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: "82px 24px 24px", maxWidth: ["dashboard", "attendance", "courses", "lectures", "onlineTest", "activities", "gallery", "results"].includes(active) ? 1240 : 960, width: "100%" }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 20, textTransform: "capitalize" }}>
            {active}
          </div>
          {pages[active]}
        </div>
        <AiChatPanel
          open={aiOpen}
          onClose={() => setAiOpen(false)}
          profile={profile}
          student={currentStudent}
          testReports={testReports}
          facultyMembers={visibleFacultyMembers}
          announcements={visibleAnnouncements}
          assignments={visibleAssignments}
          onNavigate={setActive}
          onOpenComplaint={() => setComplaintOpen(true)}
        />
        <ComplaintModal
          open={complaintOpen}
          profile={profile}
          student={currentStudent}
          onClose={() => setComplaintOpen(false)}
          onSubmit={handleSaveComplaint}
        />
        {complaintMessage && (
          <div style={{ position: "fixed", right: 24, bottom: 24, zIndex: 80, background: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0", borderRadius: 12, padding: "12px 14px", fontSize: 13, fontWeight: 800, boxShadow: "0 18px 40px rgba(15,23,42,0.16)" }}>
            {complaintMessage}
            <button type="button" onClick={() => setComplaintMessage("")} style={{ marginLeft: 10, border: "none", background: "transparent", color: "#166534", fontWeight: 900, cursor: "pointer" }}>×</button>
          </div>
        )}
      </div>
    </div>
  );
}
