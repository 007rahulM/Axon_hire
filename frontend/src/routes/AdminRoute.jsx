

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute=()=>{
    const {user,loading}=useAuth();

    //1 if still loading, wait
    if(loading)return<div>Loading...</div>;

    //2 if user is logged in and is an admiin let them in
    if(user && (user.role==="admin" || user.role=="recruiter")){
        return<Outlet/>;
}

//3 otherwise kicj them out to the home page
alert("Access Denied: Admin only!");
return<Navigate to="/" replace/>;
};


export default AdminRoute;