// src/pages/Profile.jsx

import { useState, useEffect } from "react";
// 1. Import the useAuth hook to get the logged-in user
import { useAuth } from "../context/AuthContext";

function Profile() {
  // 2. Get the user from our global context
  const { user } = useAuth();
  
  // 3. Create *local* state just for this page
  const [appliedJobs, setAppliedJobs] = useState([]);

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

  // 6. Safety check: If user is somehow null, show a message
  if (!user) {
    return <h2>Please log in to view your profile.</h2>;
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

        {/* Horizontal Line Divider */}
        {/* 'border-slate-700': Use our faint border color */}
        <hr className="border-slate-700" />

        {/* Applied Jobs Section */}
        {/* 'mt-6': "margin-top: 1.5rem;" (Space above this section) */}
        <div className="mt-6">
          <h3 className="text-2xl font-bold text-white mb-4">Your Applied Jobs</h3>

          {/* 'list-disc': Use bullet points */}
          {/* 'list-inside': Put bullet points *inside* the layout */}
          {/* 'space-y-2': "margin-top: 0.5rem;" (Adds 8px of space between each <li> item) */}
          <ul className="list-disc list-inside space-y-2">
            {appliedJobs.length === 0 ? (
              <p className="text-gray-400">You have not applied for any jobs yet.</p>
            ) : (
              appliedJobs.map((job, i) => (
                // 'text-lg': Make the list items easy to read
                <li key={i} className="text-lg">
                  <span className="font-medium text-indigo-400">{job.title}</span>
                  <span className="text-gray-300"> at {job.company}</span>
                </li>
              ))
            )}
          </ul>

          {/* Clear Button - Only show if there are jobs to clear */}
          {appliedJobs.length > 0 && (
            // --- "Danger" Button Styling (REUSED from Navbar) ---
            // 'mt-6': "margin-top: 1.5rem;" (Space it away from the list)
            // 'inline-block': Makes it only as wide as its content
            // 'py-2 px-4': Padding
            // 'bg-red-600': Red color
            <button
              onClick={handleClear}
              className="mt-6 inline-block py-2 px-4 bg-red-600 rounded-md font-medium text-white hover:bg-red-700 transition-colors"
            >
              Clear Applied Jobs
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;