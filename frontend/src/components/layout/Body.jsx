import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import Header from "./Header";
import Footer from "./Footer";
import { socket, connectSocket, disconnectSocket } from "../../lib/socket";

const Body = () => {
  const user = useSelector((store) => store.user);

  useEffect(() => {
    if (user) {
      connectSocket();

      // Listen for global new event announcements
      const handleNewEvent = (data) => {
        if (user.role === "user") {
          toast.success(`New Event: ${data.title} by ${data.organizer}!`, {
            icon: '🎉',
            duration: 5000,
          });
        }
      };

      socket.on("new_event", handleNewEvent);

      return () => {
        socket.off("new_event", handleNewEvent);
        disconnectSocket();
      };
    } else {
      disconnectSocket();
    }
  }, [user?._id, user?.role]);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
