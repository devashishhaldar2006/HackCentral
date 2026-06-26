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
    <div className="min-h-screen w-full bg-[#f5f6f8] dark:bg-[#0a0f1e] flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 dark:bg-[#0d4af2]/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 dark:bg-purple-600/20 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
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
          className="text-8xl md:text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-br from-[#0d4af2] to-purple-600 tracking-tighter leading-none mb-6 drop-shadow-sm"
        >
          {errorCode}
        </motion.div>

        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
          {title}
        </h1>

        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto mb-10">
          {subtitle}
        </p>
        
        {!is404 && error && (
          <div className="w-full bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-10 text-left overflow-auto max-h-48 text-sm text-red-600 dark:text-red-400 font-mono">
            {error.toString()}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={handleGoBack}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            Go Back
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-[#0d4af2] hover:bg-[#0d4af2]/90 shadow-lg shadow-[#0d4af2]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">home</span>
            Return Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;