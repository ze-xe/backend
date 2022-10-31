const { TokenWithdrawn, TokenDeposited, PairCreated, OrderCreated, OrderExecuted } = require("../db");
const { tronWeb } = require("../utils");
const { handleToken } = require("./token");


async function handlePairCreated(data, argument) {

    try {

        const isDuplicateTxn = await PairCreated.findOne({
            txnId: argument.txnId,
            blockNumber: argument.blockNumber,
            blockTimestamp: argument.blockTimestamp
        });

        if (isDuplicateTxn) {
            return
        }

        argument.id = data[0];
        argument.token0 = tronWeb.address.fromHex(data[1]);
        argument.token1 = tronWeb.address.fromHex(data[2]);
        argument.exchangeRateDecimals = data[3];
        argument.minToken0Order = data[4];
        await handleToken(tronWeb.address.fromHex(data[1]));
        await handleToken(tronWeb.address.fromHex(data[2]));
        PairCreated.create(argument);
        console.log("Pair Created", tronWeb.address.fromHex(data[1]), tronWeb.address.fromHex(data[2]))


    }
    catch (error) {
        console.log("Error @ handlePairCreated", error)
    }

};


async function handleOrderCreated(data, argument) {

    try {

        const isDuplicateTxn = await OrderCreated.findOne({
            txnId: argument.txnId,
            blockNumber: argument.blockNumber,
            blockTimestamp: argument.blockTimestamp
        });

        if (isDuplicateTxn) {
            return
        }

        argument.id = data[0];
        argument.pair = data[1];
        argument.maker = tronWeb.address.fromHex(data[2])
        argument.amount = data[3];
        argument.exchangeRate = data[4];
        argument.orderType = data[5];

        OrderCreated.create(argument);
        console.log("Order Created", tronWeb.address.fromHex(data[2]), data[3])

    }
    catch (error) {
        console.log("Error @ handleOrderCreated", error)
    }

};

async function handleOrderExecuted(data, argument) {

    try {

        const isDuplicateTxn = await OrderExecuted.findOne({
            txnId: argument.txnId,
            blockNumber: argument.blockNumber,
            blockTimestamp: argument.blockTimestamp
        });

        if (isDuplicateTxn) {
            return
        }

        argument.id = data[0];
        argument.taker = tronWeb.address.fromHex(data[1]);
        argument.fillAmount = data[2];

        OrderExecuted.create(argument);

        console.log("Order Executed", tronWeb.address.fromHex(data[1]), data[2])

    }
    catch (error) {
        console.log("Error @ handleOrderExecuted", error)
    }

};


module.exports = { handlePairCreated, handleOrderCreated, handleOrderExecuted };