const mongoose = require("mongoose");

const OrderExecutedSchema = new mongoose.Schema({
    txnId : String,
    blockNumber : Number,
    blockTimestamp : String,  
    id : String,
    taker : String,
    fillAmount : String,
   
},
{ timestamps: true }
);


module.exports = OrderExecutedSchema;