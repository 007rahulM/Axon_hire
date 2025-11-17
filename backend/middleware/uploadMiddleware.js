//1 import the multer library
const multer=require("multer");
//2 import the 'path' library - a build in node.js tool for working with files paths
const path=require("path");
//3 this is the storage engine ,it tells multer where and how to save our files
const storage=multer.diskStorage({
    //4 destination tells multer where to put the file
    destination:(req,file,cb)=>{
        //we'll createa folder named uploads -it must exist or we create it 
        //null means no errors
        cb(null,"uploads/");
    },
    //5 filename tells multer what to name the file
    filename:(req,file,cb)=>{
        //this is the most important part we make a unique filename
        //date.now() -is a unique timestamp we use
        //path.extname(file.originalname) gets the fiels orginal extension -it extracts the file orginal exxtension like .pdf
        //the final name will be something like: resume -168864000000.pdf like this the number from date.now and .pdf from path.extname(file.orginal name)
        const uniqueName=`resume-${Date.now()}${path.extname(file.originalname)}`;
        cb(null,uniqueName);
    },

});

//6 we create the upload middleware by comibing our storage engine 
//wtih a file filter-we can add this later to only allow pdfs
const upload=multer({
    storage:storage,
    //we can add file filter logic here later

});

//7 we export the upload middleware so our routes can use it
module.exports=upload;