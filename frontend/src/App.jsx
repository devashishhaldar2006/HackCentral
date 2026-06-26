import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./lib/appStore";
import LoginPage from "./pages/LoginPage";
import Body from "./components/layout/Body";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import ProfilePage from "./pages/ProfilePage";
import ProjectLabPage from "./pages/ProjectLabPage"
import AboutUsPage from "./pages/AboutUsPage";
import ForgotPassword from "./pages/ForgotPassword";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import UserDashboard from "./pages/UserDashboard";
import SavedEventsPage from "./pages/SavedEventsPage";
import ResourceHub from "./pages/ResourceHub";
import ResourceDetails from "./pages/ResourceDetails";
import ErrorPage from "./pages/ErrorPage";
import ErrorBoundary from "./components/layout/ErrorBoundary";
import { ProtectedRoute, OrganizerRoute, UserRoute, AuthLoader, GuestRoute } from "./components/auth/RouteGuards";

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <AuthLoader>
          <ErrorBoundary>
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
              path="dashboard"
              element={
                <UserRoute>
                  <UserDashboard />
                </UserRoute>
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
            <Route
              path="projectlab"
              element={
                <UserRoute>
                  <ProjectLabPage />
                </UserRoute>
              }
            />
            <Route path="aboutus" element={<AboutUsPage />} />
            <Route
              path="events"
              element={
                <UserRoute>
                  <EventsPage />
                </UserRoute>
              }
            />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route
              path="saved"
              element={
                <UserRoute>
                  <SavedEventsPage />
                </UserRoute>
              }
            />
            <Route
              path="resources"
              element={
                <UserRoute>
                  <ResourceHub />
                </UserRoute>
              }
            />
            <Route
              path="resources/:id"
              element={
                <UserRoute>
                  <ResourceDetails />
                </UserRoute>
              }
            />
            {/* Catch-all */}
            <Route path="*" element={<ErrorPage type="404" />} />
          </Route>
        </Routes>
        </ErrorBoundary>
        </AuthLoader>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
