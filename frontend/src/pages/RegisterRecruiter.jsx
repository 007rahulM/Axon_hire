//register page for recuriters
import { useState } from "react";
//import axios  from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; //to auto-login the recuiter
import axiosInstance from "../api/axiosInstance";


function RegisterRecruiter(){
    const navigate=useNavigate();
    const{login}=useAuth();// we use login to  set the token/user globally

    //---user state---
    const[name,setName]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const[confirm,setConfirm]=useState("");

  //   company state 
  const[companyName,setCompanyName]=useState("");
  const[contactEmail,setContactEmail]=useState("");
  const[website,setWebsite]=useState("");
  const[companyDescription,setCompanyDescription]=useState("");

  const[error,setError]=useState("");
  const[success,setSuccess]=useState("");

  const handleRegister=async(e)=>{
    e.preventDefault();
    setError("");
    setSuccess("");


    // frontend validation
    if(!name||!email||!password||!confirm||!companyName||!contactEmail){
        return setError("Please fill out all required fields");

    }
    if(password!==confirm){
        return setError("Password do not match");

    }
    if(password.length<6){
        return setError("Password must be at least 6 characters");

    }

    // combine all data into a single object for  send to the backend
  const submissionData={
    name,email,password,confirm, //user data
    companyName,contactEmail,website,companyDescription //company data
  };


  try{
    setSuccess("Registering recruiter and company...");

    // call the specialized backend route
    const res=await axiosInstance.post("http://localhost:5000/api/auth/register-recruiter", submissionData);

    // on success ,auto-login the recruiter
    login(res.data.user,res.data.token);

    alert("Recruiter registration successful You are now logged in");
    navigate("/") //send them to the home page
  }catch(err){
    setSuccess("");
    setError(err.response?.data?.message||"Registration failed");
  }
  };




  /////    the  UI for regitration 
 // --- UI ---
  return (
    <div className="min-h-screen flex items-center justify-center py-10">
      
      {/* Glassmorphism Card */}
      <div className="w-full max-w-2xl p-8 rounded-lg shadow-xl bg-slate-800/70 backdrop-blur-lg border border-slate-700">
        
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-white mb-8">Register as a Recruiter</h2>
        
        <form onSubmit={handleRegister}>
          
          {/* User Account Section */}
          <h3 className="text-xl font-bold text-indigo-400 mb-4 border-b border-slate-700 pb-2">1. Your Account Details</h3>
          <div className="grid grid-cols-2 gap-4">
            
            {/* Name */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">Full Name</label>
              <input type="text" placeholder="Recruiter Name" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">Work Email</label>
              <input type="email" placeholder="work@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            </div>
            
            {/* Password */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">Password (min. 6 chars)</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            </div>
            
            {/* Confirm Password */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">Confirm Password</label>
              <input type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} required
                className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
            </div>
          </div>
          
          {/* Company Details Section */}
          <h3 className="text-xl font-bold text-indigo-400 my-4 border-b border-slate-700 pb-2">2. Company Details</h3>
          
          {/* Company Name / Contact Email (Side-by-Side) */}
          <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">Company Name</label>
                  <input type="text" placeholder="Axon Inc." value={companyName} onChange={(e) => setCompanyName(e.target.value)} required
                      className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
              </div>
              <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">Public Contact Email (For Cold Emails)</label>
                  <input type="email" placeholder="careers@axon.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required
                      className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
              </div>
          </div>

          {/* Website */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Company Website (Optional)</label>
            <input type="text" placeholder="https://axon.com" value={website} onChange={(e) => setWebsite(e.target.value)}
              className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Company Description (Optional)</label>
            <textarea placeholder="Tell us about your company culture and mission..." value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} rows="3"
              className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
          </div>

          {/* Submit Button */}
          <div>
            <button type="submit" className="w-full py-3 font-bold text-white rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300">
              Register Company & Recruiter
            </button>
          </div>

          {/* Messages */}
          {error && <p className="text-center mt-4 text-red-400">{error}</p>}
          {success && <p className="text-center mt-4 text-green-400">{success}</p>}
        </form>
      </div>
    </div>
  );
}

export default RegisterRecruiter;