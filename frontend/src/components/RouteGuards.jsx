import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { addUser } from "../lib/userSlice";
import { BASE_URL } from "../lib/constants";
import { Spinner } from "./Spinner";

export const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  if (!user) return <Navigate to="/signin" replace />;
  return children;
};

/** Route guard — specifically for organizers */
export const OrganizerRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  if (!user) return <Navigate to="/signin" replace />;
  if (user.role !== "organizer") return <Navigate to="/user/events" replace />;
  return children;
};

/** Restores user session on reload */
export const AuthLoader = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(BASE_URL + "/auth/me", {
          withCredentials: true,
        });
        dispatch(addUser(res.data.data));
      } catch (err) {
        // Not logged in or invalid session
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f5f6f8] dark:bg-[#080c18]">
        <Spinner />
      </div>
    );
  }

  return children;
};

/** Redirect logged-in users away from auth pages */
export const GuestRoute = ({ children }) => {
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
