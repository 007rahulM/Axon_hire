// This is the landing page of our job portal

import { useEffect, useState,} from "react";
import {Link} from "react-router-dom";

function Home({ isLoggedIn}) {
  const[username ,setUsername]=useState("");
  //on page load check if user exists
  useEffect(()=>{
    const storedUser=JSON.parse(localStorage.getItem("user"));
   const loggedIn=localStorage.getItem("isLoggedIn");

  //only show username if logged in
  if(storedUser && loggedIn ==="true"){
    setUsername(storedUser.name);
  }
  },[]);
//   return (
//     <div style={{padding:"20px"}}>
//       <h1>Welcome to Job Portal</h1>
//       {isLoggedIn &&(<Link to="/profile"><button>Go to Profile</button></Link>)}
//       {username ?(<p>Hello,{username}! Glad to see you again.</p>):(<p>Please login too see personalized content.</p>)}
//       <p>Find your dream job or post one if you are an employer.</p>
//     </div>
//   );
// }

// export default Home;
return (
    // --- Page Container ---
    // 'p-8': "padding: 2rem;" (Give the page some space)
    // 'max-w-7xl': "max-width: 80rem;" (Limit the max width on very large screens)
    // 'mx-auto': "margin-left: auto; margin-right: auto;" (Center the content)
    <div className="p-8 max-w-7xl mx-auto">
      
      {/* --- Glassmorphism Welcome Card (REUSED theme) --- */}
      {/* We'll put the welcome message in its own glass card */}
      {/* 'p-8', 'rounded-lg', 'shadow-lg', 'bg-slate-800/70', 'backdrop-blur-lg', 'border', 'border-slate-700' */}
      {/* 'text-center': Center-align all the text inside this card */}
      <div className="p-8 rounded-lg shadow-lg bg-slate-800/70 backdrop-blur-lg border border-slate-700 text-center">
        
        {/* Page Title */}
        {/* 'text-4xl': "font-size: 2.25rem;" (Extra large title) */}
        {/* 'font-bold': "font-weight: 700;" */}
        {/* 'text-white': "color: white;" */}
        <h1 className="text-4xl font-bold text-white">
          {/* We check if the user is logged in to show a custom message */}
          {isLoggedIn ? `Welcome back ${username?.name}` : "Welcome to the Axon Hire Job Portal"}
        </h1>

        {/* Page Subtitle */}
        {/* 'text-xl': "font-size: 1.25rem;" */}
        {/* 'text-gray-300': Soft light gray color */}
        {/* 'mt-4': "margin-top: 1rem;" (Space below the title) */}
        <p className="text-xl text-gray-300 mt-4">
          Your next career move is just one click away.
        </p>
        <p className="text-lg text-gray-400 mt-2">
          Find your dream jobs and practice for interviews with our Axon AI and get hired.
        </p>

        {/* "Call to Action" Button Container */}
        {/* 'mt-8': "margin-top: 2rem;" (Lots of space above the buttons) */}
        {/* 'flex': "display: flex;" */}
        {/* 'justify-center': "justify-content: center;" (Center the buttons horizontally) */}
        {/* 'gap-4': "gap: 1rem;" (Space between the buttons) */}
        <div className="mt-8 flex justify-center gap-4">
          
          {/* --- Gradient "Find Jobs" Button (Primary Action) --- */}
          {/* We reuse the exact same gradient button style from Login.jsx */}
          <Link
            to="/jobs"
            className="py-3 px-6 font-bold text-white rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
          >
            Find a Job
          </Link>

          {/* --- Secondary "Practice with AI" Button --- */}
          {/* We use a "secondary" style (solid color) for the next most important action */}
          {/* 'bg-slate-700': Our dark gray button color */}
          {/* 'hover:bg-slate-600': Lighter on hover */}
          <Link
            to="/ai-bot"
            className="py-3 px-6 font-bold text-white rounded-md bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            Practice with Axon
          </Link>
        </div>
      </div>
      
      {/* We can add more dashboard components here later (e.g., "Recently Posted Jobs") */}

    </div>
  );
}

export default Home;
