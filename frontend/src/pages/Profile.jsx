// src/pages/Profile.jsx

import { useState, useEffect } from "react";
// 1. Import the useAuth hook to get the logged-in user
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance"; //import axios to send the file

function Profile() {
  // 2. Get the user from our global context
  const { user,login } = useAuth();//get kogin and user to update the user contect after upload
  
  // 3. Create *local* state just for this page
  const [appliedJobs, setAppliedJobs] = useState([]);

  //new sate for the file upload
  const[resumeFile,setResumeFile]=useState(null);
  const[uploadStatus, setUploadStaus]=useState("");
const API_BASE_URL = import.meta.env.MODE === "production"
  ? "https://axon-hire.onrender.com"
  : "http://localhost:5000";

  // 4. This effect runs when the 'user' object changes (i.e., on login)
  useEffect(() => {
    if (!user) return; // If no user, do nothing

    // Load this user's applied jobs from localStorage
    const userKey = `appliedJobs_${user.email}`;
    const savedApplied = JSON.parse(localStorage.getItem(userKey)) || [];
    setAppliedJobs(savedApplied);
  }, [user]); // Re-run if 'user' changes

  // 5. This runs when "Clear" button is clicked
  const handleClear = () => {
    if (!user) return; // Safety check

    // Clear the state
    setAppliedJobs([]);
    // Clear the localStorage for this user
    const userKey = `appliedJobs_${user.email}`;
    localStorage.removeItem(userKey);
    alert("Your applied jobs list has been cleared.");
  };

  

  //new function  to capture the file when user selects it
  const handleFileChange=(e)=>{
    //we only want the first file selected
    setResumeFile(e.target.files[0]);
  };

  //function to send the file to the backend
  const handleUpload=async(e)=>{
    e.preventDefault();
    if(!resumeFile){
      setUploadStaus("Please select a file first");
      return;
        }

        // create the fromData package
       const formData = new FormData();
        formData.append("resume", resumeFile);//resume matches the  backend upload.single(resume)

        try{
          setUploadStaus("Uploading...");
          //semd it to our new endpoint
          //note headers are handled automatically by axios for FormData,
          //but explicity setting it to multipart/form-data is good pratice
          const res=await axiosInstance.post("/users/upload-resume",formData,{headers:{"Content-Type":"multipart/form-data"},
          });
          setUploadStaus("Upload successfull");
          alert("Resume uploaded successfully");
         
          // updates our global user state with the new resumeUrl
          //we use the login function from context to referesh the user data
          login(res.data.user,localStorage.getItem("token"));
        
        
        }  catch(err){
          console.error("Upload failed",err);
          setUploadStaus("Upload failed ,please try again");
      }
    };

  // 6. Safety check: If user is somehow null, show a message
  if (!user) {
    return <h2>Please log-in to view your profile.</h2>;
  }


//   // 7. Render the profile
//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>User Profile</h2>
//       <p>
//         <strong>Name:</strong> {user.name}
//       </p>
//       <p>
//         <strong>Email:</strong> {user.email}
//       </p>
//       {/* We will add phone back in when we update the register form */}
//       {/* <p><strong>Phone:</strong> {user.phone}</p> */}

//       <hr />

//       <h3>Your Applied Jobs:</h3>
//       {appliedJobs.length === 0 ? (
//         <p>You have not applied for any jobs yet.</p>
//       ) : (
//         <ul>
//           {appliedJobs.map((job, i) => (
//             <li key={i}>
//               {job.title} - {job.company}
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* 8. The Clear button */}
//       <button onClick={handleClear} style={{ marginTop: "10px", color: "red" }}>
//         Clear Applied Jobs
//       </button>
//     </div>
//   );
// }

// export default Profile;

// --- 7. THE UI (This is where all the changes are) ---
  return (
    // --- Page Container ---
    // 'p-8': "padding: 2rem;" (Give the page some space)
    // 'max-w-4xl': "max-width: 56rem;" (A medium-large width for a profile page)
    // 'mx-auto': "margin-left: auto; margin-right: auto;" (Center the content)
    <div className="p-8 max-w-4xl mx-auto">

      {/* Page Title */}
      <h2 className="text-4xl font-bold text-indigo-500 mb-8">Your Profile</h2>

      {/* --- Glassmorphism Card (REUSED from Login/Jobs) --- */}
      {/* 'p-8': "padding: 2rem;" */}
      {/* 'rounded-lg', 'shadow-lg', 'bg-slate-800/70', 'backdrop-blur-lg', 'border', 'border-slate-700' */}
      <div className="p-8 rounded-lg shadow-lg bg-slate-800/70 backdrop-blur-lg border border-slate-700">
        
        {/* User Details Section */}
        {/* 'mb-2': "margin-bottom: 0.5rem;" */}
        {/* 'text-lg': "font-size: 1.125rem;" */}
        {/* 'text-gray-300': Soft light gray for the label */}
        <p className="text-lg text-gray-300 mb-2">
          <strong>Name:</strong>
          {/* 'ml-2': "margin-left: 0.5rem;" (Add space after the label) */}
          {/* 'text-white': Make the user's actual name brighter */}
          <span className="ml-2 text-white font-medium">{user.name}</span>
        </p>
        
        <p className="text-lg text-gray-300 mb-6">
          <strong>Email:</strong>
          <span className="ml-2 text-white font-medium">{user.email}</span>
        </p>

        {/* Resume Manager */}
        <div className="mt-6 pt-6 border-t border-slate-700">
          <h3 className="text-2xl font-bold text-white mb-4">My Master Resume</h3>
 
        {/*status display */}
        {user.resumeUrl?(
          <div className="mb-4 p-3 bg-green-900/30 border border-green-600 rounded text-green-300">You have a resume on file <br/>
       <a 
  href={
    user.resumeUrl.startsWith("http") 
      ? user.resumeUrl // It's a Cloudinary link, use it as is
      : `${API_BASE_URL}${user.resumeUrl}` // It's a local link, add the prefix
  }
  target="_blank"
  rel="noopener noreferrer"
  className="underline font-bold hover:text-green-100"
>
  View Current Resume
</a>
        </div>):(
          <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-600 rounded text-yellow-300">
            No resume uploaded yet. "Easy Apply is disabled"
          </div>
        )}

        {/*Upload Form */}
        <form onSubmit={handleUpload}className="flex gap-4 items-center">
          <input
          type="file"
          accept=".pdf" //restrict to pdfs
          onChange={handleFileChange}
          className="block w-full text-sm text-slate-300 
                file:mr-4 file:py-2 file:px-4 
                file:rounded-full file:border-0 
                file:text-sm file:font-semibold 
                file:bg-indigo-600 file:text-white 
                hover:file:bg-indigo-700 cursor-pointer"/>
          <button type="submit" className="py-2 px-6 font-bold text-white rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all" >Upload</button>
        </form>
        {uploadStatus && <p className="mt-2 text-indigo-300">{uploadStatus}</p>}

        </div>
        </div>
<br/>
        {/* Horizontal Line Divider */}
        {/* 'border-slate-700': Use our faint border color */}
        <hr className="border-slate-700" />

        {/* --- Applied Jobs List (Old Logic) --- */}
      <div className="p-8 rounded-lg shadow-lg bg-slate-800/70 backdrop-blur-lg border border-slate-700">
        <h3 className="text-2xl font-bold text-white mb-4">Application History (Local)</h3>
        <ul className="list-disc list-inside space-y-2">
          {appliedJobs.map((job, i) => (
            <li key={i} className="text-lg">
              <span className="font-medium text-indigo-400">{job.title}</span>
              <span className="text-gray-300"> at {job.company}</span>
            </li>
          ))}
        </ul>
        {appliedJobs.length > 0 && (
          <button onClick={handleClear} className="mt-6 py-2 px-4 bg-red-600 rounded-md font-medium text-white hover:bg-red-700">
            Clear History
          </button>
        )}
      </div>
    </div>
  
  );
}

export default Profile;