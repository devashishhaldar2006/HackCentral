import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const ErrorPage = ({ type = "404", error }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const is404 = type === "404";
  
  const title = is404 ? "Page Not Found" : "Something Went Wrong";
  const subtitle = is404 
    ? `We couldn't find the page you were looking for at ${location.pathname}`
    : "An unexpected error occurred in the application.";
  const errorCode = is404 ? "404" : "500";
  
  const handleGoBack = () => navigate(-1);
  const handleGoHome = () => navigate("/");

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-200/50 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 max-w-2xl w-full flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.1,
          }}
          className="text-8xl md:text-[140px] font-black text-yellow-500 tracking-tighter leading-none mb-4"
        >
          {errorCode}
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
          {title}
        </h1>

        <p className="text-base text-slate-600 max-w-lg mx-auto mb-8">
          {subtitle}
        </p>
        
        {!is404 && error && (
          <div className="w-full bg-red-50 border border-red-200 rounded-xl p-4 mb-8 text-left overflow-auto max-h-48 text-xs text-red-600 font-mono">
            {error.toString()}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={handleGoBack}
            className="btn-white"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Go Back
          </button>
          
          <button
            onClick={handleGoHome}
            className="btn-yellow"
          >
            <span className="material-symbols-outlined text-lg">home</span>
            Return Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;