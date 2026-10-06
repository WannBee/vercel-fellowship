import { useState } from "react";
import { Menu } from "lucide-react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { ParticipantsProvider } from "./context/ParticipantsContext";
import Sidebar from "./components/Sidebar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Roles from "./pages/Roles";

function Layout() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  if (!user) return <Navigate to="/" replace />;
  return (
    <ParticipantsProvider>
      <div className="flex h-dvh">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="md:hidden flex items-center gap-3 bg-slate-900 text-white px-4 py-3 shrink-0">
            <button onClick={() => setOpen(true)} aria-label="Buka menu">
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold">FellowshipApp</span>
          </header>
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </ParticipantsProvider>
  );
}

const AdminOnly = ({ children }) =>
  useAuth().user?.role === "admin" ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/roles"
          element={
            <AdminOnly>
              <Roles />
            </AdminOnly>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
