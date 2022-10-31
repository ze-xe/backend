const mongoose = require("mongoose");

const exchangeSyncSchema = new mongoose.Schema({

    lastBlockTimestampExchange : {type : Number, default : 0},
    lastBlockTimestampVault : {type : Number, default : 0},
    blockNumberExchange : Number,    
    blockNumberVault : Number
   
},
{ timestamps: true }
);

module.exports = exchangeSyncSchema;