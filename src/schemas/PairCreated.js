const mongoose = require("mongoose");

const PairCreatedSchema = new mongoose.Schema({
    txnId : String,
    blockNumber : Number,
    blockTimestamp : String,  
    id : String,
    token0 : String,
    token1 : String,
    exchangeRateDecimals : String,
    minToken0Order : String,
    exchangeRate : Number,
    priceDiff : String
    
   
},
{ timestamps: true }
);


module.exports = PairCreatedSchema;