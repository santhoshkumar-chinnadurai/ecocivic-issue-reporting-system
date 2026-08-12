import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/auth/Login';
import AdminLogin from './pages/auth/AdminLogin';
import GovernmentLogin from './pages/auth/GovernmentLogin';
import WorkerLogin from './pages/auth/WorkerLogin';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import IssueDetail from './pages/citizen/IssueDetail';
import UsersList from './pages/admin/UsersList';
import UserProfile from './pages/citizen/UserProfile';
import CreateReport from './pages/citizen/CreateReport';
import Reports from './pages/official/Reports';
import Monitor from './pages/official/Monitor';

import ProtectedRoute from './components/common/ProtectedRoute';
import Debug from './pages/Debug';
import AIAgentWidget from './components/common/AIAgentWidget';
import { ThemeProvider } from './contexts/ThemeContext';
import ChatPage from './pages/ChatPage';
import LeaderboardPage from './pages/LeaderboardPage';

import NotFoundPage from './pages/NotFoundPage';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <ThemeProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/government/login" element={<GovernmentLogin />} />
        <Route path="/worker/login" element={<WorkerLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/government/dashboard"
          element={
            <ProtectedRoute allowedRoles={['OFFICIAL', 'ADMIN']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker/dashboard"
          element={
            <ProtectedRoute allowedRoles={['WORKER', 'ADMIN']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UsersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-report"
          element={
            <ProtectedRoute allowedRoles={['CITIZEN']}>
              <CreateReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues/:id"
          element={
            <ProtectedRoute>
              <IssueDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'OFFICIAL', 'WORKER']}>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/debug" element={<Debug />} />
        <Route
          path="/monitor"
          element={
            <ProtectedRoute>
              <Monitor />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <AIAgentWidget />
    </ThemeProvider>
  );
}

export default App;
