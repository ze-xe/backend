const mongoose = require('mongoose');


const SyncSchema = require('./schemas/Sync.js');
const TokenDepositedSchema = require('./schemas/TokenDeposited');
const TokenWithdrawnSchema = require('./schemas/TokenWithdrawn');
const PairCreatedSchema = require('./schemas/PairCreated');
const OrderCreatedSchema = require('./schemas/OrderCreated');
const OrderExecutedSchema = require('./schemas/OrderExecuted');
const TokenSchema = require('./schemas/Token');
const UserPositionSchema = require('./schemas/UserPosition');



const Sync = mongoose.model("Sync", SyncSchema);
const TokenDeposited = mongoose.model("TokenDeposited", TokenDepositedSchema);
const TokenWithdrawn = mongoose.model("TokenWithdrwn", TokenWithdrawnSchema);
const PairCreated = mongoose.model("PairCreated", PairCreatedSchema);
const OrderCreated = mongoose.model("OrderCreated", OrderCreatedSchema);
const OrderExecuted = mongoose.model('OrderExecuted', OrderExecutedSchema);
const Token = mongoose.model("Token", TokenSchema);
const UserPosition= mongoose.model("UserPosition", UserPositionSchema)


require("dotenv").config();

// async function connect() {
//     console.log(process.env.MONGO_URL);
//     mongoose.connect(process.env.MONGO_URL, {
//     useNewUrlParser: true
// }) .then(() => console.log("MongoDb is connected"))
// .catch(err => console.log(err))

// }


async function connect() {

    mongoose.connect("mongodb+srv://g-2-project-1:MvD9HwLH72zL105K@cluster0.j1yrl.mongodb.net/ze-xe-1?retryWrites=true&w=majority", {
        useNewUrlParser: true
    })
        .then(() => console.log("MongoDb is connected"))
        .catch(err => console.log(err))
}





module.exports = { Sync, connect, TokenDeposited, TokenWithdrawn, PairCreated, OrderCreated, OrderExecuted, Token, UserPosition }
