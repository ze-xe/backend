const mongoose = require("mongoose");

const OrderExecutedSchema = new mongoose.Schema({
    txnId : String,
    blockNumber : Number,
    blockTimestamp : Number,  
    id : String,
    taker : String,
    fillAmount : String,
    pair : String,
    exchangeRate : Number,
    exchangeRateDecimals : Number,
    orderType: String,
    chainId : Number
    
   
},
{ timestamps: true }
);


module.exports = OrderExecutedSchema;