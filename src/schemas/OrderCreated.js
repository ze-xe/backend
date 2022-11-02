const mongoose = require("mongoose");

const OrderCreatedSchema = new mongoose.Schema({
    txnId : String,
    blockNumber : Number,
    blockTimestamp : String,  
    id : String,
    pair : String,
    maker : String,
    amount : String,
    exchangeRate : Number,
    orderType : String,
   
},
{ timestamps: true }
);


module.exports = OrderCreatedSchema;