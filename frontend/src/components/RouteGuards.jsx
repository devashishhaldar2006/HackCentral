import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import { addUser } from "../lib/userSlice";
import { BASE_URL } from "../lib/constants";
import { Spinner } from "./Spinner";

/** Context to share auth-loading state with route guards */
const AuthContext = createContext({ isAuthLoaded: false });

/** Restores user session on reload, provides auth-loaded flag to children */
export const AuthLoader = ({ children }) => {
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const res = await axios.get(BASE_URL + "/profile/me", {
          withCredentials: true,
        });
        if (isMounted) {
          dispatch(addUser(res.data.data));
        }
      } catch (err) {
        // Not logged in or invalid session — this is expected
        console.log("AuthLoader: no active session found");
      } finally {
        if (isMounted) {
          setIsAuthLoaded(true);
        }
      }
    };
    fetchUser();
    return () => { isMounted = false; };
  }, [dispatch]);

  if (!isAuthLoaded) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f5f6f8] dark:bg-[#080c18]">
        <Spinner />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};

export const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  const { isAuthLoaded } = useContext(AuthContext);

  // If auth hasn't loaded yet, show a loading spinner instead of redirecting
  if (!isAuthLoaded) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f5f6f8] dark:bg-[#080c18]">
        <Spinner />
      </div>
    );
  }

  if (!user) return <Navigate to="/signin" replace />;
  return children;
};

/** Route guard — specifically for organizers */
export const OrganizerRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  const { isAuthLoaded } = useContext(AuthContext);

  if (!isAuthLoaded) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f5f6f8] dark:bg-[#080c18]">
        <Spinner />
      </div>
    );
  }

  if (!user) return <Navigate to="/signin" replace />;
  if (user.role !== "organizer") return <Navigate to="/user/events" replace />;
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
