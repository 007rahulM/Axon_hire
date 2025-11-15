const mongoose = require("mongoose");

// create a new blueprint (Schema) for jobs
const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  // we can even link it to the admin who posted it
  // postedBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User'
  // }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

//export this router so server.js can use it
module.exports = mongoose.model("Job", jobSchema);