const mongoose = require("mongoose");

const TokenWithdrawnSchema = new mongoose.Schema({
    txnId : String,
    blockNumber : Number,
    blockTimestamp : String,  
    id : String,
    token : String,
    amount : String
   
},
{ timestamps: true }
);


module.exports = TokenWithdrawnSchema;
