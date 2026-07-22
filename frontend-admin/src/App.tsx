import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/auth/Login';
import AdminLogin from './pages/auth/AdminLogin';
import GovernmentLogin from './pages/auth/GovernmentLogin';
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

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/government/login" element={<GovernmentLogin />} />
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
      </Routes>
      <AIAgentWidget />
    </ThemeProvider>
  );
}

export default App;
