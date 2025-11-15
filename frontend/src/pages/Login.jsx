import{useState}from "react";
import{useNavigate} from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

function Login(){
  const [email,setEmail]=useState("");
 const [password,setPassword]=useState("");
 const[error,setError]=useState("");
 const navigate=useNavigate();

// get the login function from our global AuthContext
//we no longer need props like(setloggedin,setuser)
const{login}=useAuth();

//this runs when the user clicks the login button
const handleSubmit=async(e)=>{
  e.preventDefault();//stop the page from reloading
  setError("");//clear any old errors

  try{
    //call the backend api(using our secure axiosInstance)
    const res=await axiosInstance.post("/auth/login",{email,password});

    //get the token and user data from the backend's response
    const{token,user}=res.data;

    //call the global 'login' function from our context
    //this will update the state and save to localstorage
    login(user,token);

    alert("Login sucessful");
    navigate("/");//send user to the home page
  }
  catch(err){
    //if the backned sends an error like user not found ,show it
    setError(err.response?.data?.message || "Login falied PLease try again")
  }
};

// return(
//   <div style={{padding:"20px"}}>
//     <h2>Login</h2>
//     <form onSubmit={handleSubmit}>
//     <input
//           type="text"
//        placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//     <br/>
//     <input
//     type="password"
//     placeholder="Password..."
//     value={password}
//     onChange={(e)=>setPassword(e.target.value)}
// />
// <br/>
// <button type="submit">Login</button>

//     </form>
//     {/*show the error message if error state is not empty */}
//     {error &&<p style={{color:"red"}}>{error}</p>}
//   </div>
// );
// }

// export default Login;

// --- 5. THE UI (This is where all the changes are) ---
  return (
    // This is the main container for the *entire page*
    // 'min-h-screen': "min-height: 100vh;" (Make it fill the full browser height)
    // 'flex': "display: flex;" (Turn on flexbox)
    // 'items-center': "align-items: center;" (Center vertically)
    // 'justify-center': "justify-content: center;" (Center horizontally)
    <div className="min-h-screen flex items-center justify-center">

      {/* This is our "Glassmorphism" Card */}
      {/* 'w-full': "width: 100%;" (Be full width on mobile) */}
      {/* 'max-w-md': "max-width: 28rem;" (...but on larger screens, don't be wider than 448px) */}
      {/* 'p-8': "padding: 2rem;" (Give it lots of internal spacing) */}
      {/* 'rounded-lg': "border-radius: 0.5rem;" (Nice rounded corners) */}
      {/* 'shadow-xl': "box-shadow: ..." (A large, soft shadow for a "floating" look) */}
      {/* 'bg-slate-800/70': "background-color: rgb(30 41 55 / 0.7);" (Our dark card color, at 70% opacity) */}
      {/* 'backdrop-blur-lg': "backdrop-filter: blur(16px);" (The "frosted glass" effect!) */}
      {/* 'border': "border-width: 1px;" */}
      {/* 'border-slate-700': "border-color: rgb(51 65 85);" (A faint border to catch the light) */}
      <div className="w-full max-w-md p-8 rounded-lg shadow-xl bg-slate-800/70 backdrop-blur-lg border border-slate-700">
        
        {/* The "Login" Title */}
        {/* 'text-3xl': "font-size: 1.875rem;" (Big text) */}
        {/* 'font-bold': "font-weight: 700;" */}
        {/* 'text-center': "text-align: center;" */}
        {/* 'text-white': "color: white;" */}
        {/* 'mb-6': "margin-bottom: 1.5rem;" (Space below the title) */}
        <h2 className="text-3xl font-bold text-center text-white mb-6">Login</h2>
        
        {/* The form itself */}
        <form onSubmit={handleSubmit}>
          
          {/* Email Field Group */}
          <div className="mb-4"> {/* 'mb-4': "margin-bottom: 1rem;" (Space between fields) */}
            {/* The "Email" Label */}
            {/* 'block': "display: block;" (Puts it on its own line) */}
            {/* 'mb-2': "margin-bottom: 0.5rem;" (Space above the input box) */}
            {/* 'text-sm': "font-size: 0.875rem;" */}
            {/* 'font-medium': "font-weight: 500;" */}
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              // --- Input Styling ---
              // 'w-full': "width: 100%;" (Make input fill the card)
              // 'p-3': "padding: 0.75rem;" (Make it tall and easy to click)
              // 'rounded-md': "border-radius: 0.375rem;"
              // 'bg-slate-700': "background-color: ..." (Dark input background)
              // 'border': "border-width: 1px;"
              // 'border-slate-600': "border-color: ..." (Faint border)
              // 'placeholder-gray-400': "color: ..." (Light gray placeholder text)
              // 'focus:outline-none': On click, remove the default ugly blue glow
              // 'focus:ring-2': On click, add our own glow
              // 'focus:ring-indigo-500': Make the glow our "Indigo" accent color
              className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password Field Group */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              // We use the *exact same classes* as the email input for consistency
              className="w-full p-3 rounded-md bg-slate-700 border border-slate-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div>
            {/* --- Gradient Button Styling --- */}
            {/* 'w-full': "width: 100%;" (Make the button full-width) */}
            {/* 'py-3': "padding: 0.75rem;" (A nice, tall button) */}
            {/* 'font-bold': "font-weight: 700;" */}
            {/* 'rounded-md': "border-radius: 0.375rem;" */}
            {/* 'bg-gradient-to-r': "background-image: linear-gradient(to right, ...)" (This is the magic!) */}
            {/* 'from-indigo-500': The starting color of the gradient */}
            {/* 'to-purple-500': The ending color of the gradient */}
            {/* 'hover:from-indigo-600 hover:to-purple-600': On hover, make the gradient slightly darker */}
            {/* 'transition-all duration-300': Make the hover effect animate smoothly */}
            <button
              type="submit"
              className="w-full py-3 font-bold text-white rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
            >
              Login
            </button>
          </div>

          {/* Error Message */}
          {/* 'text-center': "text-align: center;" */}
          {/* 'mt-4': "margin-top: 1rem;" (Space above the error) */}
          {/* 'text-red-400': "color: ..." (A nice, soft red for our dark theme) */}
          {error && <p className="text-center mt-4 text-red-400">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;