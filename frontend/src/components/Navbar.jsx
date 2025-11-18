// This is our navigation bar for the job portal
// It uses react-router-dom for page navigation

// import { useEffect } from "react";
// import { Link , useNavigate} from "react-router-dom";

// function Navbar({isLoggedIn,setIsLoggedIn}) {
//   const navigate=useNavigate();

//   // state for login status (not just localstorage)
//  // const[isLoggedIn,setIsLoggedIn]=useState(false);

//   //when page loads or storage changes chek login state
//   useEffect(()=>{const loggedIn=localStorage.getItem("isLoggedIn")==="true";
//     setIsLoggedIn(loggedIn);
//   },[]);

// //listen for storage updates from other components
// useEffect(()=>{
//   const handleStorageCahange=()=>{
//     const loggedIn=localStorage.getItem("isLoggedIn")==="true";
//     setIsLoggedIn(loggedIn);
//   };
//   window.addEventListener("storage",handleStorageCahange);
//   return()=>window.removeEventListener("storage",handleStorageCahange);

// },[]);




//new================new routes bcz so much things change anad it no need to handle thngs which it not spoused to do
import{useNavigate}from "react-router-dom";
import{useState}from "react";
import{useAuth}from "../context/AuthContext";//bring in context
import Login from "../pages/Login";


//This is our Navbar component
function Navbar(){
  //Get the 'navigate' function to change pages
  const navigate=useNavigate();

  //1 get the user object to cjek their roles
  //pull data and actions from the Authocontext
  const{isLoggedIn,user,logout}=useAuth();

 // NEW: State for our mobile menu
  // 'isOpen' will be true if the mobile menu is open, false if closed.
  const [isOpen, setIsOpen] = useState(false);
  //This runs when the user clicks "Logout"
  const handleLogout=()=>{
    logout();//this now handles everything-state +storage+redirect
  };
  //this is the ui the html
//   return(
//     <nav style={{padding:"10px",background:"#eee"}}>
//       <h3>Job Portal</h3>
//       <div>
//         {/*if the user is not logged in show login/register buttons */}
//         {!isLoggedIn?(<>
//         <button onClick={()=>navigate("/login")}>Login</button>
//         <button onClick={()=>navigate("/register")}>Register</button>
        
//         </>
//         ):(
           
//           <>
//           {/*if the user is logged in show the full dashboard */}
//           <span>Welcome back { user?.name||"User"}  Happy to see you here..</span>
//           <br/><br/>
//           <button onClick={()=>navigate("/")}>Home</button>
//           <button onClick={()=>Login?navigate("/jobs"):navigate("/login")}>Jobs</button>
//           <button onClick={()=>navigate("/profile")}>Profile</button>

//          {/*add the AI bot button*/}
//          <button onClick={()=>navigate("/ai-bot")} style={{color:"green"}}>
//           AI Interview Bot
//          </button>



//           {/* only show this buttons if user is an Admin */}
//           {user?.role==="admin" &&(
//             <button onClick={()=>navigate("/admin/post-job")} style={{color:"blue"}}>
//               Post Job(Admin)
//             </button>
//           )}
//    <button onClick={handleLogout}>Logout</button>          
          
          
//           </>
//         )  
      
//       }
//       </div>
//     </nav>
//   );

// }

// export default Navbar;



//old one

//   //hangle logout
//   const handleLogout=()=>{
//     //clear user data and login status
//     localStorage.removeItem("isLoggedIn");// remove the lgoin flag
//     localStorage.removeItem("user");
    
//     setIsLoggedIn(false);//update ui instantly
//     navigate("/login"); //redirect to lgoin page
//   };
//   //check login state
  
//   return (
//     <nav style={{display:"flex", gap:"10px", padding: "10px", background: "#f4f4f4" }}>
//       {/* LOGO/HOME Link */}
//       <Link to="/" style={{ marginRight: "20px" }}>Home</Link>

//       {/* Links for navigation */}
//       <Link to="/jobs" style={{ marginRight: "10px" }}>Jobs</Link>
//    {/* show different buttons depending on login */}

//   {/* problem is that that logout button is not visible when the logedin is true need to fix it*/} 
//       {isLoggedIn?(
//         <>
//         <Link to="/profile">Profile</Link>
//         <button onClick={handleLogout}>Logout</button>
//         </>
       
//       ) : (
//         <>
//           <Link to="/login" style={{ marginRight: "10px" }}>
//             Login
//           </Link>
//           <Link to="/register">Register</Link>
//         </>
//       )}
//     </nav>
//   );


// export default Navbar;

// --- 5. THE UI (This is where all the changes are) ---
//   
return (
    // We wrap everything in <nav>
    // 'bg-slate-800/70', 'backdrop-blur-lg', etc. are our glass styles
    // 'sticky top-0 z-50' keeps it at the top
    <nav className="bg-slate-800/70 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-50">
      
      {/* --- Main Navbar Container --- */}
      {/* 'max-w-7xl mx-auto': Center the content on large screens */}
      {/* 'p-4': Padding */}
      {/* 'flex justify-between items-center': Our standard flex layout */}
      <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
        
        {/* 1. The Title/Logo (no change) */}
        <h3 className="text-2xl font-bold text-white">Axon Hire</h3>

        {/* 2. 🎯 THE HAMBURGER BUTTON (Mobile Only) */}
        {/* 'md:hidden': This is the magic.
             - 'md:' means "on medium screens (768px) and up..."
             - 'md:hidden' means "on medium screens and up, HIDE this button."
             - This means it's *only* visible on small (mobile) screens.
        */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)} // Toggle the 'isOpen' state on click
            className="text-white focus:outline-none"
          >
            {/* This is an "if/else" (ternary) operator:
                If menu is open, show an "X" icon.
                If menu is closed, show a "☰" (hamburger) icon.
            */}
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>

        {/* 3.  THE DESKTOP MENU (Desktop Only) */}
        {/* 'hidden': This is 'display: none;' by default (on mobile).
            'md:flex': This is 'display: flex;' *only* on medium screens and up.
            This is the *opposite* of the hamburger button.
        */}
        <div className="hidden md:flex items-center gap-4">
          {/* This is the exact same code you had before, now wrapped in the responsive div */}
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="py-2 px-4 font-medium text-white rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300" >
                Login
              </button>
              
              <button
                onClick={() => navigate("/register")}
                 className="py-2 px-4 font-medium text-white rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300" >
                Register
              </button>
              {/* Recruiter Register (Tertiary - Outline Style)  to desktop view */}
              <button onClick={() => navigate("/register-recruiter")}
               className="py-2 px-4 font-medium text-white rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
               >
                Register (Recruiter)
              </button>
            </>
          ) : (
            <>
              <span className="text-gray-300">Welcome  {user?.name || "User"}</span>
              <button onClick={() => navigate("/")} className="font-medium hover:text-indigo-400">Home</button>
              <button onClick={() => navigate("/jobs")} className="font-medium hover:text-indigo-400">Jobs</button>
              <button onClick={() => navigate("/profile")} className="font-medium hover:text-indigo-400">Profile</button>
              <button onClick={() => navigate("/ai-bot")} className="font-medium text-green-400 hover:text-green-300">
                AI Bot
              </button>
              {user?.role == "admin" || user?.role == "recruiter" ? (
                <button
                  onClick={() => navigate("/admin/post-job")}
                  className="py-2 px-4 bg-indigo-600 rounded-md font-bold text-white hover:bg-indigo-700"
                >
                  Post Job
                </button>
              ):null}
              <button
                onClick={handleLogout}
                className="py-2 px-4 bg-red-600 rounded-md font-medium text-white hover:bg-red-700"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* 4.  THE MOBILE MENU (Dropdown) */}
      {/* This 'div' is only shown if 'isOpen' is true. */}
      {/* 'md:hidden': This *entire menu* is hidden on desktops. */}
      {isOpen && (
        <div className="md:hidden p-4 space-y-4 bg-slate-800">
          {/* We repeat the links here, but stack them vertically */}
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-2 px-4 font-medium text-white rounded-md bg-gradient-to-r from-indigo-500 to-purple-500"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                 className="w-full py-2 px-4 font-medium text-white rounded-md bg-gradient-to-r from-indigo-500 to-purple-500"
                 >
                Register
              </button>

              {/*adding the new register recruiter page */}
            <button onClick={() => navigate("/register-recruiter")}  className="w-full py-2 px-4 font-medium text-white rounded-md bg-gradient-to-r from-indigo-500 to-purple-500">
                Register (Recruiter)
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/")} className="block w-full text-left p-2 hover:bg-slate-700 rounded">Home</button>
              <button onClick={() => navigate("/jobs")} className="block w-full text-left p-2 hover:bg-slate-700 rounded">Jobs</button>
              <button onClick={() => navigate("/profile")} className="block w-full text-left p-2 hover:bg-slate-700 rounded">Profile</button>
              <button onClick={() => navigate("/ai-bot")} className="block w-full text-left p-2 text-green-400 hover:bg-slate-700 rounded">
                AI Bot
              </button>
             {user?.role === "admin" || user?.role === "recruiter" ?(
                <button
                  onClick={() => navigate("/admin/post-job")}
                  className="block w-full text-left p-2 text-blue-400 hover:bg-slate-700 rounded"
                >
                  Post Job 
                </button>
             ):null}
              <button
                onClick={handleLogout}
                className="w-full py-2 px-4 bg-red-600 rounded-md font-medium text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
