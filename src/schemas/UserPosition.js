const mongoose = require("mongoose");

const UserPositionSchema = new mongoose.Schema({

    id : String,
    token : String,
    balance : String,
    InOrderBalance : String
   
},
{ timestamps: true }
);


module.exports = UserPositionSchema;
