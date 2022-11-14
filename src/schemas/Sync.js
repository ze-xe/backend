const mongoose = require("mongoose");

const exchangeSyncSchema = new mongoose.Schema({

    blockNumberExchange : Number,    
    blockNumberVault : Number,
    pageNumberExchange : Number,
    pageNumberVault : Number,
    chainId : Number
   
},
{ timestamps: true }
);

module.exports = exchangeSyncSchema;