import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import appStore from "./lib/appStore";
import LoginPage from "./pages/LoginPage";
import Body from "./components/Body";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import ProfilePage from "./pages/ProfilePage";
import TeamFinder from "./pages/TeamFinder";
import ForgotPassword from "./pages/ForgotPassword";
import OrganizerDashboard from "./pages/OrganizerDashboard";

/** Route guard — redirects to /signin when not authenticated */
const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  if (!user) return <Navigate to="/signin" replace />;
  return children;
};

/** Redirect logged-in users away from auth pages */
const GuestRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  if (user)
    return (
      <Navigate
        to={user.role === "organizer" ? "/organizer/dashboard" : "/user/events"}
        replace
      />
    );
  return children;
};

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route index element={<HomePage />} />
            <Route
              path="signin"
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />
            <Route
              path="user/events"
              element={
                <ProtectedRoute>
                  <EventsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="organizer/dashboard"
              element={
                <ProtectedRoute>
                  <OrganizerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="teamfinder" element={<TeamFinder />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            {/* Catch-all → 404 redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
