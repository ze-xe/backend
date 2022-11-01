const mongoose = require("mongoose");

const UserPositionSchema = new mongoose.Schema({

    id : String,
    token : String,
    balance : String,
    inOrderBalance : String
   
},
{ timestamps: true }
);


module.exports = UserPositionSchema;
