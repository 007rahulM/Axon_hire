//1 import mongoose and the schema bulilder
const mongoose=require("mongoose");
const Schema=mongoose.Schema;

//2 define the blueprint for a company profiel
const companySchema=new Schema(
    {
     //3 this is the link back to the recuriter who created this profiel
     owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,

     },
     // 4 the companys offical name
     name:{
        type:String,
        required:[true,"Company name is required"],
        trim:true, //removes whitespaces
     },
     //5 A bio about their company
     description:{
        type:String,
        default:"",
     },
     //6 the company public website
     website:{
        type:String,
        default:"",
     },

     //recruiter email 
     // this is the public contack email for applicants
     //our ai will use this for the cold-email feature
     contactEmail:{
        type:String,
        default:"",
     },
    },
    {timestamps:true,

    }
);

//export thte model so our routes can use it
module.exports=mongoose.model("Company",companySchema);