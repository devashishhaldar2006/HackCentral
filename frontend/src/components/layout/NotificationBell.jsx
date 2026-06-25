import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../../lib/constants";
import { socket } from "../../lib/socket";

const NotificationBell = () => {
  const user = useSelector((store) => store.user);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/notifications`, {
        withCredentials: true,
      });
      setNotifications(data.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Listen to real-time events to refresh notifications
    const handleRefresh = () => fetchNotifications();

    socket.on("new_event", handleRefresh);
    socket.on("new_registration", handleRefresh);
    // Announcements aren't currently saved as global notifications, 
    // but if they were, we would listen to new_announcement.

    return () => {
      socket.off("new_event", handleRefresh);
      socket.off("new_registration", handleRefresh);
    };
  }, [user]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.put(`${BASE_URL}/notifications/${id}/read`, {}, { withCredentials: true });
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, readBy: [...n.readBy, user._id] } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  if (!user) return null;

  const unreadCount = notifications.filter(
    (n) => !n.readBy.includes(user._id)
  ).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-[#0d4af2] hover:bg-[#0d4af2]/10 rounded-full transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-2xl">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-[#0a0f1e]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1e293b] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs font-bold text-[#0d4af2] bg-[#0d4af2]/10 px-2 py-0.5 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">notifications_off</span>
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const isUnread = !notif.readBy.includes(user._id);
                return (
                  <div
                    key={notif._id}
                    className={`p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-[#1c2438] transition-colors ${
                      isUnread ? "bg-slate-50/50 dark:bg-slate-800/20" : "opacity-75"
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${isUnread ? 'bg-[#0d4af2]' : 'bg-transparent'}`} />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                          {notif.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
                          {notif.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                          {isUnread && (
                            <button
                              onClick={() => markAsRead(notif._id)}
                              className="text-[11px] font-bold text-[#0d4af2] hover:text-[#0a3bc4] transition-colors"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
