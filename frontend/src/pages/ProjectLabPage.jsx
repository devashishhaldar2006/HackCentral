import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../lib/constants";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
};

const ProjectLabPage = () => {
  const [activeTab, setActiveTab] = useState("evaluator");
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center flex flex-col items-center">
          <div className="yellow-badge mb-3">AI PROJECT WORKSPACE</div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 text-slate-900 tracking-tight">
            Project <span className="text-yellow-500">Lab</span>
          </h1>
          <p className="text-slate-600 text-base max-w-2xl">
            Machine intelligence to evaluate your hackathon concepts and generate pitch decks before submitting.
          </p>
        </header>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1.5 rounded-2xl flex space-x-2 border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab("evaluator")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeTab === "evaluator" 
                  ? "bg-yellow-400 text-slate-950 shadow-sm" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">analytics</span>
              <span>AI Evaluator</span>
            </button>
            <button
              onClick={() => setActiveTab("pitchDeck")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeTab === "pitchDeck" 
                  ? "bg-yellow-400 text-slate-950 shadow-sm" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
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

// Sub-components
const ScoreBar = ({ label, score }) => (
  <div className="mb-4">
    <div className="flex justify-between text-xs font-bold mb-1.5 text-slate-700">
      <span>{label}</span>
      <span className="text-yellow-600">{score}/10</span>
    </div>
    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${score * 10}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full rounded-full bg-yellow-400" 
      />
    </div>
  </div>
);

const SectionCard = ({ icon, title, content }) => (
  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 hover:border-yellow-300 transition-all shadow-sm">
    <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-yellow-800">
      <span className="material-symbols-outlined text-[18px] text-yellow-600">{icon}</span> 
      {title}
    </h3>
    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{content}</p>
  </div>
);

// Evaluator Component
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
      <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm h-fit">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900">
          <span className="material-symbols-outlined text-yellow-500">edit_document</span>
          Project Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Project Title</label>
            <input
              type="text"
              name="title"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:border-yellow-400 focus:bg-white transition-all outline-none"
              placeholder="e.g. HackCentral"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Description</label>
            <textarea
              name="description"
              required
              rows="5"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:border-yellow-400 focus:bg-white transition-all outline-none resize-none"
              placeholder="Detail your problem statement, solution, and novelty..."
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Tech Stack (Optional)</label>
            <input
              type="text"
              name="techStack"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 text-sm focus:border-yellow-400 focus:bg-white transition-all outline-none"
              placeholder="e.g. React, Node.js, MongoDB"
              onChange={handleChange}
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 p-3 rounded-xl border border-red-200">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                Analyzing idea...
              </span>
            ) : (
              <>Evaluate Idea <span className="material-symbols-outlined text-[16px]">arrow_forward</span></>
            )}
          </button>
        </form>
      </div>

      {/* Output View */}
      <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm overflow-y-auto" style={{ maxHeight: "calc(100vh - 220px)" }}>
        {result ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-6 text-slate-900 border-b border-slate-100 pb-4">
              Evaluation Results
            </h2>
            
            {/* Scores Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div>
                <ScoreBar label="Innovation" score={Number(result.innovationScore) || 0} />
                <ScoreBar label="Technical Complexity" score={Number(result.technicalComplexity) || 0} />
              </div>
              <div>
                <ScoreBar label="Market Potential" score={Number(result.marketPotential) || 0} />
                <ScoreBar label="Presentation Readiness" score={Number(result.presentationReadiness) || 0} />
              </div>
            </div>

            {/* Overall Feedback */}
            <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-2xl mb-8">
              <h3 className="text-yellow-900 font-bold text-sm mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-yellow-600">insights</span>
                Overall Feedback
              </h3>
              <p className="text-slate-800 leading-relaxed text-xs sm:text-sm">{result.overallFeedback}</p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-emerald-50/60 border border-emerald-200 p-5 rounded-2xl">
                <h3 className="text-emerald-800 font-bold text-xs mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {(Array.isArray(result.strengths) ? result.strengths : []).map((s, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-[14px] mt-0.5 shrink-0">check</span> 
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50/60 border border-red-200 p-5 rounded-2xl">
                <h3 className="text-red-800 font-bold text-xs mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-red-600">warning</span>
                  Weaknesses
                </h3>
                <ul className="space-y-2">
                  {(Array.isArray(result.weaknesses) ? result.weaknesses : []).map((w, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="material-symbols-outlined text-red-500 text-[14px] mt-0.5 shrink-0">close</span> 
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Improvements */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl">
              <h3 className="text-slate-800 font-bold text-xs mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-yellow-600">lightbulb</span>
                Suggested Improvements
              </h3>
              <ul className="space-y-2">
                {(Array.isArray(result.improvements) ? result.improvements : []).map((imp, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="material-symbols-outlined text-yellow-600 text-[14px] mt-0.5 shrink-0">arrow_right</span> 
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[360px]">
            <span className="material-symbols-outlined text-5xl mb-3 text-slate-300">query_stats</span>
            <p className="font-bold text-base text-slate-700">Waiting for project input</p>
            <p className="text-xs mt-1 text-center max-w-sm text-slate-500">Provide your project title and details on the left to get a comprehensive report.</p>
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
      <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-fit">
        <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-slate-900">
          <span className="material-symbols-outlined text-yellow-500">assignment</span>
          Project Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Title</label>
            <input type="text" name="title" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none text-xs focus:border-yellow-400" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Problem Statement</label>
            <textarea name="problem" required rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none text-xs resize-none focus:border-yellow-400" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Solution</label>
            <textarea name="solution" required rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none text-xs resize-none focus:border-yellow-400" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Target Audience</label>
            <input type="text" name="targetAudience" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none text-xs focus:border-yellow-400" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Tech Stack</label>
            <input type="text" name="techStack" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 outline-none text-xs focus:border-yellow-400" onChange={handleChange} />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 p-2.5 rounded-xl border border-red-200">
              <span className="material-symbols-outlined text-[16px]">error</span>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold uppercase text-xs tracking-wider py-3 px-4 rounded-xl transition-all shadow-sm mt-2 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                Generating deck...
              </span>
            ) : (
              <>Generate Deck <span className="material-symbols-outlined text-[16px]">auto_fix_high</span></>
            )}
          </button>
        </form>
      </div>

      {/* Output Deck */}
      <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm overflow-y-auto" style={{ maxHeight: "calc(100vh - 220px)" }}>
        {result ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="text-center mb-6 pb-6 border-b border-slate-100">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{formData.title || "Your Project"}</h2>
              <p className="text-base text-yellow-700 font-semibold italic">"{result.elevatorPitch}"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SectionCard icon="warning" title="The Problem" content={result.problemStatement} />
              <SectionCard icon="lightbulb" title="Our Solution" content={result.solutionOverview} />
              <SectionCard icon="group" title="Target Audience" content={result.targetAudience} />
              <SectionCard icon="trending_up" title="Market Opportunity" content={result.marketOpportunity} />
              <SectionCard icon="monetization_on" title="Business Model" content={result.businessModel} />
              <SectionCard icon="code" title="Technical Architecture" content={result.technicalArchitecture} />
              <SectionCard icon="sports_score" title="Competitive Advantage" content={result.competitiveAdvantage} />
              <SectionCard icon="rocket_launch" title="Future Scope" content={result.futureScope} />
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 min-h-[360px]">
            <span className="material-symbols-outlined text-5xl mb-3 text-slate-300">slideshow</span>
            <p className="font-bold text-base text-slate-700">Ready to pitch?</p>
            <p className="text-xs mt-1 text-center max-w-sm text-slate-500">Provide your inputs to generate a structured pitch deck instantly.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectLabPage;
