import { useState } from "react";
import axiosInstance from "../api/axiosInstance";//use our secure axios
import { useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext";


function PostJob(){
    const [title,setTitle]=useState("");
    const[company,setCompany]=useState("");
    const[location,setLocation]=useState("");
    const[salary,setSalary]=useState("");

    const[isSubmitting,setIsSubmitting]=useState(false);
    const navigate=useNavigate();

    const{user}=useAuth();//get logged-in-user
    if(user.role !=="admin"  && user.role!=="recruiter"){
      return(
        <h2 className="text-center text-white mt-20">
          Access Denied-only Amdmine and Recruiter can post jobs
        </h2>
      )
    }
    

    const handleSubmit=async(e)=>{
        e.preventDefault();


        //prevent duplicates -if already submitting, stop here
       if(isSubmitting)return;

       //lock the buttons
       setIsSubmitting(true);


        //1 prepare the data object
        const jobData={title,company,location,salary};
        try{
      // 2 send post request to our new protected backend route
      //axiosInstance automatically attaches the admin token to it
      await axiosInstance.post("/jobs",jobData);

      alert("Job Posted successfully");
      navigate("/jobs");//go back to jobs list to see it

        }catch(err){
            console.error("Failed to post job",err);
            alert("Error:" + (err.response?.data?.message || "Could not post job"));
        
        //only unlock the button if there was an error -so they can try again
        setIsSubmitting(false);
          }

          //we dont see set isSubmitting(false on sucess becuse we are navigating away)
    };

    
//     return(
//     <div style={{padding:"20px"}}>
//     <h2>Admin Pannel: Post a New Job</h2>
//     <form onSubmit={handleSubmit}>
//         <input
//         type="text"
//         placeholder="Job Tile"
//         value={title}
//         required
//         onChange={(e)=>settile(e.target.value)}

//         />
//         <br/>
//         <input 
//         type="text"
//         placeholder="Company"
//         value={company}
//         required
//         onChange={(e)=>setCompany(e.target.value)}
        
//         />
//         <br/>

//         <input
//         type="text"
//         placeholder="Location"
//         value={location}
//         required
//         onChange={(e)=>setLocation(e.target.value)}
//         />
//         <br/>

//         <input
//         type="text"
//         placeholder="Salary"
//         value={salary}
//         required
//         onChange={(e)=>setSalary(e.target.value)}

//         />
//         <br/>
//      <button  type="submit" style={{marginTop:"10px", color:"blue"}}>
//         Post Job
//      </button>
//     </form>


//     </div>
//     );
// }

// export default AdminPostJob;

// --- 5. THE UI (This is where all the changes are) ---
  return (
    // --- Page Container (REUSED from Login/Register) ---
    // 'min-h-screen': Full height
    // 'flex items-center justify-center': Flexbox centering
    <div className="min-h-screen flex items-center justify-center">

      {/* --- Glassmorphism Card (REUSED from Login/Register) --- */}
      {/* 'w-full max-w-md': Responsive width */}
      {/* 'p-8 rounded-lg shadow-xl': Card padding and style */}
      {/* 'bg-slate-800/70 backdrop-blur-lg border border-slate-700': The glass effect */}
      <div className="w-full max-w-md p-8 rounded-lg shadow-xl bg-slate-800/70 backdrop-blur-lg border border-slate-700">
        
        {/* Title: 'text-3xl', 'font-bold', 'text-center', 'mb-6' */}
        <h2 className="text-3xl font-bold text-center text-white mb-6">
           Post New Job
        </h2>
        
        {/* Form */}
        <form onSubmit={handleSubmit}>
          
          {/* Job Title Field */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Job Title</label>
            <input
              type="text"
              placeholder="e.g., React Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              // --- Input Styling (REUSED from Login/Register) ---
              className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Company Field */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Company</label>
            <input
              type="text"
              placeholder="e.g., Google"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              // --- Input Styling (REUSED from Login/Register) ---
              className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Location Field */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Location</label>
            <input
              type="text"
              placeholder="e.g., Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              // --- Input Styling (REUSED from Login/Register) ---
              className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Salary Field */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Salary</label>
            <input
              type="text"
              placeholder="e.g., 10 LPA"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
              // --- Input Styling (REUSED from Login/Register) ---
              className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div>
            {/* --- Gradient Button Styling (REUSED from Login/Register) --- */}
            {/* 'w-full', 'py-3', 'font-bold', 'text-white', 'rounded-md', etc. */}
            <button
              type="submit"
              className="w-full py-3 font-bold text-white rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostJob;