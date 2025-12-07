import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
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
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore.js";
import { useExecutionStore } from "../store/useExcuationStore.js";
import {useSubmissionStore} from "../store/useSubmissionStore.js"
import { getLanguageId } from "../lib/lang.js";
import Submission from "../components/Submission.jsx"
import SubmissionsList from "../components/SubmissionList.jsx"


import SubmissionResults from "../components/Submission.jsx";

const ProblemPage = () => {
  const { id } = useParams();

    const {
    submission: submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  const { getProblemById, problem, isProblemLoading } = useProblemStore();
  const { executeCode, submission, isExecuting } = useExecutionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testCases, setTestCases] = useState([]);

  // const submissionCount = 10;

  // Load problem on mount
  useEffect(() => {
    getProblemById(id)
    getSubmissionCountForProblem(id);
  }, [id]);

  // Set initial code + testcases
  useEffect(() => {
    if (problem) {
      setCode(problem.codeSnippets?.[selectedLanguage] || "");

      setTestCases(
        problem.testCases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );
    }
  }, [problem, selectedLanguage]);

   useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id]);

  console.log("submission", submissions);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem?.codeSnippets?.[lang] || "");
  };

  const handleRunCode = (e) => {
    e.preventDefault();

    if (!problem) return;

    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testCases.map((tc) => tc.input);
      const expected = problem.testCases.map((tc) => tc.output);

      executeCode(code, language_id, stdin, expected, id);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  if (isProblemLoading || !problem)
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        Loading Problem...
      </div>
    );

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
                      <div className="text-indigo-300 mb-2 font-semibold">
                        Input:
                      </div>
                      <span className="bg-black/90 px-4 py-1 rounded-lg text-white">
                        {example.input}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="text-indigo-300 mb-2 font-semibold">
                        Output:
                      </div>
                      <span className="bg-black/90 px-4 py-1 rounded-lg text-white">
                        {example.output}
                      </span>
                    </div>

                    {example.explanation && (
                      <>
                        <div className="text-emerald-300 mb-2 font-semibold">
                          Explanation:
                        </div>
                        <p className="text-base-content/70">
                          {example.explanation}
                        </p>
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
                  <span className="bg-black/90 px-4 py-1 rounded-lg text-white">
                    {problem.constraints}
                  </span>
                </div>
              </>
            )}
          </div>
        );

      case "submissions":
        return  <SubmissionsList
            submissions={submissions}
            isLoading={isSubmissionsLoading}
          />

      case "discussion":
        return (
          <div className="p-4 text-center text-base-content/70">
            No discussions yet
          </div>
        );

      case "hints":
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="bg-base-200 p-6 rounded-xl">
                <span className="bg-black/90 px-4 py-1 rounded-lg text-white">
                  {problem.hints}
                </span>
              </div>
            ) : (
              <div className="text-center text-base-content/70">
                No hints available
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200 max-w-7xl mx-auto w-full">

      {/* NAVBAR */}
      <nav className="navbar bg-base-100 shadow-lg px-4">
        <div className="flex-1 gap-2">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <Home className="w-6 h-6" />
            <ChevronRight className="w-4 h-4" />
          </Link>

          <div>
            <h1 className="text-xl font-bold">{problem.title}</h1>

            <div className="flex items-center gap-2 text-sm text-base-content/70 mt-3">
              <Clock className="w-4 h-4" />
              <span>
                Updated{" "}
                {new Date(problem.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
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

        <div className="flex-none gap-4">
          <button
            className={`btn btn-ghost btn-circle ${
              isBookmarked ? "text-primary" : ""
            }`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark className="w-5 h-5" />
          </button>

          <button className="btn btn-ghost btn-circle">
            <Share2 className="w-5 h-5" />
          </button>

          <select
            className="select select-bordered select-primary w-40"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {Object.keys(problem.codeSnippets || {}).map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT SIDE (DESCRIPTION TABS) */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-0">

              <div className="tabs tabs-bordered">
                <button
                  className={`tab gap-2 ${activeTab === "description" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("description")}
                >
                  <FileText className="w-4 h-4" />
                  Description
                </button>

                <button
                  className={`tab gap-2 ${activeTab === "submissions" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("submissions")}
                >
                  <Code2 className="w-4 h-4" />
                  Submissions
                </button>

                <button
                  className={`tab gap-2 ${activeTab === "discussion" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("discussion")}
                >
                  <MessageSquare className="w-4 h-4" />
                  Discussion
                </button>

                <button
                  className={`tab gap-2 ${activeTab === "hints" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("hints")}
                >
                  <Lightbulb className="w-4 h-4" />
                  Hints
                </button>
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

              <div className="h-[600px] w-full">
                <Editor
                  height="100%"
                  language={selectedLanguage.toLowerCase()}
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 20,
                    lineNumbers: "on",
                    automaticLayout: true,
                  }}
                />
              </div>

              <div className="p-4 border-t border-base-300 bg-base-200">
                <div className="flex justify-between items-center">
                  <button
                    className={`btn btn-primary gap-2 ${isExecuting ? "loading" : ""}`}
                    disabled={isExecuting}
                    onClick={handleRunCode}
                  >
                    {!isExecuting && <Play className="w-4 h-4" />}
                    Run Code
                  </button>

                  <button className="btn btn-success gap-2">
                    Submit Solution
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TESTCASE OUTPUT */}
        <div className="card bg-base-100 shadow-xl mt-6">
          <div className="card-body">
            {submission ? (
             <SubmissionResults submission={submission}/>
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
    </div>
  );
};

export default ProblemPage;
