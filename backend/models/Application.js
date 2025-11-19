//import monogoose and the schema builder
const mongoose=require("mongoose");
const Schema=mongoose.Schema;

// define the blueprint for an application
const applicationSchema= new Schema(
    {
//this is the link to the job collection //
//type:Schema.Types.ObectID -means we are storing a reference ID
//ref:Job  -tells monoogse that id corresponds to a document in the jon collection
//here we need job refer id to store in the application to see 
jobId:{
    type:Schema.Types.ObjectId,
    ref:"Job",
    required:true,
},
//this is the link to the user collection the applicant
//red User tells Mongoose that id corresponds to a document in the user collection
//this is the link for the user details in the application
applicantId:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true,
},



// link to their Resume(we will store the url/path herr)
resumeUrl:{
    type:String, //eg. "/uploads/resume-rahul.paf"
    required:false, //optional for now until we build the upload button

},
// this is your  application status fields come from
//enum restricts this field to only these 4 values
//default-submitted means every new application automaticall starts as Submited
status:{
    type:String,
    enum:["Submitted","Viewed","Shortlisted","Rejected"],
    default:"Submitted",

},

appliedAt:{
    type:Date,
    default:Date.now,
},
},
//timestamps:true -it automatically adds created at and updatedat fields
//this lets use know when the user applied
{
    timestamps:true,

}

)

//export the model so our routes can use it
module.exports=mongoose.model("Application",applicationSchema);