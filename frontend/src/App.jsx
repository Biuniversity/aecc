import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Employee Pages
import AttendanceSubmit from './pages/AttendanceSubmit';
import AttendanceHistory from './pages/AttendanceHistory';
import BaccaratGame from './pages/BaccaratGame';

// Admin Pages
import AdminUsers from './pages/admin/AdminUsers';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminKPI from './pages/admin/AdminKPI';
import AdminPosts from './pages/admin/AdminPosts';
import AdminCarousel from './pages/admin/AdminCarousel';

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* User Protected Routes */}
              <Route element={<ProtectedRoute adminOnly={false} />}>
                <Route path="/attendance/new" element={<AttendanceSubmit />} />
                <Route path="/attendance/history" element={<AttendanceHistory />} />
                <Route path="/game" element={<BaccaratGame />} />
              </Route>

              {/* Admin Only Protected Routes */}
              <Route element={<ProtectedRoute adminOnly={true} />}>
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/attendance" element={<AdminAttendance />} />
                <Route path="/admin/kpi" element={<AdminKPI />} />
                <Route path="/admin/posts" element={<AdminPosts />} />
                <Route path="/admin/carousel" element={<AdminCarousel />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
