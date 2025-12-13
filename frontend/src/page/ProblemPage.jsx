import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import Confetti from "react-confetti";
import {
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
  ZoomIn,
  ZoomOut,
  RefreshCw,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useProblemStore } from "../store/useProblemStore.js";
import { useExecutionStore } from "../store/useExcuationStore.js";
import { useSubmissionStore } from "../store/useSubmissionStore.js";
import { getLanguageId } from "../lib/lang.js";

import SubmissionResults from "../components/Submission.jsx";
import SubmissionsList from "../components/SubmissionList.jsx";

const ProblemPage = () => {
  const { id } = useParams();

  // Stores
  const { getProblemById, problem, isProblemLoading } = useProblemStore();
  const { runCode, submitCode, submission } = useExecutionStore();
  const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  // States
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
const [selectedLanguage, setSelectedLanguage] = useState(
  "JAVASCRIPT"
);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [editorFontSize, setEditorFontSize] = useState(20);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Independent loading states for Run and Submit
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const languageLogos = {
    javascript: "/js.png",
    python: "/python.jpg",
    java: "/java.png",
  };

  // ---------------- TIMER ----------------
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => setTimeSpent((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const toggleTimer = () => setIsTimerRunning((prev) => !prev);
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // ---------------- ZOOM ----------------
  useEffect(() => {
    const handleZoom = (e) => {
      if (e.ctrlKey && e.key === "=") setEditorFontSize((f) => f + 2);
      else if (e.ctrlKey && e.key === "-") setEditorFontSize((f) => Math.max(10, f - 2));
      else if (e.ctrlKey && e.key === "0") setEditorFontSize(20);
    };
    window.addEventListener("keydown", handleZoom);
    return () => window.removeEventListener("keydown", handleZoom);
  }, []);

  // ---------------- CONFETTI ----------------
  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ---------------- LOAD PROBLEM ----------------
  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
  }, [id]);

  useEffect(() => {
    if (!problem) return;

    const langKey = selectedLanguage.toUpperCase();
    const defaultCode =
      problem.codeSnippets?.[langKey] ||
      problem.codeSnippets?.[langKey.toLowerCase()] ||
      problem.codeSnippets?.[langKey[0] + langKey.slice(1).toLowerCase()] ||
      "";
    setCode(defaultCode);

    setTestCases(
      problem.testCases?.map((tc) => ({ input: tc.input, output: tc.output })) || []
    );
  }, [problem, selectedLanguage]);

  // ---------------- LOAD SUBMISSIONS ----------------
  useEffect(() => {
    if (activeTab === "submissions" && id) getSubmissionForProblem(id);
  }, [activeTab, id]);

  // ---------------- HANDLERS ----------------
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem?.codeSnippets?.[lang] || "");
  };

  const handleRun = async () => {
    if (!problem) return;
    setIsRunning(true);
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testCases.map((t) => t.input);

      const res = await runCode(code, language_id, stdin);
      console.log("Run result:", res);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem) return;
    setIsSubmitting(true);
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testCases.map((t) => t.input);
      const expected_outputs = problem.testCases.map((t) => t.output);

      const res = await submitCode(code, language_id, stdin, expected_outputs, problem.id);
      if (res?.success) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
      console.log("Submission result:", res);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- TAB CONTENT ----------------
  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none">
            <p className="text-lg mb-6">{problem.description}</p>
            {problem.examples && (
              <>
                <h3 className="text-xl font-bold mb-4">Examples:</h3>
                {Object.entries(problem.examples).map(([lang, example]) => (
                  <div key={lang} className="bg-base-200 p-6 rounded-xl mb-6">
                    <div className="mb-4">
                      <div className="text-indigo-300 mb-2 font-semibold">Input:</div>
                      <span className="bg-black/90 px-4 py-1 rounded-lg text-white">{example.input}</span>
                    </div>
                    <div className="mb-4">
                      <div className="text-indigo-300 mb-2 font-semibold">Output:</div>
                      <span className="bg-black/90 px-4 py-1 rounded-lg text-white">{example.output}</span>
                    </div>
                    {example.explanation && (
                      <>
                        <div className="text-emerald-300 mb-2 font-semibold">Explanation:</div>
                        <p className="text-base-content/70">{example.explanation}</p>
                      </>
                    )}
                  </div>
                ))}
              </>
            )}

            {problem.constraints && (
              <>
                <h3 className="text-xl font-bold mb-4">Constraints:</h3>
                <div className="bg-base-200 p-6 rounded-xl">
                  <span className="bg-black/90 px-4 py-1 rounded-lg text-white">{problem.constraints}</span>
                </div>
              </>
            )}
          </div>
        );

      case "submissions":
        return <SubmissionsList submissions={submissions} isLoading={isSubmissionsLoading} />;

      case "discussion":
        return <div className="p-4 text-center text-base-content/70">No discussions yet</div>;

      case "hints":
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="bg-base-200 p-6 rounded-xl">
                <span className="bg-black/90 px-4 py-1 rounded-lg text-white">{problem.hints}</span>
              </div>
            ) : (
              <div className="text-center text-base-content/70">No hints available</div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (isProblemLoading || !problem)
    return <div className="flex items-center justify-center h-screen text-lg">Loading Problem...</div>;

  // Spinner component
  const Spinner = () => (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200 max-w-7xl mx-auto w-full">
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={300} gravity={0.2} />}

      {/* NAVBAR */}
      <nav className="navbar bg-base-100 shadow-lg px-4">
        <div className="flex-1 gap-2">
          <Link to="/home" className="flex items-center gap-2 text-primary">
            <Home className="w-6 h-6" />
            <ChevronRight className="w-4 h-4" />
          </Link>

          <div>
            <h1 className="text-xl font-bold">{problem.title}</h1>

            <div className="flex items-center gap-2 text-sm text-base-content/70 mt-3">
              <Clock className="w-4 h-4" />
              <span>
                Updated {new Date(problem.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
              <span className="text-base-content/30">•</span>
              <Users className="w-4 h-4" />
              <span>{submissionCount} Submissions</span>
              <span className="text-base-content/30">•</span>
              <ThumbsUp className="w-4 h-4" />
              <span>95% Success Rate</span>
            </div>
          </div>
        </div>

        {/* Timer + Language + Buttons */}
        <div className="flex-none flex items-center gap-4">
          <button className="btn btn-ghost btn-circle" onClick={toggleTimer}>
            <Clock className={`w-5 h-5 ${isTimerRunning ? "text-primary" : ""}`} />
          </button>
          <div className="flex items-center gap-2 bg-primary text-white px-3 py-1 rounded-lg">
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeSpent)}</span>
          </div>
          <button className={`btn btn-ghost btn-circle ${isBookmarked ? "text-primary" : ""}`} onClick={() => setIsBookmarked(!isBookmarked)}>
            <Bookmark className="w-5 h-5" />
          </button>
          <button className="btn btn-ghost btn-circle">
            <Share2 className="w-5 h-5" />
          </button>

          {/* LANGUAGE SELECT */}
          <div className="relative">


<select
  className="select select-bordered select-primary w-44 pr-10"
  value={selectedLanguage.toUpperCase()} // match the keys in codeSnippets
  onChange={(e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang); // store exact key
    setCode(problem.codeSnippets[lang] || "");
  }}
  style={{
    backgroundImage: `url(${languageLogos[selectedLanguage.toLowerCase()]})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "8px center",
    backgroundSize: "22px",
    paddingLeft: "40px",
  }}
>
  {Object.keys(problem.codeSnippets || {}).map((lang) => (
    <option key={lang} value={lang}>
      {lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase()}
    </option>
  ))}
</select>


           
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT SIDE */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            <div className="tabs tabs-bordered">
              {["description", "submissions", "discussion", "hints"].map((tab) => (
                <button
                  key={tab}
                  className={`tab gap-2 ${activeTab === tab ? "tab-active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {{
                    description: <FileText className="w-4 h-4" />,
                    submissions: <Code2 className="w-4 h-4" />,
                    discussion: <MessageSquare className="w-4 h-4" />,
                    hints: <Lightbulb className="w-4 h-4" />,
                  }[tab]}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="p-6">{renderTabContent()}</div>
          </div>
        </div>

        {/* RIGHT SIDE (EDITOR) */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-0">
            <div className="tabs tabs-bordered">
              <button className="tab tab-active gap-2">
                <Terminal className="w-4 h-4" />
                Code Editor
              </button>
            </div>

            {/* ZOOM BUTTONS */}
            <div className="p-3 flex justify-end gap-2 border-b bg-base-200">
              <button className="btn btn-sm btn-outline" onClick={() => setEditorFontSize((s) => s + 2)}>
                <ZoomIn className="w-4 h-4" />
              </button>
              <button className="btn btn-sm btn-outline" onClick={() => setEditorFontSize((s) => Math.max(10, s - 2))}>
                <ZoomOut className="w-4 h-4" />
              </button>
              <button className="btn btn-sm btn-outline" onClick={() => setEditorFontSize(20)}>
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="h-[600px] w-full">
              <Editor
                height="100%"
                language={selectedLanguage.toLowerCase()}
                theme="vs-dark"
                value={code}
                onChange={(v) => setCode(v || "")}
                options={{ minimap: { enabled: false }, fontSize: editorFontSize, lineNumbers: "on", automaticLayout: true }}
              />
            </div>

            {/* RUN + SUBMIT BUTTONS */}
            <div className="p-4 border-t border-base-300 bg-base-200 flex justify-between">
              <button
                onClick={handleRun}
                disabled={isRunning}
                className="px-4 py-2 bg-blue-500 text-white rounded flex items-center justify-center gap-2"
              >
                {isRunning && <Spinner />}
                {isRunning ? "Running..." : "Run"}
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded flex items-center justify-center gap-2"
              >
                {isSubmitting && <Spinner />}
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SUBMISSION OUTPUT */}
      <div className="card bg-base-100 shadow-xl mt-6">
        <div className="card-body">
          {submission ? (
            <SubmissionResults submission={submission} />
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Test Cases</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Input</th>
                      <th>Expected Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testCases.map((tc, idx) => (
                      <tr key={idx}>
                        <td className="font-mono">{tc.input}</td>
                        <td className="font-mono">{tc.output}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
