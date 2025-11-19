//1 import reacts hook usestate will remember our data
import{useState}from "react";
//2 import our custom axiosInstance which already knows our backend url and how to send  our jwt token
import axiosInstance from "../api/axiosInstance";

//3 this is our react component -our page
function AIBot(){
    //---sate--
    //4 create a state veriable to remember what the user types in the input box.
    const [jobTitle,setJobTitle]=useState("");
    //5 create a stat to remember if we are currently -thinking-waiting for the AI
    const[isLoading,setIsLoading]=useState(false);
    //6 create a state to hold the AI's answer when it comes back
    const[aiResponse,setAiResponse]=useState("");
    //7 create a state to hold any error messages.
    const [error,setError]=useState("");

     
    //----functions--
    //8 this async function will runs the user clicks the -"generate" button
    const handleGenerate=async(e)=>{
        //9 e.preventDefault()-stops the browser from doing a full page reload on submit
        e.preventDefault();

        //10 state the "loading" state
     setIsLoading(true);

     //11 clear any old AI responses
     setAiResponse("");
     //12 clear any old errors
     setError("");

     //13 this is our safety net for all API calls
     try{
        //14 send the jobtitle to our backend api rout
        //we use await to pause her until the backend(any the AI)responds
        const res=await axiosInstance.post("/ai/generate-questions",{
      jobTitle,//this sends:{"jobTitle":"React Developer"}
         });

         //15 if the try block succeeds then get the questions from the response
         const questions=res.data.questions;
         //16 store the AI's text in our aiResponse state which makes it  appear on the screen
         setAiResponse(questions);

     }catch(err){
        //17 if try fails then ai server is down- this  catch block runs
        console.error("AI generation failed:",err);//log the full error for me to understand
        //18 set a smple human-friendly error message for the user
        setError(err.response?.data?.message || "Error generating questions");
      
     }finally{
        //19 this finally block runs no matter what -success or failure
        //20 we set isLoading back to false to stop the spinner and re-enable the button
        setIsLoading(false);
     }
    };
    

    //------UI the html part---
    //21 this is the html that the user sees
//     return(
//         <div style={{padding:"20px"}}>
//             <h2>AI Interview Question Generator</h2>
//             <p>Enter a job title...e.g "React Developer" to get practice questions</p>

//             {/*
//             22 the form when submitted it runs our handleGenearte function
//             */}
//             <form onSubmit={handleGenerate}>
//         <input 
//         type="text"
//         value={jobTitle} //the value of the input is tied to our jobtitle state
//         onChange={(e)=>setJobTitle(e.target.value)}//when the user types or update the 'jobtitle' state
//        placeholder="Enter Job Title"
//        style={{width:"300px",padding:"8px"}}
//        required //html5 validation wont submit if empty
//        />
//        {/*23 the button is disabled if isLoading is true */}
//        <button type="submit" disabled={isLoading} style={{marginLeft:"10px"}}>
//         {/*24 show different text based on the isLoading state */}
//         {isLoading?"Generating...":"Generate Questions"}
//        </button>

//        </form>
//        {error && (
//   <p style={{ color: "red", marginTop: "10px" }}>
//     {error}
//   </p>
// )}


//        {/* 25 if the 'error state has text ,display it in red */}

//         {aiResponse &&(
//             <div style={{marginTop:"20px", background:"#f4f4f4",padding:"15px", whiteSpace:"pre-wrap"}}>
//                 <h3>Here are your custom questions:</h3>
//                 <p>{aiResponse}</p>
//             </div>
//         ) }
//               </div>
//     );
// }

// //27 export the component to app.jsx can use it
// export default AIBot;

// --- 5. THE UI (This is where all the changes are) ---
  return (
    // --- Page Container ---
    // 'p-8': "padding: 2rem;" (Give the page some space)
    // 'max-w-4xl': "max-width: 56rem;" (A good width for a content page)
    // 'mx-auto': "margin-left: auto; margin-right: auto;" (Center the content)
    <div className="p-8 max-w-4xl mx-auto">

      {/* --- Glassmorphism Card (REUSED from Login/Profile) --- */}
      {/* We'll put the *entire* feature inside our main glass card */}
      {/* 'p-8', 'rounded-lg', 'shadow-lg', 'bg-slate-800/70', 'backdrop-blur-lg', 'border', 'border-slate-700' */}
      <div className="p-8 rounded-lg shadow-lg bg-slate-800/70 backdrop-blur-lg border border-slate-700">
        
        {/* Page Title & Description */}
        {/* 'text-3xl': "font-size: 1.875rem;" */}
        {/* 'font-bold': "font-weight: 700;" */}
        {/* 'text-white': "color: white;" */}
        <h2 className="text-3xl font-bold text-white">Axon Interview Bot</h2>
        {/* 'mt-2': "margin-top: 0.5rem;" */}
        {/* 'text-lg': "font-size: 1.125rem;" */}
        {/* 'text-gray-300': Soft, light gray text */}
        {/* 'mb-6': "margin-bottom: 1.5rem;" (Space below the text) */}
        <p className="mt-2 text-lg text-gray-300 mb-6">
          Enter a job title (e.g., "React Developer") and our AI will generate
          custom practice questions for you.
        </p>

        {/* The Form */}
        <form onSubmit={handleGenerate}>
          {/* We use 'flex' to put the input and button side-by-side */}
          {/* 'gap-4': "gap: 1rem;" (Space between the input and button) */}
          <div className="flex gap-4">
            
            {/* Input Field */}
            {/* 'flex-grow': This tells the input to "grow" and take up all available space */}
            {/* 'p-3', 'rounded-md', 'bg-slate-700', etc... (REUSED from Login.jsx) */}
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Python Developer"
              required
              className="w-full flex-grow p-3 rounded-md bg-slate-700 border border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Submit Button */}
            {/* --- Gradient Button Styling (REUSED from Login.jsx) --- */}
            {/* 'py-3 px-6': A nice, wide button */}
            {/* 'font-bold', 'text-white', 'rounded-md', 'bg-gradient-to-r', 'from-indigo-500', etc. */}
            {/* 'disabled:from-gray-500...': Grayed-out style when loading */}
            <button
              type="submit"
              disabled={isLoading}
              className="py-3 px-6 font-bold text-white rounded-md 
                         bg-gradient-to-r from-indigo-500 to-purple-500 
                         hover:from-indigo-600 hover:to-purple-600 
                         transition-all duration-300
                         disabled:from-gray-500 disabled:to-gray-600 disabled:opacity-70"
            >
              {isLoading ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {/* 'text-red-400': Soft red color for dark mode */}
        {/* 'mt-4': "margin-top: 1rem;" */}
        {error && <p className="text-red-400 mt-4">{error}</p>}

        {/* AI Response Area */}
        {/* 'mt-8': "margin-top: 2rem;" (Give it plenty of space) */}
        {aiResponse && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-white mb-4">Here are your custom questions:</h3>
            {/* This is the container for the AI's text */}
            {/* 'p-6': "padding: 1.5rem;" */}
            {/* 'bg-slate-900': Make it *even darker* than the card for contrast */}
            {/* 'rounded-lg': Rounded corners */}
            {/* 'border border-slate-700': Faint border */}
            {/* 'whitespace-pre-wrap': This is CRITICAL. It respects the line breaks (\n) from the AI. */}
            <div className="p-6 bg-slate-900 rounded-lg border border-slate-700 whitespace-pre-wrap">
              <p className="text-lg text-gray-200">{aiResponse}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIBot;