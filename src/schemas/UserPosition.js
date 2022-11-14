const mongoose = require("mongoose");

const UserPositionSchema = new mongoose.Schema({

    id : String,
    token : String,
    balance : String,
    inOrderBalance : String,
    chainId : Number
   
},
{ timestamps: true }
);


module.exports = UserPositionSchema;
