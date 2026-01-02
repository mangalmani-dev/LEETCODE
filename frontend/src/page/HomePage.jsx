import React, { useEffect } from "react";
import { useProblemStore } from "../store/useProblemStore.js";
import { Loader } from "lucide-react";
import ProblemTable from "../components/ProblemTable.jsx";



const HomePage = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();
  

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-slate-950">
        <Loader className="size-10 animate-spin text-slate-700 dark:text-slate-300" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center mt-14 px-4 bg-white dark:bg-slate-950 transition-colors duration-300">
      
      {/* 🌫 Background Accent */}
      <div className="pointer-events-none absolute top-20 left-0 w-1/3 h-1/3 bg-indigo-300/30 dark:bg-indigo-700/20 blur-3xl rounded-md"></div>

      {/* 🧠 Heading */}
      <h1 className="text-4xl font-extrabold z-10 text-center text-slate-900 dark:text-slate-100">
        Welcome to <span className="text-indigo-600 dark:text-indigo-400">Codemani</span>
      </h1>

      {/* 📄 Subtitle */}
      <p className="mt-4 max-w-3xl text-center text-lg font-medium text-slate-600 dark:text-slate-400 z-10">
        A platform inspired by LeetCode that helps you prepare for coding
        interviews and improve your problem-solving skills by practicing real
        coding challenges.
      </p>

  


      {/* 📊 Problems Table / Empty State */}
      <div className="w-full mt-10 z-10">
        {problems.length > 0 ? (
          <ProblemTable problems={problems} />
        ) : (
          <p className="text-center text-lg font-semibold text-slate-600 dark:text-slate-400 border border-dashed border-slate-300 dark:border-slate-700 px-6 py-3 rounded-xl">
            No problems found
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
