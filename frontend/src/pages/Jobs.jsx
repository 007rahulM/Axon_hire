//1 we now need useeffect to fetch data and usestate to store it
import{useState,useEffect}from "react";
//2 import our global useauht hook to know who is logged in
import{useAuth}from "../context/AuthContext";
//3 import our custom axiosinstance that already has our backend url and token logic
import axiosInstance from "../api/axiosInstance";

//import for redirection 
import { useNavigate }  from "react-router-dom";

//----job card component---//
//this commonent just receives props ,it doesn't care if the data
//is hard-coded or from an api,which is why its so reusable.
function JobCard({title,company,location,salary,onApply,applied})
{
  // return(
  //   <div style={{border:"1px solid gray",padding:"10px",margin:"10px"}}>
  //     <h3>Title  :  {title}</h3>
  //     <p>Company  : {company}</p>
  //     <p>Location  : {location}</p>
  //     <p>Salary:{salary}</p>
  //     <button onClick={onApply} disabled={applied}>
  //       {applied?"Applied":"Apply"}
  //     </button>
  //   </div>
  // );


  //new with style
  return (
    // --- Glassmorphism Card Styling (REUSED from Login.jsx) ---
    // 'flex flex-col': "display: flex; flex-direction: column;" (Makes items stack vertically)
    // 'justify-between': "justify-content: space-between;" (Pushes the button to the bottom)
    // 'p-6': "padding: 1.5rem;" (A good amount of space inside the card)
    // 'rounded-lg': "border-radius: 0.5rem;"
    // 'shadow-lg': "box-shadow: ..."
    // 'bg-slate-800/70': "background-color: rgb(30 41 55 / 0.7);" (Our dark glass color)
    // 'backdrop-blur-lg': "backdrop-filter: blur(16px);" (The "frosted glass" effect)
    // 'border border-slate-700': "border-width: 1px; border-color: ..." (The faint border)
    // 'h-full': "height: 100%;" (Tells the card to fill the full height of its grid cell)
    <div className="flex flex-col justify-between p-6 rounded-lg shadow-lg bg-slate-800/70 backdrop-blur-lg border border-slate-700 h-full">
      
      {/* Top section of the card */}
      <div>
        {/* Job Title */}
        {/* 'text-2xl': "font-size: 1.5rem;" */}
        {/* 'font-bold': "font-weight: 700;" */}
        {/* 'text-white': "color: white;" */}
        <h3 className="text-2xl font-bold text-white">{title}</h3>

        {/* Company Name */}
        {/* 'text-lg': "font-size: 1.125rem;" */}
        {/* 'text-indigo-400': Our accent color! */}
        {/* 'font-medium': "font-weight: 500;" */}
        {/* 'mt-2': "margin-top: 0.5rem;" (A little space below the title) */}
        <p className="text-lg text-indigo-400 font-medium mt-2">{company}</p>

        {/* Location */}
        {/* 'text-gray-300': A soft, light gray for secondary info */}
        {/* 'mt-1': "margin-top: 0.25rem;" (A tiny space) */}
        <p className="text-gray-300 mt-1">{location}</p>

        {/* Salary */}
        {/* 'text-gray-100': A bit brighter than location text */}
        {/* 'mt-2': "margin-top: 0.5rem;" */}
        <p className="text-gray-100 mt-2">{salary}</p>
      </div>


     
     
      {/*new feature ===> on apply button--the smart button styling
      if 'applied' is ture then it turns gray and uncliable
      if 'applied' is false it shows our the first gradient color
      its added in the abpply button 
      */}

      {/* Bottom section of the card (the button) */}
      <div>
        {/* --- Gradient "Apply" Button (REUSED from Login.jsx) --- */}
        {/* 'w-full': "width: 100%;" (Make the button fill the card width) */}
        {/* 'mt-6': "margin-top: 1.5rem;" (Push the button away from the text) */}
        {/* 'disabled:bg-gray-500': If disabled, make it gray */}
        {/* 'disabled:from-gray-500 disabled:to-gray-600': If disabled, remove the gradient */}
        <button
          onClick={onApply}
          disabled={applied}
          /*className="w-full py-2 px-4 font-bold text-white rounded-md mt-6
                     bg-gradient-to-r from-indigo-500 to-purple-500 
                     hover:from-indigo-600 hover:to-purple-600 
                     transition-all duration-300
                     disabled:from-gray-500 disabled:to-gray-600 disabled:opacity-70"*/

          className={`w-full py-2 px-4 font-bold texxt-white rounded-md mt-6 transition-all duration-300
            ${applied 
              ? "bg-gray-600 cursor-not-allowed opacity-70" 
              : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            }`}
        >
          {applied ? "Applied" : " Easy Apply"}
        </button>
      <br/>
      </div>
    </div>
  );
}

//-- main jobs component - this is where we make the changes--
function Jobs(){
  //4 get the logged-in user and login status from our global context
  const{user,isLoggedIn}=useAuth();
  //5 set up our states they start as empty array
  //this state will hold jobs from our mongodb database
  const[jobList,setJobList]=useState([]);
  //this state holds the hib this specific user has applied for 
  const[appliedJobs,setAppliedJobs]=useState([]);
  //this state will show a "loading..." meassage while we fetch
  const[loading,setLoading]=useState(true);

   const navigate=useNavigate(); //

  //6 this useeffect hook runs once when the component first loads
  useEffect(()=>{
    //7 we define an async function inside to fetch our data
    const fetchData=async()=>{
      try{
        setLoading(true);//show the loading message
        //8 call our backends public endpoint to get all jobs
        const jobResponse=await axiosInstance.get("/jobs");
        //9 put the jobs from the database into our jobslist state
        setJobList(jobResponse.data);

        //10 if a user is logged in and also load their applied jobs
        if(user){
          const userKey=`appliedJobs_${user.email}`;
          const saveApplied=JSON.parse(localStorage.getItem(userKey))||[];
          setAppliedJobs(saveApplied);
        }
    }catch(err){
      //11 if the api call fails,log the error
      console.error("Failed to fetch jobs:",err);
    }finally{
      //12 no matter what stop showing the loading message
      setLoading(false);
    }
    };
    fetchData();//13 call the function we just defined
  },[user]);//14 the[user] dependency array means-rerun this if the user  object changes ex on login/logout 

  {/*//15 this function runse when a user click apply
  const handleApply=(job)=>{
    if(!isLoggedIn || !user){
      alert("You must be logged in to apply for a job");
      return;
    }

    //
    if(appliedJobs.some((j)=>j.title===job.title)){
      alert("You have already applied for this job");
      return;
    }
  const newAppliedJobs=[...appliedJobs,job];
  setAppliedJobs(newAppliedJobs);
  const userKey=`appliedJobs_${user.email}`;
  localStorage.setItem(userKey,JSON.stringify(newAppliedJobs));
  alert(`Successfully applied for ${job.title}`);
};

*/}

//handle apply logic old one is on above with less feature the extended version is here
//new feature the smart apply ogic for the easy apply
const handleApply=async (job)=>{
  // security check
  if(!isLoggedIn || !user){
    alert("You must be logged in to apply for a job");
    navigate("/login");
    return;
  }
  //resume check -if the master resume is there in the profile if not we cannot apply
  //we check if the user has a resumeUrl in their profike
  if(!user.resumeUrl){
    const confirmRedirect=window.confirm(
      "To Apply you must upload a Master Resume in your Profile First \n\n Go to Profile now? "
    );
    if(confirmRedirect){
      navigate("/profile");
    }
    return; //stop here do not apply
  }

  //Optimistic UI update logic
  //here we assume success and turn the button green immediately
  const previousApplied=[...appliedJobs];
  const newAppliedList=[...previousApplied,job];
  setAppliedJobs(newAppliedList);
  
  try{
    // call the backend 
    // this creates the actual application document in the mongodb
    await axiosInstance.post(`/applications/${job._id}/apply`);
    alert(`Success You have applied to ${job.title} at ${job.company}`);


    // save to localstorage-keep the cache in the synce
    localStorage.setItem(`appliedJobs_${user.email}`,JSON.stringify(newAppliedList));

  }catch(err){
    //error handling-rollback
    //if the backend sys "error or duplicate",we revert the button
    console.error("Application failed:",err);
    setAppliedJobs(previousApplied); //undo the green button

    //show the specific error message from the backend
    alert(err.response?.data?.message || "Application failed");
  }

};



// //16 render the component UI
// return(
//   <div style={{padding:"20px"}}>
//     <h2>Available Jobs</h2>
//     {/* 17 showing a loading... message while loading is true */}
//     {/* 18 if not loading and there are no jobs then show a message*/}
//     {!loading && jobList.length===0 && <p> No posted jobs yet...<br/> Check back soon..!</p>}

//  {/*19 if not loading and we have jobs,mao over them and render jobcards */}
//  {!loading &&
//   jobList.map((job)=>(
//     <JobCard
//     key={job._id}//use the unique ._id from mongodb as the key
//     title={job.title}
//     company={job.company}
//     location={job.location}
//     salary={job.salary}
//     applied={appliedJobs.some((j)=>j.title===job.title)}
//     onApply={()=>handleApply(job)}/>
//      ))}
//   </div>
// );
// }

// export default Jobs;
// frontend/src/pages/Jobs.jsx
// ... (Your imports, JobCard component, and 'Jobs' function logic are all perfect)

// --- 4. THE UI (This is where we apply the Grid) ---
return (
  // 1. PAGE CONTAINER: Add padding 'p-8' (space from navbar)
  // 'max-w-7xl mx-auto' centers the content on large screens
  <div className="p-8 max-w-7xl mx-auto">
    
    {/* 2. PAGE TITLE: Make it big, bold, and white so it's visible */}
    <h2 className="text-4xl font-bold text-indigo-500  mb-8">Available Jobs</h2>

    {/* 3. GRID CONTAINER: This fixes the card spacing */}
    {/* 'grid' = Use grid layout */}
    {/* 'grid-cols-1' = 1 column on mobile (default) */}
    {/* 'md:grid-cols-2' = On "medium" screens (tablets), switch to 2 columns */}
    {/* 'lg:grid-cols-3' = On "large" screens (desktops), switch to 3 columns */}
    {/* 'gap-6' = 1.5rem (24px) gap between all cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {/* 4. Show loading/empty messages */}
      {loading && <p>Loading jobs...</p>}
      {!loading && jobList.length === 0 && <p>No posted jobs yet...</p>}

      {/* 5. Map and render the styled JobCards */}
      {!loading &&
        jobList.map((job) => (
          <JobCard
            key={job._id}
            title={job.title}
            company={job.company}
            location={job.location}
            salary={job.salary}
            applied={appliedJobs.some((j) => j.title === job.title)}
            onApply={() => handleApply(job)}
          />
        ))}
    </div>
  </div>
);
}

 export default Jobs;