//recruiter dashboard

import{useState,useEffect} from "react";
import axiosInstance from "../api/axiosInstance";

function RecruiterDashboard(){
    const[applications,setApplications]=useState([]);
    const[loading,setLoading]=useState(true);
    const[error,setError]=useState("");
const API_BASE_URL = import.meta.env.MODE === "production"
  ? "https://axon-hire.onrender.com"
  : "http://localhost:5000";


    //1 fetch data on load
    useEffect(()=>{
        const fetchApplications=async()=>{
            try{
                //call the route for the get recuiter applications
                const res =await axiosInstance.get("/applications/recruiter");
                setApplications(res.data);
            }catch(err){
                console.error("Failed to load applications",err);
                setError("Failed to load applications");
             

            }finally{
                setLoading(false);
            }
        };
        fetchApplications();
    },[]);

//   //2 helper function to change status -we will hook this up to the backend later
//   const handleStatusChange=(appId,newStaus)=>{
//     console.log(`Changing status of ${appId} to ${newStaus}`);
//     //calll  backend api to update status
//   };


  //-----UI
  // --- UI ---
  return (
    <div className="min-h-screen p-8 bg-slate-900 text-slate-200">
      <div className="max-w-7xl mx-auto">
        
        <h2 className="text-3xl font-bold text-white mb-8">Recruiter Dashboard</h2>

        {/* Status Messages */}
        {loading && <p>Loading applications...</p>}
        {error && <p className="text-red-400">{error}</p>}
        
        {!loading && applications.length === 0 && (
          <div className="p-8 rounded-lg bg-slate-800/70 border border-slate-700 text-center">
            <p className="text-xl text-gray-400">No applications received yet.</p>
          </div>
        )}

        {/* Applications Table */}
        {!loading && applications.length > 0 && (
          <div className="overflow-hidden rounded-lg shadow-lg border border-slate-700 bg-slate-800/70 backdrop-blur-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-700/50 text-gray-300 border-b border-slate-600">
                  <th className="p-4 font-medium">Candidate</th>
                  <th className="p-4 font-medium">Job Title</th>
                  <th className="p-4 font-medium">Applied At</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    
                    {/* Candidate Info */}
                    <td className="p-4">
                      <p className="font-bold text-white">{app.applicantId?.name || "Unknown"}</p>
                      <p className="text-sm text-gray-400">{app.applicantId?.email}</p>
                    </td>

                    {/* Job Info */}
                    <td className="p-4 text-indigo-300">
                      {app.jobId?.title || "Job Deleted"}
                    </td>

                    {/* Date */}
                    <td className="p-4 text-gray-400">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold 
                        ${app.status === 'Submitted' ? 'bg-blue-900 text-blue-200' : 
                          app.status === 'Shortlisted' ? 'bg-green-900 text-green-200' : 
                          'bg-gray-700 text-gray-300'}`}>
                        {app.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      {app.resumeUrl ? (
                       <a href={`${API_BASE_URL}${app.resumeUrl}`} target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 hover:text-blue-300 underline"
                        >
                          View Resume
                        </a>
                      ) : (
                        <span className="text-sm text-gray-500">No Resume</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecruiterDashboard;