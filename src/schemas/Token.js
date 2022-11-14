const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
   
    id : String,
    name : String,
    symbol : String,
    price : String,
    decimals :String,
    chainId : Number
   
},
{ timestamps: true }
);


module.exports = TokenSchema;