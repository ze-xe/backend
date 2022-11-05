const mongoose = require("mongoose");

const OrderCancelledSchema = new mongoose.Schema({
    txnId : String,
    blockNumber : Number,
    blockTimestamp : String,  
    id : {type:String},
    pair : String,
    maker : String,
    amount : String,
    exchangeRate : Number,
    orderType : String,
   
},
{ timestamps: true }
);


module.exports = OrderCancelledSchema;