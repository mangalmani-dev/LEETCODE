import { pollBatchResults, submitBatch } from "../libs/judge0.lib.js"


export const executeCode=async(req,res)=>{
 
    try {
         const {source_code,language_id,stdin,expected_outputs,problemId}=req.body
         const userId=req.user.id

         // validate test cases
         if(
            !Array.isArray(stdin)||
            stdin.length ===0 ||
            !Array.isArray(expected_outputs)||
            expected_outputs.length ===0 
         ){
            return res.status(400).json({error :"Invalid or missing test-cases"})
         }
         2.// prepare submission for each test cases

         const submission=stdin.map((input)=>({
            source_code,
            language_id,
            stdin:input,
         }))
         // 3.submit send this batch to judge0

         const submitResponse=await submitBatch(submission)

         const tokens= submitResponse.map((res)=>res.token)

         // polling the result for test cases

         const results=await pollBatchResults(tokens)

         console.log("Result -------",results)
         return res.status(200).json({
            message:"Code excuted successfully"
         })
  


    } catch (error) {
        
    }
}