import { getLanguageName, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";
import { db } from "../libs/db.js";

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(stdin) || stdin.length === 0 || !Array.isArray(expected_outputs) || expected_outputs.length === 0) {
      return res.status(400).json({ error: "Invalid or missing test-cases" });
    }

    const submissions = stdin.map((input) => ({ source_code, language_id, stdin: input }));
    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((r) => r.token);
    const results = await pollBatchResults(tokens);

    let allPassed = true;
    const detailResults = results.map((result, i) => {
      const stdout = result.stdout?.trim() || "";
      const expected_output = expected_outputs[i]?.trim() || "";
      const passed = stdout === expected_output;
      if (!passed) allPassed = false;

      return {
        testCase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || "",
        compileOutput: result.compile_output || "",
        status: result.status?.description || "Unknown",
        memory: result.memory ? `${result.memory} kb` : "",
        time: result.time ? `${result.time} S` : "",
      };
    });

    const submission = await db.submission.create({
      data: {
        user: { connect: { id: userId } },
        problem: { connect: { id: problemId } },
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: JSON.stringify(stdin),
        stdout: JSON.stringify(detailResults.map((r) => r.stdout)),
        stderr: JSON.stringify(detailResults.map((r) => r.stderr)),
        compileOutput: JSON.stringify(detailResults.map((r) => r.compileOutput)),
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: JSON.stringify(detailResults.map((r) => r.memory)),
        time: JSON.stringify(detailResults.map((r) => r.time)),
      },
    });

    if (allPassed) {
      await db.problemSolved.upsert({
        where: { userId_problemId: { userId, problemId } },
        update: {},
        create: {
          user: { connect: { id: userId } },
          problem: { connect: { id: problemId } },
        },
      });
    }

    const testCaseResults = detailResults.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compileOutput,
      status: result.status,
      time: result.time,
      memory: result.memory,
    }));

    await db.testCaseResult.createMany({ data: testCaseResults });

    const submissionWithTestCase = await db.submission.findUnique({
      where: { id: submission.id },
      include: { testCases: true },
    });

    return res.status(200).json({
      success: true,
      message: "Code submitted successfully",
      submission: submissionWithTestCase,
    });
  } catch (error) {
    console.error("Error in the submission:", error);
    res.status(500).json({ error: "Failed to execute code" });
  }
};

export const runCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin } = req.body;
    const submissions = stdin.map((input) => ({ source_code, language_id, stdin: input }));
    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((r) => r.token);
    const results = await pollBatchResults(tokens);

    return res.status(200).json({
      success: true,
      message: "Code executed successfully",
      results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to run code" });
  }
};
