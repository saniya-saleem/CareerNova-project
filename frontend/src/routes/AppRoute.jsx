import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import ResumeUpload from "../pages/ResumeUpload";
import MockInterview from "../pages/MockInterview";
import Chat from "../pages/Chat";
import AdminPanel from "../pages/AdminPanel";
import AdminRoute from "../components/AdminRoute";
import RoomPage from "../pages/RoomPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={
        localStorage.getItem("access")
          ? <Profile />
          : <Login />
      } />
      <Route path="/resume-upload" element={<ResumeUpload />} />
      <Route path="/mock-interview" element={<MockInterview />} />
      <Route path="/chat" element={<Chat />} />
      <Route
        path="/admin-panel"
        element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        }
      />
      <Route path="/room" element={<RoomPage />} />
    </Routes>
  );
}