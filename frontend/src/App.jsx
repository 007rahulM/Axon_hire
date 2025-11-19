import { BrowserRouter as Router,Routes, Route, Link ,Navigate} from "react-router-dom";

//import { useState ,useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/Jobs"
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile"; //new page
//import ProtectedRoute from "./routes/ProtectedRoute";//import the  protected route security
import AdminPostJob from "./pages/PostJob";//import the admin page
//import AdminRoute from "./routes/AdminRoute";//import the admin route security
import AIBot from "./pages/AIBot";//import the AIbot page

import RegisterRecruiter  from "./pages/RegisterRecruiter"; //import the register recuiter page 


//import our security guards 
import ProtectedRoute from "./routes/ProtectedRoute";//import the  protected route security
import AdminRoute from "./routes/AdminRoute";//import the admin route security

/*
// function App() {
//   //state for tracking login
//   const [isLoggedIn,setIsLoggedIn] = useState(false);
  
//   //state to store user info
//   const[user,setUser]= useState(null);
  
//   //global states:who  is logged  in+what jobs they applied for
//  //user for user usestate is defined in the top 19 line 
//  const [appliedJobs,setAppliedJobs]=useState([]);//this is creates a emoty continer where where user is applied or not is stored thn apssed as a props to other pages like profiel page
//  //and to pass this we need to pass in into routes
  
//   //on component load, check localStorage for user info
//   useEffect(()=>{
//     const storedUSer=JSON.parse(localStorage.getItem("user"));
//     const loginFlag = localStorage.getItem("isLoggedIn");
    
//     //if user exits and login flag is true
//     if(storedUSer && loginFlag==="true"){
//       setIsLoggedIn(true);
//       setUser(storedUSer);

//       //load user-specific applied jobs
//       // const saved=JSON.parse(localStorage.getItem(`appliedJobs_${storedUSer.email}`))||[];
//     }
//   }, []);

//   return (
   
      
//         <div>
          
// /*navbar is always visible */
//       <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>

// {/*defining routes */}

  
//       <Routes>
//         <Route path="/" element={<Home is isLoggedIn={isLoggedIn}/>} />
//         {/*only loged in users can see jobs */}
//         <Route path="/Jobs" 
//         element={<ProtectedRoute>
//            {isLoggedIn ? <Jobs
//            //we pass the props inthe routes inside the jobs tag or liek in the below
            
//            user={user}
//            appliedJobs={appliedJobs}
//            setAppliedJobs={setAppliedJobs}
//            /> :<Navigate to="/login"/>}  </ProtectedRoute>} 
//         />
//         <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser}/>}/>
//         {/*proteced profile page */}
//         <Route path="/profile" 
//         element={isLoggedIn ? 
//         (<Profile
//          user={user}
//          appliedJobs={appliedJobs}
//          setAppliedJobs={setAppliedJobs}
//          />):(<Navigate to="/login"/>)
//          }
//          />
        
//         <Route path="/register" element={<Register/>}/>
//       </Routes>

   
//         </div>
  
//   );
// }

// export default App;
//*/
//---------------------------------------------
//new function app with the procted routes 
function App(){
  return(

<div className="min-h-screen bg-gray-100">
{/*navbar is always visible */}
{<Navbar/>}
    <Routes>

  
      {/*public routes */}
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      {/*here added the new public route register recuriter route */}
      <Route path="/register-recruiter" element={<RegisterRecruiter/>}/>     
      <Route path="/" element={<Home/>}/>

      {/*private routes :everyone inside protectedroute need login */}
    <Route element={<ProtectedRoute/>}>


       <Route path="/" element={<Home/>}/>
     <Route path="/jobs" element={<Jobs/>}/>
     <Route path="/profile" element={<Profile/>}/>
     <Route path="/ai-bot" element={<AIBot/>}/>
    

    </Route>

    {/*Admin routes -only admins can see these */}
  <Route element={<AdminRoute />}>
          <Route path="/post-job" element={<AdminPostJob />} />
        </Route>

 </Routes>
</div>     
  );
}

export default App;