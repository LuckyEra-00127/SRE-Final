import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateHabitPage from "./pages/CreateHabitPage";
import DashboardPage from "./pages/DashboardPage";
import EditHabitPage from "./pages/EditHabitPage";
import HabitDetailsPage from "./pages/HabitDetailsPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";
import WeeklySummaryPage from "./pages/WeeklySummaryPage";
import { useAuthStore } from "./store/authStore";

function PublicOnlyRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/habits/new" element={<CreateHabitPage />} />
        <Route path="/habits/:id" element={<HabitDetailsPage />} />
        <Route path="/habits/:id/edit" element={<EditHabitPage />} />
        <Route path="/weekly-summary" element={<WeeklySummaryPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
