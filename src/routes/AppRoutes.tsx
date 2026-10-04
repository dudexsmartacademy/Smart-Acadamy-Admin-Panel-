import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ProtectedRoute } from './ProtectedRoute';
import { AdminLayout } from '../layouts/AdminLayout';

// =========================================================
// AUTH PAGES
// =========================================================

import { LoginPage } from '../pages/auth/LoginPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';

// =========================================================
// ADMIN DASHBOARD
// =========================================================

import { DashboardPage } from '../pages/dashboard/DashboardPage';

// =========================================================
// TEACHER MANAGEMENT
// =========================================================

import { TeacherDashboardPage } from '../pages/teachers/TeacherDashboardPage';
import { TeacherListPage } from '../pages/teachers/TeacherListPage';
import { TeacherFormPage } from '../pages/teachers/TeacherFormPage';
import { TeacherDetailPage } from '../pages/teachers/TeacherDetailPage';

import { TeacherApplicationsPage } from '../pages/teacher-applications/TeacherApplicationsPage';

import { TeacherAttendancePage } from '../pages/teacher-attendance/TeacherAttendancePage';
import { TeacherAttendanceDetailPage } from '../pages/teacher-attendance/TeacherAttendanceDetailPage';

import TeacherClassesPage
  from '../pages/teacher-classes/TeacherClassesPage';

import TeacherClassesDetailPage
  from '../pages/teacher-classes/TeacherClassesDetailPage';

import TeacherClassFormPage
  from '../pages/teacher-classes/TeacherClassFormPage';



import { TeacherLeavePage }
  from '../pages/teacher-leave/TeacherLeavePage';

import TeacherLeaveDetailPage
  from '../pages/teacher-leave/TeacherLeaveDetailPage';

import { TeacherProfilePage }
  from '../pages/teachers/TeacherProfilePage';

import { TeacherProfileDetailPage }
  from '../pages/teachers/TeacherProfileDetailPage';

// =========================================================
// TEACHER NOTES
// =========================================================

import TeacherNotesPage
  from '../pages/teacher-notes/TeacherNotesPage';

import TeacherNotesDetailPage
  from '../pages/teacher-notes/TeacherNotesDetailPage';

import TeacherNoteViewPage
  from '../pages/teacher-notes/TeacherNoteViewPage';

import TeacherNoteFormPage
  from '../pages/teacher-notes/TeacherNoteFormPage';

// =========================================================
// TEACHER HACKERRANK
// =========================================================

import TeacherHackerrankTeachersPage
  from '../pages/teacher-hackerrank/TeacherHackerrankTeachersPage';

import TeacherHackerrankPage
  from '../pages/teacher-hackerrank/TeacherHackerrankPage';

import TeacherHackerrankFormPage
  from '../pages/teacher-hackerrank/TeacherHackerrankFormPage';

import TeacherHackerrankResultsPage
  from '../pages/teacher-hackerrank/TeacherHackerrankResultsPage';

import TeacherHackerrankStudentResultPage
  from '../pages/teacher-hackerrank/TeacherHackerrankStudentResultPage';

// =========================================================
// STUDENT MANAGEMENT
// =========================================================

import { StudentDashboardPage } from '../pages/students/StudentDashboardPage';
import { StudentListPage } from '../pages/students/StudentListPage';
import { StudentProfilesPage } from '../pages/students/StudentProfilesPage';
import { StudentProfileDetailPage } from '../pages/students/StudentProfileDetailPage';
import { StudentFormPage } from '../pages/students/StudentFormPage';
import { StudentDetailPage } from '../pages/students/StudentDetailPage';

import { AdmissionsPage } from '../pages/students/AdmissionsPage';
import { EnrollmentsPage } from '../pages/students/EnrollmentsPage';
import { StudentClassesPage } from '../pages/students/StudentClassesPage';
import { StudentSchedulePage } from '../pages/students/StudentSchedulePage';
import { MarkAttendancePage } from '../pages/students/MarkAttendancePage';
import { StudentAttendancePage } from '../pages/students/StudentAttendancePage';
import { StudentAttendanceDetailPage } from '../pages/students/StudentAttendanceDetailPage';
import { StudentAssignmentsPage } from '../pages/students/StudentAssignmentsPage';

import { ExamsPage } from '../pages/students/ExamsPage';
import { ResultsPage } from '../pages/students/ResultsPage';
import { ResultDetailPage } from '../pages/students/ResultDetailPage';
import { StudentPerformancePage } from '../pages/students/StudentPerformancePage';
import { AtRiskStudentsPage } from '../pages/students/AtRiskStudentsPage';
import { StudentQueriesPage } from '../pages/students/StudentQueriesPage';

import { FeesPage } from '../pages/students/FeesPage';
import { PaymentsPage } from '../pages/students/PaymentsPage';
import { CertificatesPage } from '../pages/students/CertificatesPage';

// =========================================================
// ACADEMIC MANAGEMENT
// =========================================================

import { CoursesPage } from '../pages/academic/CoursesPage';
import { CourseDetailPage } from '../pages/academic/CourseDetailPage';
import { SubjectsPage } from '../pages/academic/SubjectsPage';

import { BatchesPage } from '../pages/academic/BatchesPage';
import { BatchDetailPage } from '../pages/academic/BatchDetailPage';

import { ClassesPage } from '../pages/academic/ClassesPage';
import { ClassDetailPage } from '../pages/academic/ClassDetailPage';

// =========================================================
// GENERAL MANAGEMENT
// =========================================================

import { ClassroomsPage } from '../pages/general/ClassroomsPage';
import { CalendarPage } from '../pages/general/CalendarPage';
import { AnnouncementsPage } from '../pages/general/AnnouncementsPage';
import { CentralNotificationsPage } from '../pages/general/CentralNotificationsPage';

import { AnalyticsPage } from '../pages/general/AnalyticsPage';
import { ReportsPage } from '../pages/general/ReportsPage';

import { AdminUsersPage } from '../pages/general/AdminUsersPage';
import { RolesPermissionsPage } from '../pages/general/RolesPermissionsPage';

import { ContentManagementPage } from '../pages/general/ContentManagementPage';
import { SlideBannersPage } from '../pages/general/SlideBannersPage';
import { StorageFilesPage } from '../pages/general/StorageFilesPage';

// =========================================================
// PORTAL MANAGEMENT
// =========================================================

import { TeacherPortalControlPage }
  from '../pages/portal-management/TeacherPortalControlPage';

import { StudentPortalControlPage }
  from '../pages/portal-management/StudentPortalControlPage';

import { PortalNavigationPage }
  from '../pages/portal-management/PortalNavigationPage';

import { PortalPermissionsPage }
  from '../pages/portal-management/PortalPermissionsPage';

// =========================================================
// AUXILIARY ADMIN PAGES
// =========================================================

import { ActivityLogsPage }
  from '../pages/activity-logs/ActivityLogsPage';

import { ProfilePage }
  from '../pages/profile/ProfilePage';

import { SettingsPage }
  from '../pages/settings/SettingsPage';

import { NotFoundPage }
  from '../pages/notFound/NotFoundPage';

// =========================================================
// APP ROUTES
// =========================================================

export const AppRoutes: React.FC = () => {
  return (
    <Routes>

      {/* =====================================================
          ROOT
      ===================================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to="/admin/dashboard"
            replace
          />
        }
      />

      {/* =====================================================
          PUBLIC AUTH ROUTES
      ===================================================== */}

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />

      {/* =====================================================
          PROTECTED ADMIN CONSOLE
      ===================================================== */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >

        {/* ===================================================
            ADMIN ROOT
        =================================================== */}

        <Route
          index
          element={
            <Navigate
              to="/admin/dashboard"
              replace
            />
          }
        />

        {/* ===================================================
            DASHBOARD
        =================================================== */}

        <Route
          path="dashboard"
          element={<DashboardPage />}
        />

        {/* ===================================================
            PORTAL MANAGEMENT
        =================================================== */}

        <Route
          path="portal-management"
          element={
            <Navigate
              to="/admin/portal-management/permissions"
              replace
            />
          }
        />

        <Route
          path="portal-management/teacher"
          element={<TeacherPortalControlPage />}
        />

        <Route
          path="portal-management/student"
          element={<StudentPortalControlPage />}
        />

        <Route
          path="portal-management/navigation"
          element={<PortalNavigationPage />}
        />

        <Route
          path="portal-management/permissions"
          element={<PortalPermissionsPage />}
        />

        {/* ===================================================
            STUDENT MANAGEMENT
        =================================================== */}

        <Route
          path="students"
          element={<StudentDashboardPage />}
        />

        <Route
          path="students/list"
          element={<StudentListPage />}
        />

        <Route
          path="students/new"
          element={<StudentFormPage />}
        />

        <Route
          path="students/:studentId"
          element={<StudentDetailPage />}
        />

        <Route
          path="students/:studentId/edit"
          element={<StudentFormPage />}
        />

        <Route
          path="students/profiles"
          element={<StudentProfilesPage />}
        />

        <Route
          path="students/profile/:studentId"
          element={<StudentProfileDetailPage />}
        />

        <Route
          path="students/admissions"
          element={<AdmissionsPage />}
        />

        <Route
          path="students/enrollments"
          element={<EnrollmentsPage />}
        />

        <Route
          path="students/classes"
          element={<StudentClassesPage />}
        />

        <Route
          path="students/schedule"
          element={<StudentSchedulePage />}
        />

        <Route
          path="students/mark-attendance"
          element={<MarkAttendancePage />}
        />

        <Route
          path="students/attendance"
          element={<StudentAttendancePage />}
        />

        <Route
          path="students/attendance/:studentId"
          element={<StudentAttendanceDetailPage />}
        />

        <Route
          path="students/assignments"
          element={<StudentAssignmentsPage />}
        />

        <Route
          path="students/exams"
          element={<ExamsPage />}
        />

        <Route
          path="students/results"
          element={<ResultsPage />}
        />

        <Route
          path="students/results/:studentId"
          element={<ResultDetailPage />}
        />

        <Route
          path="students/:studentId/results"
          element={<ResultDetailPage />}
        />

        <Route
          path="students/:studentId/results/:resultId"
          element={<ResultDetailPage />}
        />

        <Route
          path="students/performance"
          element={<StudentPerformancePage />}
        />

        <Route
          path="students/at-risk"
          element={<AtRiskStudentsPage />}
        />

        <Route
          path="students/queries"
          element={<StudentQueriesPage />}
        />

        {/* ===================================================
            ACADEMIC MANAGEMENT
        =================================================== */}

        <Route
          path="courses"
          element={<CoursesPage />}
        />

        <Route
          path="courses/:courseId"
          element={<CourseDetailPage />}
        />

        <Route
          path="subjects"
          element={<SubjectsPage />}
        />

        <Route
          path="batches"
          element={<BatchesPage />}
        />

        <Route
          path="batches/:batchId"
          element={<BatchDetailPage />}
        />

        <Route
          path="classes"
          element={<ClassesPage />}
        />

        <Route
          path="classes/:classId"
          element={<ClassDetailPage />}
        />

        {/* ===================================================
            GENERAL MANAGEMENT
        =================================================== */}

        <Route
          path="classrooms"
          element={<ClassroomsPage />}
        />

        <Route
          path="calendar"
          element={<CalendarPage />}
        />

        <Route
          path="announcements"
          element={<AnnouncementsPage />}
        />

        <Route
          path="notifications"
          element={<CentralNotificationsPage />}
        />

        <Route
          path="analytics"
          element={<AnalyticsPage />}
        />

        <Route
          path="reports"
          element={<ReportsPage />}
        />

        <Route
          path="admin-users"
          element={<AdminUsersPage />}
        />

        <Route
          path="roles"
          element={<RolesPermissionsPage />}
        />

        <Route
          path="content"
          element={<ContentManagementPage />}
        />

        <Route
          path="content/slides"
          element={<SlideBannersPage />}
        />

        <Route
          path="storage"
          element={<StorageFilesPage />}
        />

        {/* ===================================================
            TEACHER MANAGEMENT
        =================================================== */}

        <Route
          path="teachers"
          element={<TeacherDashboardPage />}
        />

        <Route
          path="teachers/list"
          element={<TeacherListPage />}
        />

        <Route
          path="teachers/new"
          element={<TeacherFormPage />}
        />

        <Route
          path="teachers/applications"
          element={<TeacherApplicationsPage />}
        />

        {/* ===================================================
            TEACHER HACKERRANK
        =================================================== */}

        {/* Base HackerRank route */}

        <Route
  path="teachers/hackerrank"
  element={<TeacherHackerrankTeachersPage />}
/>

        <Route
          path="teachers/hackerrank"
          element={
            <Navigate
              to="/admin/teachers/hackerrank/TCH-2024-001"
              replace
            />
          }
        />

        {/* Teacher HackerRank Dashboard */}

        <Route
          path="teachers/hackerrank/:teacherId"
          element={<TeacherHackerrankPage />}
        />

        {/* Create HackerRank Challenge */}

        <Route
          path="teachers/hackerrank/:teacherId/create"
          element={<TeacherHackerrankFormPage />}
        />

        {/* Edit HackerRank Challenge */}

        <Route
          path="teachers/hackerrank/:teacherId/edit/:challengeId"
          element={<TeacherHackerrankFormPage />}
        />

        {/* HackerRank Results */}

        <Route
          path="teachers/hackerrank/:teacherId/results/:challengeId"
          element={<TeacherHackerrankResultsPage />}
        />

        {/* Individual Student Result */}

        <Route
          path="teachers/hackerrank/:teacherId/results/:challengeId/student/:resultId"
          element={<TeacherHackerrankStudentResultPage />}
        />

        {/* ===================================================
            TEACHER DETAIL
        =================================================== */}

        <Route
          path="teachers/:teacherId"
          element={<TeacherDetailPage />}
        />

        <Route
          path="teachers/:teacherId/edit"
          element={<TeacherFormPage />}
        />

        {/* ===================================================
            TEACHER ATTENDANCE
        =================================================== */}

        <Route
          path="teachers/attendance"
          element={<TeacherAttendancePage />}
        />

        <Route
          path="teachers/attendance/:teacherId"
          element={<TeacherAttendanceDetailPage />}
        />

        {/* ===================================================
            TEACHER CLASSES
        =================================================== */}

        <Route
          path="teachers/classes"
          element={<TeacherClassesPage />}
        />

        <Route
          path="teachers/classes/:teacherId"
          element={<TeacherClassesDetailPage />}
        />

        <Route
          path="teachers/classes/:teacherId/create"
          element={<TeacherClassFormPage />}
        />

        <Route
          path="teachers/classes/:teacherId/edit/:classId"
          element={<TeacherClassFormPage />}
        />

        {/* ===================================================
            TEACHER LEAVE
        =================================================== */}

        <Route
          path="teachers/leave"
          element={<TeacherLeavePage />}
        />

        <Route
          path="teachers/leave/:teacherId"
          element={<TeacherLeaveDetailPage />}
        />

        {/* ===================================================
            TEACHER PROFILES
        =================================================== */}

        <Route
          path="teachers/profiles"
          element={<TeacherProfilePage />}
        />

        <Route
          path="teachers/profile/:teacherId"
          element={<TeacherProfileDetailPage />}
        />

        {/* ===================================================
            TEACHER NOTES
        =================================================== */}

        <Route
          path="teachers/notes"
          element={<TeacherNotesPage />}
        />

        <Route
          path="teachers/notes/:teacherId"
          element={<TeacherNotesDetailPage />}
        />

        <Route
          path="teachers/notes/:teacherId/new"
          element={<TeacherNoteFormPage />}
        />

        <Route
          path="teachers/notes/:teacherId/create"
          element={<TeacherNoteFormPage />}
        />

        <Route
          path="teachers/notes/:teacherId/edit/:noteId"
          element={<TeacherNoteFormPage />}
        />

        <Route
          path="teachers/notes/:teacherId/view/:noteId"
          element={<TeacherNoteViewPage />}
        />

        {/* ===================================================
            AUXILIARY ADMIN PAGES
        =================================================== */}

        <Route
          path="activity-logs"
          element={<ActivityLogsPage />}
        />

        <Route
          path="profile"
          element={<ProfilePage />}
        />

        <Route
          path="settings"
          element={<SettingsPage />}
        />

        {/* ===================================================
            ADMIN 404
        =================================================== */}

        <Route
          path="404"
          element={<NotFoundPage />}
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />

      </Route>

      {/* =====================================================
          GLOBAL CATCH-ALL
      ===================================================== */}

      <Route
        path="*"
        element={<NotFoundPage />}
      />

    </Routes>
  );
};