import { db } from "../libs/db.js";
import { getJudge0LanguageId } from "../libs/judge0.lib.js";
import { pollBatchResults } from "../libs/judge0.lib.js";
import { submitBatch } from "../libs/judge0.lib.js";

export const createProblem =async (req,res)=>{
   const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      hints,
      editorial,
      testCases,
      codeSnippets,
    referenceSolution,
    } = req.body;

    if(req.user.role!=="ADMIN"){
        return res.status(403).json({error:"You are not allowed to create pproblem "})
    }

    try { 
        for(const [language,solutionCode] of Object.entries(referenceSolution)){
            const languageId=getJudge0LanguageId(language)
            if(!languageId){
                return res.status(400).json({error :`Langauge ${language} is not supported`})
            }

            // 
            const submissions=testCases.map(({input,output})=>({
                source_code:solutionCode,
                language_id:languageId,
                stdin:input,
                expected_output:output
            })
        )
      
        const submitResults=await submitBatch(submissions)

        const tokens=submitResults.map((res)=>res.token)
        
        const results=await pollBatchResults(tokens)
        for(let i=0 ;i<results.length;i++){
            const result=results[i];
            console.log("result--------------", result)
        
        if(result.status.id !==3){
            return res.status(400).json({error:`Testcases ${i+1} failed for the language ${language}`})
        }
    }

    // save the data in db
     const newProblem = await db.problem.create({
  data: {
    title,
    description,
    difficulty,
    tags,
    userId :req.user.id,
    examples,
    constraints,
    hints,
    editorial,
    testCases,
    codeSnippets,
    referenceSolution,
  },
});

return res.status(201).json(newProblem)

}
    } catch (error) {
         console.error("error in creating problem",error)
         return res.status(500).json({message:"Error in creating problem"})
    }

}

export const getAllProblems =async (req,res)=>{
    try {
         const problems=await db.problem.findMany()
         if(!problems || problems.length ===0){
            return res.status(404).json({
                success:false,
                error :"No problem found"
            })
         }
         return res.status(200).json({
            success :true,
            message:"problem fetched succcessfully",
            problems
         })

    } catch (error) {
        console.error("unexpected error :",error)
        return res.status(500).json({
            error :"Error fetching problemss",
        })
    }

}

export const getProblemById =async (req,res)=>{

    const {id}=req.params
    try {
        const problem=await db.problem.findUnique({
          where:{
                id
            }
        })
        if(!problem){
            return res.status(404).json({
                error :"problem not found"
            })
        }
         return res.status(200).json({
            success :true,
            message:"problem fetched succcessfully",
            problem
         })

        
    } catch (error) {
        console.error("unexpected error :",error)
        return res.status(500).json({
            error :"Error fetching problems by id",
        })
    }
}

export const deleteProblem = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await db.problem.findUnique({ where: { id } });

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: "Problem not found",
      });
    }

    await db.problem.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteProblem:", error);
    return res.status(500).json({
      success: false,
      error: "Error deleting the problem",
    });
  }
};


export const updateProblem =async (req,res)=>{
      const {id}=req.params
  const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      hints,
      editorial,
      testCases,
      codeSnippets,
    referenceSolution,
    } = req.body;

    if(req.user.role!=="ADMIN"){
        return res.status(403).json({error:"You are not allowed to create pproblem "})
    }

    try {
       const existingProblem = await db.problem.findUnique({
      where: { id },
    });

    if (!existingProblem) {
      return res.status(404).json({ error: "Problem not found" });
    }
    for (const [language, solutionCode] of Object.entries(referenceSolution)) {
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        return res.status(400).json({ error: `Language ${language} is not supported` });
      }

      const submissions = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submitResults = await submitBatch(submissions);
      const tokens = submitResults.map((res) => res.token);
      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return res
            .status(400)
            .json({ error: `Test case ${i + 1} failed for language ${language}` });
        }
      }
    }
    const updatedProblem = await db.problem.update({
      where: { id },
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        hints,
        editorial,
        testCases,
        codeSnippets,
        referenceSolution,
      },
    });
         return res.status(200).json(updatedProblem);
    } catch (error) {
       console.error("Error in updating problem:", error);
    return res.status(500).json({ message: "Error in updating problem" });
    }


}

export const getAllProblemSolvedByUser =async (req,res)=>{
 
    try {

      const problem =await db.problem.findMany({
        where:{
           solvedBy :{
            some:{
              userId:req.user.id
            }
           }
        },
        include:{
          solvedBy:{
            where:{
              userId:req.user.id
            }
          }
        }
      })
      res.status(200).json({
        message:"problem fetched successfully",
        success:true,
        problem
      })
       
    } catch (error) {
      console.error("Error in updating problem:", error);
    return res.status(500).json({ message: "Error in fetched problems" });
    }

}
