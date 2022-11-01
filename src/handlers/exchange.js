const { TokenWithdrawn, TokenDeposited, PairCreated, OrderCreated, OrderExecuted, UserPosition } = require("../db");
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

        let id = data[0];
        let pair = data[1];
        let maker = tronWeb.address.fromHex(data[2]);
        let amount = data[3];
        let exchangeRate = data[4];
        let orderType = data[5];
        argument.id = id;
        argument.pair = pair;
        argument.maker = maker;
        argument.amount = amount;
        argument.exchangeRate = exchangeRate;
        argument.orderType = orderType;

        OrderCreated.create(argument);

        if (data[5] == '0') {

            let findToken0 = await PairCreated.findOne({ id: pair });

            let token0 = findToken0.token0;

            let findUserPosition = await UserPosition.findOne({ id : maker, token: token0 });

            let _id = findUserPosition._id.toString();

            let currentInOrderBalance = Number(findUserPosition.InOrderBalance ?? 0) + Number(amount);

            let currentBalance = Number(findUserPosition.balance) - Number(amount);

            await UserPosition.updateOne(
                { _id: _id },
                { $set: { InOrderBalance: currentInOrderBalance, balance: currentBalance } }
            );

        }
        else if (data[5] == '1') {

            let findToken1 = await PairCreated.findOne({ id: pair });

            let token1 = findToken1.token1;

            let findUserPosition = await UserPosition.findOne({ id: maker, token: token1 });

            let token1Amount = (Number(amount) * (exchangeRate)) / (10 ** Number(findToken1.exchangeRateDecimals));

            let currentInOrderBalance = Number(findUserPosition.InOrderBalance ?? 0) + token1Amount;

            let _id = findUserPosition._id.toString();

            let currentBalance = Number(findUserPosition.balance) - token1Amount;

            await UserPosition.updateOne(
                { _id: _id },
                { $set: { InOrderBalance: currentInOrderBalance, balance: currentBalance } }
            )
        }

        console.log("Order Created", maker, amount);

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