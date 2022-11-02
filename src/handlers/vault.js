const { TokenWithdrawn, TokenDeposited, UserPosition } = require("../db");
const { tronWeb } = require("../utils");


async function handleTokenDeposited(data, argument) {

    try {

        const isDuplicateTxn = await TokenDeposited.findOne({
            txnId: argument.txnId,
            blockNumber: argument.blockNumber,
            blockTimestamp: argument.blockTimestamp
        });

        if (isDuplicateTxn) {
            return
        }

        argument.id = tronWeb.address.fromHex(data[0]);
        argument.token = tronWeb.address.fromHex(data[1]);
        argument.amount = data[2];

        TokenDeposited.create(argument);


        let isUserPositionExist = await UserPosition.findOne({ id: tronWeb.address.fromHex(data[0]), token: tronWeb.address.fromHex(data[1]) });

        if (isUserPositionExist) {
            let currentBalance = Number(isUserPositionExist.balance) + Number(data[2]);
            await UserPosition.findOneAndUpdate(
                { id: tronWeb.address.fromHex(data[0]), token: tronWeb.address.fromHex(data[1]) },
                { $set: { balance: currentBalance } }
            )
        } else {
            let temp = {
                id: tronWeb.address.fromHex(data[0]),
                token: tronWeb.address.fromHex(data[1]),
                balance: data[2],
                inOrderBalance : '0'
            };

            UserPosition.create(temp)
        }

        console.log("Token Deposited", tronWeb.address.fromHex(data[0]), data[2],  tronWeb.address.fromHex(data[1]));
    }
    catch (error) {
        console.log("Error @ handleTokenDeposited", error)
    }

};


async function handleTokenWithdrawn(data, argument) {

    try {

        const isDuplicateTxn = await TokenWithdrawn.findOne({
            txnId: argument.txnId,
            blockNumber: argument.blockNumber,
            blockTimestamp: argument.blockTimestamp
        });

        if (isDuplicateTxn) {
            return
        }

        argument.id = tronWeb.address.fromHex(data[0]);
        argument.token = tronWeb.address.fromHex(data[1]);
        argument.amount = data[2];

        TokenWithdrawn.create(argument);
       

        let isUserPositionExist = await UserPosition.findOne({ id: tronWeb.address.fromHex(data[0]), token: tronWeb.address.fromHex(data[1]) });

        if (isUserPositionExist) {
            let currentBalance = Number(isUserPositionExist.balance) - Number(data[2]);
            await UserPosition.findOneAndUpdate(
                { id: tronWeb.address.fromHex(data[0]), token: tronWeb.address.fromHex(data[1]) },
                { $set: { balance: currentBalance } }
            )
        } else {
            let temp = {
                id: tronWeb.address.fromHex(data[0]),
                token: tronWeb.address.fromHex(data[1]),
                balance: -data[2],
                inOrderBalance : '0'
            };

            UserPosition.create(temp)
        }
        console.log("Token Withrawn",  tronWeb.address.fromHex(data[0]), data[2],  tronWeb.address.fromHex(data[1]))

    }
    catch (error) {
        console.log("Error @ handleTokenDeposited", error)
    }

};


module.exports = { handleTokenDeposited, handleTokenWithdrawn };