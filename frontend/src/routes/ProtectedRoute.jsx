// import React ,{useEffect,useState} from "react";
// import { Navigate } from "react-router-dom";

// //chcek for login state before showing the page
// function ProtectedRoute({children}){
//     const[isLoggedIn,setIsLoggedIn]=useState(localStorage.getItem("isLoggedIn")==="true");
   
//     //watch fpr storage updates login/logout
//     useEffect(()=>{
//         const handleStorageCahange=()=>{
//             setIsLoggedIn(localStorage.getItem("isLoggedIn")==="true");
//         };
//         window.addEventListener("storage",handleStorageCahange);
//         return()=>window.removeEventListener("storage",handleStorageCahange);
//     },[]);

//     //if not logged in,redirect to login page
//     if(!isLoggedIn){
//         return<Navigate to="/login" />;
//     }
  
//     //if logged in,show requested page
//     return children;

// }
// export default ProtectedRoute;


//=================================
//new proctected routes foe blocking the acces to rivate pages like jobs,dashboard,and admin
//unless usesr is loggged in
//automaticall redirect to the unothrized user to the login page//
//----------------------------------

//import essential tools from react router
import { Navigate,Outlet } from "react-router-dom";
//import our custom authentication context hook
import{useAuth}from"../context/AuthContext";

//protectedroute acts as a security gatekeeper for private pages
const ProtectedRoute=()=>{
    //extract the isloggedin state from authcontext
    const {isLoggedIn,loading}=useAuth();
//if we are still checking localstorage(loading=true),show a message
//this prevents the "white page" and flicker on referesh
if(loading){
    return<div style={{alignContent:"center",alignItems:"center"}}>Loading your session...</div>
}


    //if user is not logged in, redirect to login page
    
    if(!isLoggedIn){
        console.warn("Unauthorized access attempt-- redirecting to login page");
        return <Navigate to="/login" replace/>;
    }

    //if user is logged in, render the  child route(outlet=placeholder for nested routes)
    return<Outlet/>;
};

export default ProtectedRoute;


