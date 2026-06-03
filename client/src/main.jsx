import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.jsx';
import Login from './pages/Login.jsx';
import { AuthProvider, useAuth } from './lib/auth.jsx';
import './styles.css';

import Dashboard from './pages/Dashboard.jsx';
import Search from './pages/Search.jsx';
import Notifications from './pages/Notifications.jsx';
import Residents from './pages/Residents.jsx';
import ResidentDetail from './pages/ResidentDetail.jsx';
import Mar from './pages/Mar.jsx';
import Behavioral from './pages/Behavioral.jsx';
import Bip from './pages/Bip.jsx';
import Incidents from './pages/Incidents.jsx';
import Appointments from './pages/Appointments.jsx';
import Facilities from './pages/Facilities.jsx';
import Staff from './pages/Staff.jsx';
import Training from './pages/Training.jsx';
import Workload from './pages/Workload.jsx';
import Handoff from './pages/Handoff.jsx';
import Documents from './pages/Documents.jsx';
import Licensing from './pages/Licensing.jsx';
import Hipaa from './pages/Hipaa.jsx';
import Audit from './pages/Audit.jsx';
import Outcomes from './pages/Outcomes.jsx';
import CourtReport from './pages/CourtReport.jsx';
import Discharge from './pages/Discharge.jsx';
import GuardianPortal from './pages/GuardianPortal.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';
import TrainingCourses from './pages/TrainingCourses.jsx';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Protected><App /></Protected>}>
            <Route index element={<Dashboard />} />
            <Route path="search" element={<Search />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="residents" element={<Residents />} />
            <Route path="residents/:id" element={<ResidentDetail />} />
            <Route path="mar" element={<Mar />} />
            <Route path="behavioral" element={<Behavioral />} />
            <Route path="bip" element={<Bip />} />
            <Route path="incidents" element={<Incidents />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="facilities" element={<Facilities />} />
            <Route path="staff" element={<Staff />} />
            <Route path="training" element={<Training />} />
            <Route path="workload" element={<Workload />} />
            <Route path="handoff" element={<Handoff />} />
            <Route path="documents" element={<Documents />} />
            <Route path="licensing" element={<Licensing />} />
            <Route path="hipaa" element={<Hipaa />} />
            <Route path="audit" element={<Audit />} />
            <Route path="outcomes" element={<Outcomes />} />
            <Route path="court-report" element={<CourtReport />} />
            <Route path="discharge" element={<Discharge />} />
            <Route path="guardian-portal" element={<GuardianPortal />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route
              path="/training-courses"
              element={<TrainingCourses />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
