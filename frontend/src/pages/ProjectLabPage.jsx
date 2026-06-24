import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../lib/constants";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const ProjectLabPage = () => {
  const [activeTab, setActiveTab] = useState("evaluator");
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e] text-slate-900 dark:text-white p-4 sm:p-6 pb-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
          >
            Project <span className="text-[#0d4af2]">Lab</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl"
          >
            AI-powered tools to evaluate your ideas and generate professional pitch decks. 
            Level up your hackathon projects.
          </motion.p>
        </header>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-slate-800/50 p-1 rounded-xl flex space-x-1 shadow-sm border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab("evaluator")}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === "evaluator" 
                  ? "bg-[#0d4af2] text-white shadow-md shadow-[#0d4af2]/20" 
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">analytics</span>
              <span>AI Evaluator</span>
            </button>
            <button
              onClick={() => setActiveTab("pitchDeck")}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                activeTab === "pitchDeck" 
                  ? "bg-[#0d4af2] text-white shadow-md shadow-[#0d4af2]/20" 
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">co_present</span>
              <span>Pitch Deck Generator</span>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "evaluator" ? (
            <Evaluator key="evaluator" />
          ) : (
            <PitchDeck key="pitchDeck" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// Sub-components
// ----------------------------------------------------
const ScoreBar = ({ label, score, colorClass, bgClass }) => (
  <div className="mb-4">
    <div className="flex justify-between text-sm mb-1.5 font-bold text-slate-700 dark:text-slate-300">
      <span>{label}</span>
      <span className={colorClass}>{score}/10</span>
    </div>
    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${score * 10}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`h-full rounded-full ${bgClass}`} 
      />
    </div>
  </div>
);

const SectionCard = ({ icon, title, content, colorClass }) => (
  <div className="bg-slate-50 dark:bg-slate-800/30 p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#0d4af2]/30 transition-all shadow-sm">
    <h3 className={`text-md font-bold mb-2 flex items-center gap-2 ${colorClass}`}>
      <span className="material-symbols-outlined text-[20px]">{icon}</span> 
      {title}
    </h3>
    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">{content}</p>
  </div>
);

// ----------------------------------------------------
// Evaluator Component
// ----------------------------------------------------
const Evaluator = () => {
  const [formData, setFormData] = useState({ title: "", description: "", techStack: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${BASE_URL}/project-lab/evaluate`, formData, { withCredentials: true });
      if (res.data.success) {
        setResult(res.data.result);
      }
    } catch (err) {
      setResult(null);
      setError(err.response?.data?.message || "Failed to evaluate project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid grid-cols-1 lg:grid-cols-12 gap-8"
    >
      {/* Input Form */}
      <div className="lg:col-span-5 bg-white dark:bg-[#161d2f] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
          <span className="material-symbols-outlined text-[#0d4af2]">edit_document</span>
          Project Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Project Title</label>
            <input
              type="text"
              name="title"
              required
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0d4af2] focus:border-transparent transition-all outline-none"
              placeholder="e.g. HackCentral"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</label>
            <textarea
              name="description"
              required
              rows="5"
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0d4af2] focus:border-transparent transition-all outline-none resize-none"
              placeholder="Describe your project's problem and solution..."
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tech Stack (Optional)</label>
            <input
              type="text"
              name="techStack"
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0d4af2] focus:border-transparent transition-all outline-none"
              placeholder="e.g. React, Node.js, MongoDB"
              onChange={handleChange}
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-200 dark:border-red-500/20">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0d4af2] hover:bg-[#0d4af2]/90 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-[#0d4af2]/20 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </span>
            ) : (
              <>Evaluate Idea <span className="material-symbols-outlined text-[18px]">arrow_forward</span></>
            )}
          </button>
        </form>
      </div>

      {/* Output View */}
      <div className="lg:col-span-7 bg-white dark:bg-[#161d2f] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-y-auto" style={{ maxHeight: "calc(100vh - 220px)" }}>
        {result ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-black mb-6 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
              Evaluation Results
            </h2>
            
            {/* Scores Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <ScoreBar label="Innovation" score={Number(result.innovationScore) || 0} colorClass="text-[#0d4af2]" bgClass="bg-[#0d4af2]" />
                <ScoreBar label="Technical Complexity" score={Number(result.technicalComplexity) || 0} colorClass="text-violet-500" bgClass="bg-violet-500" />
              </div>
              <div>
                <ScoreBar label="Market Potential" score={Number(result.marketPotential) || 0} colorClass="text-emerald-500" bgClass="bg-emerald-500" />
                <ScoreBar label="Presentation Readiness" score={Number(result.presentationReadiness) || 0} colorClass="text-amber-500" bgClass="bg-amber-500" />
              </div>
            </div>

            {/* Overall Feedback */}
            <div className="bg-[#0d4af2]/5 border border-[#0d4af2]/20 p-5 rounded-xl mb-8">
              <h3 className="text-[#0d4af2] font-bold mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">insights</span>
                Overall Feedback
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm font-medium">{result.overallFeedback}</p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 p-5 rounded-xl">
                <h3 className="text-emerald-600 dark:text-emerald-400 font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {(Array.isArray(result.strengths) ? result.strengths : []).map((s, i) => (
                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="material-symbols-outlined text-emerald-500 text-[16px] mt-0.5 shrink-0">check</span> 
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-5 rounded-xl">
                <h3 className="text-red-600 dark:text-red-400 font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">warning</span>
                  Weaknesses
                </h3>
                <ul className="space-y-2">
                  {(Array.isArray(result.weaknesses) ? result.weaknesses : []).map((w, i) => (
                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="material-symbols-outlined text-red-500 text-[16px] mt-0.5 shrink-0">close</span> 
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Improvements */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-5 rounded-xl">
              <h3 className="text-slate-800 dark:text-white font-bold mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-amber-500">lightbulb</span>
                Suggested Improvements
              </h3>
              <ul className="space-y-3">
                {(Array.isArray(result.improvements) ? result.improvements : []).map((imp, i) => (
                  <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2 font-medium">
                    <span className="material-symbols-outlined text-amber-500 text-[16px] mt-0.5 shrink-0">arrow_right</span> 
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 min-h-[400px]">
            <span className="material-symbols-outlined text-6xl mb-4 text-slate-300 dark:text-slate-600">query_stats</span>
            <p className="font-medium text-lg">Waiting for input...</p>
            <p className="text-sm mt-2 text-center max-w-sm">Enter your project title and description to receive an AI-generated evaluation report.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};


// Pitch Deck Component
const PitchDeck = () => {
  const [formData, setFormData] = useState({ title: "", problem: "", solution: "", targetAudience: "", techStack: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${BASE_URL}/project-lab/pitch-deck`, formData, { withCredentials: true });
      if (res.data.success) {
        setResult(res.data.result);
      }
    } catch (err) {
      setResult(null);
      setError(err.response?.data?.message || "Failed to generate pitch deck.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="grid grid-cols-1 lg:grid-cols-12 gap-8"
    >
      {/* Input Form */}
      <div className="lg:col-span-4 bg-white dark:bg-[#161d2f] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
        <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-slate-900 dark:text-white">
          <span className="material-symbols-outlined text-violet-500">assignment</span>
          Project Inputs
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Title</label>
            <input type="text" name="title" required className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none text-sm" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Problem Statement</label>
            <textarea name="problem" required rows="3" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none text-sm resize-none" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Solution</label>
            <textarea name="solution" required rows="3" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none text-sm resize-none" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Target Audience</label>
            <input type="text" name="targetAudience" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none text-sm" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Tech Stack</label>
            <input type="text" name="techStack" className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 outline-none text-sm" onChange={handleChange} />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 dark:bg-red-500/10 p-2 rounded-lg border border-red-200 dark:border-red-500/20">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md shadow-violet-600/20 text-sm mt-2 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating...
              </span>
            ) : (
              <>Generate Deck <span className="material-symbols-outlined text-[18px]">magic_button</span></>
            )}
          </button>
        </form>
      </div>

      {/* Output Deck */}
      <div className="lg:col-span-8 bg-white dark:bg-[#161d2f] p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-y-auto" style={{ maxHeight: "calc(100vh - 220px)" }}>
        {result ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="text-center mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{formData.title || "Your Project"}</h2>
              <p className="text-lg text-violet-500 font-bold italic">"{result.elevatorPitch}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SectionCard icon="warning" title="The Problem" content={result.problemStatement} colorClass="text-red-500" />
              <SectionCard icon="lightbulb" title="Our Solution" content={result.solutionOverview} colorClass="text-emerald-500" />
              <SectionCard icon="group" title="Target Audience" content={result.targetAudience} colorClass="text-amber-500" />
              <SectionCard icon="trending_up" title="Market Opportunity" content={result.marketOpportunity} colorClass="text-[#0d4af2]" />
              <SectionCard icon="monetization_on" title="Business Model" content={result.businessModel} colorClass="text-violet-500" />
              <SectionCard icon="code" title="Technical Architecture" content={result.technicalArchitecture} colorClass="text-cyan-500" />
              <SectionCard icon="sports_score" title="Competitive Advantage" content={result.competitiveAdvantage} colorClass="text-orange-500" />
              <SectionCard icon="rocket_launch" title="Future Scope" content={result.futureScope} colorClass="text-teal-500" />
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 min-h-[400px]">
            <span className="material-symbols-outlined text-6xl mb-4 text-slate-300 dark:text-slate-600">slideshow</span>
            <p className="font-medium text-lg">Ready to pitch?</p>
            <p className="text-sm mt-2 text-center max-w-sm">Provide your project details to generate a structured pitch deck instantly.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectLabPage;
