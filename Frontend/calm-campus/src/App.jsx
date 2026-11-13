
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Navbar from "./components/Navbar";

import EmotionCheckIn from "./pages/EmotionCheckIN";
import StressRelief from "./pages/StressRelief";
import Hobbies from "./pages/Hobbies";
import Reflection from "./pages/Reflection";

import { isAuthenticated } from "./services/auth";

function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function MainLayout() {
  return (
    <div className="cc-app-layout">
      <Navbar />
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route
              path="/checkin"
              element={<EmotionCheckIn />}
            />
            <Route
              path="/stress-relief"
              element={<StressRelief />}
            />
            <Route
              path="/hobbies"
              element={<Hobbies />}
            />
            <Route
              path="/reflection"
              element={<Reflection />}
            />
          </Route>
        </Route>

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



