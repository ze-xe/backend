const mongoose = require("mongoose");

const OrderCreatedSchema = new mongoose.Schema({
    txnId : String,
    blockNumber : Number,
    blockTimestamp : String,  
    id : {type:String, unique : true},
    pair : String,
    maker : String,
    amount : String,
    exchangeRate : Number,
    orderType : String,
    chainId : Number,
   
},
{ timestamps: true }
);


module.exports = OrderCreatedSchema;