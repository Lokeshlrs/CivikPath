import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public & User Pages
import { LandingPage } from '../pages/public/LandingPage';
import { TaskPage } from '../pages/public/TaskPage';
import { LocationPage } from '../pages/public/LocationPage';
import { GeneratingPage } from '../pages/public/GeneratingPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { AdminLoginPage } from '../pages/public/AdminLoginPage';
import { AskAiPage } from '../pages/public/AskAiPage';
import { ServicesPage } from '../pages/public/ServicesPage';

import { RoadmapPage } from '../pages/user/RoadmapPage';
import { StepDetailPage } from '../pages/user/StepDetailPage';
import { DocumentsPage } from '../pages/user/DocumentsPage';
import { SourceDetailPage } from '../pages/user/SourceDetailPage';
import { MyPathsPage } from '../pages/user/MyPathsPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { SourcesPage } from '../pages/admin/SourcesPage';
import { VerificationPage } from '../pages/admin/VerificationPage';
import { ProcedureEditorPage } from '../pages/admin/ProcedureEditorPage';
import { ChangesPage } from '../pages/admin/ChangesPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/ask" element={<AskAiPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/task" element={<TaskPage />} />
      <Route path="/location" element={<LocationPage />} />
      <Route path="/questions" element={<Navigate to="/generating" replace />} />
      <Route path="/confirm" element={<Navigate to="/generating" replace />} />
      <Route path="/generating" element={<GeneratingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />


      {/* User Dashboard & Path Routes */}
      <Route path="/roadmap" element={<RoadmapPage />} />
      <Route path="/roadmap/step/:stepId" element={<StepDetailPage />} />
      <Route path="/documents" element={<DocumentsPage />} />
      <Route path="/source/:sourceId" element={<SourceDetailPage />} />
      <Route path="/my-paths" element={<MyPathsPage />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/sources" element={<SourcesPage />} />
      <Route path="/admin/verification" element={<VerificationPage />} />
      <Route path="/admin/procedure-editor" element={<ProcedureEditorPage />} />
      <Route path="/admin/changes" element={<ChangesPage />} />

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
