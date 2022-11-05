const { TokenWithdrawn, TokenDeposited, PairCreated, OrderCreated, OrderExecuted, UserPosition, OrderCancelled } = require("../db");
const { tronWeb } = require("../utils");
const { handleToken } = require("./token");
const Big = require('big.js')


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
        argument.exchangeRate = 0;
        argument.priceDiff = 0;
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
        };

        const isDuplicateId = await OrderCreated.findOne({ id: data[0] });

        if (isDuplicateId) {
            let delteDuplicateOrder = await OrderCreated.deleteOne({ _id: isDuplicateId._id })
            console.log("OrderDelete", tronWeb.address.fromHex(data[2]), data[3], data[1])
        }

        let id = data[0];
        let pair = data[1];
        let maker = tronWeb.address.fromHex(data[2]);
        let amount = Big(data[3]).toString();
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

            let findUserPosition = await UserPosition.findOne({ id: maker, token: token0 });

            let _id = findUserPosition._id.toString();

            let currentInOrderBalance = Number(findUserPosition.inOrderBalance ?? 0) + Number(amount);

            let currentBalance = Number(findUserPosition.balance) - Number(amount);

            await UserPosition.findOneAndUpdate(
                { _id: _id },
                { $set: { inOrderBalance: currentInOrderBalance, balance: currentBalance } }
            );

        }
        else if (data[5] == '1') {

            let findToken1 = await PairCreated.findOne({ id: pair });

            let token1 = findToken1.token1;

            let findUserPosition = await UserPosition.findOne({ id: maker, token: token1 });

            let token1Amount = (Number(amount) * (exchangeRate)) / (10 ** Number(findToken1.exchangeRateDecimals));

            let currentInOrderBalance = Number(findUserPosition.inOrderBalance ?? 0) + token1Amount;

            let _id = findUserPosition._id.toString();

            let currentBalance = Number(findUserPosition.balance) - token1Amount;

            await UserPosition.findOneAndUpdate(
                { _id: _id },
                { $set: { inOrderBalance: currentInOrderBalance, balance: currentBalance } }
            )
        }

        console.log("Order Created", maker, amount, id);

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
            blockTimestamp: argument.blockTimestamp,
            id: data[0]
        });

        if (isDuplicateTxn) {
            return
        }

        let id = data[0];
        let taker = tronWeb.address.fromHex(data[1]);
        let fillAmount = data[2];
        argument.id = id;
        argument.taker = taker;
        argument.fillAmount = fillAmount;

        let getOrderDetails = await OrderCreated.findOne({ id: id });

        let getPairDetails = await PairCreated.findOne({ id: getOrderDetails.pair });

        argument.exchangeRate = getOrderDetails.exchangeRate;
        argument.pair = getOrderDetails.pair;
        argument.exchangeRateDecimals = Number(getPairDetails.exchangeRateDecimals);
        argument.orderType = getOrderDetails.orderType;

        OrderExecuted.create(argument);

        let priceDiff = new Big(getOrderDetails.exchangeRate).minus(getPairDetails.exchangeRate).toString();

        await PairCreated.findOneAndUpdate(
            { _id: getPairDetails._id.toString() },
            { $set: { exchangeRate: getOrderDetails.exchangeRate, priceDiff: priceDiff } }
        )

        if (getOrderDetails.orderType == '0') {
            // for maker

            let token0 = getPairDetails.token0;

            let token1 = getPairDetails.token1;

            let getUserPosition0 = await UserPosition.findOne({ id: getOrderDetails.maker, token: token0 });

            let currentInOrderBalance0 = new Big(getUserPosition0.inOrderBalance ?? 0).minus(fillAmount).toString();

            await UserPosition.findOneAndUpdate(
                { id: getOrderDetails.maker, token: token0 },
                { $set: { inOrderBalance: currentInOrderBalance0 } }
            );

            let getUserPosition1 = await UserPosition.findOne({ id: getOrderDetails.maker, token: token1 });

            if (getUserPosition1) {
                // let currentBalance2 = Number(getUserPosition1.balance) + ((Number(fillAmount) * Number(getOrderDetails.exchangeRate)) / 10 ** Number(getPairDetails.exchangeRateDecimals));                            
                let currentBalance1 = new Big(getUserPosition1.balance).plus((Big(fillAmount).times(getOrderDetails.exchangeRate)).div(Big(10).pow(Number(getPairDetails.exchangeRateDecimals)))).toNumber();

                await UserPosition.findOneAndUpdate(
                    { id: getOrderDetails.maker, token: token1 },
                    { $set: { balance: currentBalance1 } }
                )
            }

            else {
                let temp = {
                    id: getOrderDetails.maker,
                    token: token1,
                    balance: ((Number(fillAmount) * Number(getOrderDetails.exchangeRate)) / 10 ** Number(getPairDetails.exchangeRateDecimals)),
                    inOrderBalance: "0"
                }

                UserPosition.create(temp)
            }

            // for taker

            let getUserPositionTaker0 = await UserPosition.findOne({ id: taker, token: token0 });

            if (getUserPositionTaker0) {

                let currentBalanceTaker0 = new Big(getUserPositionTaker0.balance).plus(fillAmount);

                await UserPosition.findOneAndUpdate(
                    { id: taker, token: token0 },
                    { $set: { balance: currentBalanceTaker0 } }
                );

            }
            else {

                let temp = {
                    id: taker,
                    token: token0,
                    balance: fillAmount,
                    inOrderBalance: '0'
                }
                UserPosition.create(temp)
            }

            let getUserPositionTaker1 = await UserPosition.findOne({ id: taker, token: token1 });

            let currentBalanceTaker1 = Number(getUserPositionTaker1.balance ?? 0) - ((Number(fillAmount) * Number(getOrderDetails.exchangeRate)) / 10 ** Number(getPairDetails.exchangeRateDecimals));

            await UserPosition.findOneAndUpdate(
                { id: taker, token: token1 },
                { $set: { balance: currentBalanceTaker1 } }
            )

            let currentFillAmount = new Big(getOrderDetails.amount).minus(fillAmount).toString();

            if (Number(currentFillAmount) < Number(getPairDetails.minToken0Order)) {
                await OrderCreated.findByIdAndDelete({ _id: getOrderDetails._id.toString() });
            }
            else {
                await OrderCreated.findOneAndUpdate(
                    { _id: getOrderDetails._id.toString() },
                    { amount: currentFillAmount }
                )
            }

        }
        else if (getOrderDetails.orderType == '1') {
            // for maker
            let token0 = getPairDetails.token0;

            let token1 = getPairDetails.token1;

            let getUserPosition0 = await UserPosition.findOne({ id: getOrderDetails.maker, token: token0 });

            if (getUserPosition0) {

                let currentBalance0 = Number(getUserPosition0.balance) + Number(fillAmount);

                await UserPosition.findOneAndUpdate(
                    { id: getOrderDetails.maker, token: token0 },
                    { $set: { balance: currentBalance0 } }
                );
            }
            else {
                let temp = {
                    id: getOrderDetails.maker,
                    token: token0,
                    balance: fillAmount
                }

                UserPosition.create(temp)
            }

            let getUserPosition1 = await UserPosition.findOne({ id: getOrderDetails.maker, token: token1 });

            let currentBalance1 = Number(getUserPosition1.balance ?? 0) - ((Number(fillAmount) * Number(getOrderDetails.exchangeRate)) / 10 ** Number(getPairDetails.exchangeRateDecimals));

            await UserPosition.findOneAndUpdate(
                { id: getOrderDetails.maker, token: token1 },
                { $set: { balance: currentBalance1 } }
            )

            // for taker
            let getUserPositionTaker0 = await UserPosition.findOne({ id: taker, token: token0 });

            let currentBalanceTaker0 = Number(getUserPositionTaker0.balance ?? 0) - Number(fillAmount);

            await UserPosition.findOneAndUpdate(
                { id: taker, token: token0 },
                { $set: { balance: currentBalanceTaker0 } }
            );

            let getUserPositionTaker1 = await UserPosition.findOne({ id: taker, token: token1 });

            if (getUserPositionTaker1) {

                let currentBalanceTaker1 = Number(getUserPositionTaker1.balance) + ((Number(fillAmount) * Number(getOrderDetails.exchangeRate)) / 10 ** Number(getPairDetails.exchangeRateDecimals));

                await UserPosition.findOneAndUpdate(
                    { id: taker, token: token1 },
                    { $set: { balance: currentBalanceTaker1 } }
                )
            }
            else {
                let temp = {
                    id: taker,
                    token: token1,
                    balance: ((Number(fillAmount) * Number(getOrderDetails.exchangeRate)) / 10 ** Number(getPairDetails.exchangeRateDecimals))
                }

                UserPosition.create(temp)
            }

            let currentFillAmount = new Big(getOrderDetails.amount).minus(fillAmount).toString();

            if ((Number(currentFillAmount) < Number(getPairDetails.minToken0Order))) {
                await OrderCreated.findByIdAndDelete({ _id: getOrderDetails._id.toString() });
            }
            else {
                await OrderCreated.findOneAndUpdate(
                    { _id: getOrderDetails._id.toString() },
                    { amount: currentFillAmount }
                )
            }


        }

        console.log("Order Executed", taker, fillAmount, id)

    }
    catch (error) {
        console.log("Error @ handleOrderExecuted", error)
    }

};

async function handleOrderUpdated(data, argument) {
    try {

        const isDuplicateTxn = await OrderCreated.findOne({
            txnId: argument.txnId,
            blockNumber: argument.blockNumber,
            blockTimestamp: argument.blockTimestamp,
            amount: data[1]
        });

        if (isDuplicateTxn) {
            return
        }

        let getOrderDoc = await OrderCreated.findOne({ id: data[0] });

        if (!getOrderDoc) {
            return
        };

        if (data[1] == '0') {
            await OrderCancelled.create({
                txnId: argument.txnId,
                blockNumber: argument.blockNumber,
                blockTimestamp: argument.blockTimestamp,
                id: getOrderDoc.id,
                pair: getOrderDoc.pair,
                maker: getOrderDoc.maker,
                amount: getOrderDoc.amount,
                exchangeRate: getOrderDoc.exchangeRate,
                orderType: getOrderDoc.orderType,
            });
            await OrderCreated.deleteOne({ _id: getOrderDoc._id.toString() });
            console.log("Order cancelled", data[1], data[0])
            return
        }

        await OrderCreated.updateOne(
            { _id: getOrderDoc._id },
            {
                $set: {
                    txnId: argument.txnId,
                    blockNumber: argument.blockNumber,
                    blockTimestamp: argument.blockTimestamp,
                    amount: data[1]
                }
            }
        )
        console.log("Order Updated", data[1], data[0])

    }
    catch (error) {
        console.log("Error @ handleOrderUpdated", error)
    }
}


module.exports = { handlePairCreated, handleOrderCreated, handleOrderExecuted, handleOrderUpdated };