import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./lib/appStore";
import LoginPage from "./pages/LoginPage";
import Body from "./components/Body";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import ProfilePage from "./pages/ProfilePage";
import TeamFinder from "./pages/TeamFinder";
import ForgotPassword from "./pages/ForgotPassword";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import { ProtectedRoute, OrganizerRoute, AuthLoader, GuestRoute } from "./components/RouteGuards";

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <AuthLoader>
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
                <OrganizerRoute>
                  <OrganizerDashboard />
                </OrganizerRoute>
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
        </AuthLoader>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
