const { PairCreated, Token, connect, OrderCreated, OrderExecuted, TokenDeposited, TokenWithdrawn } = require("../db");
const Big = require('big.js');



async function getAllPairDetails(req, res) {

    try {

        let allPairs = await PairCreated.find().lean();

        let data = []

        let promiseTokens = [];

        for (let i in allPairs) {


            let token0 = Token.findOne({ id: allPairs[i].token0 }).select({ name: 1, symbol: 1, decimals: 1, _id: 0, id: 1 }).lean();
            let token1 = Token.findOne({ id: allPairs[i].token1 }).select({ name: 1, symbol: 1, decimals: 1, _id: 0, id: 1 }).lean();
            promiseTokens.push(token0, token1)
        };

        promiseTokens = await Promise.all(promiseTokens);

        for (let i in allPairs) {
            let temp = {

                id: allPairs[i].id,
                exchangeRate: allPairs[i].exchangeRate,
                exchangeRateDecimals: allPairs[i].exchangeRateDecimals,
                priceDiff: allPairs[i].priceDiff,
                minToken0Order: allPairs[i].minToken0Order
            }

            let token0 = promiseTokens[2 * i];
            let token1 = promiseTokens[2 * i + 1];
            temp.tokens = [token0, token1];
            data.push(temp)
        }

        res.status(200).send({ status: true, data: data });

    }
    catch (error) {
        console.log("Error @ getAllPairDetails", error);
        res.status(500).send({ status: false, error: error.message });
    }
};

async function _getAllPairDetails(req, res) {

    try {

        let getPairDetails = await PairCreated.aggregate(
            [
                {
                    $lookup: {
                        from: 'tokens',
                        let: { token0: "$token0", token1: "$token1" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $or: [
                                            { $eq: ["$id", "$$token0"] },
                                            { $eq: ["$id", "$$token1"] }

                                        ]

                                    }

                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    id: 1,
                                    name: 1,
                                    symbol: 1,
                                    decimals: 1,
                                    token0: 1
                                }
                            }

                        ],
                        as: "tokens"
                    }

                },
                {
                    $project:
                    {
                        _id: 0,
                        id: 1,
                        exchangeRate: 1,
                        tokens: 1

                    }
                }


            ]
        )
        return res.status(200).send({ status: true, data: getPairDetails });

    }
    catch (error) {
        console.log("Error @ getAllPairDetails", error);
        return res.status(500).send({ status: false, error: error.message });
    }
};

async function fetchOrders(req, res) {
    try {

        let pairId = req.params.pairId;

        if (!pairId) {

            return res.status(400).send({ status: false, message: "Please provide pairId" });

        };

        const isPairIdExist = await PairCreated.findOne({ id: pairId });

        if (!isPairIdExist) {
            return res.status(404).send({ status: false, message: "Please provide valid pairId" });
        }

        let getOrderDetails = await OrderCreated.aggregate(
            [
                {
                    $match: {
                        pair: pairId
                    }
                },
                {
                    $lookup: {
                        from: "paircreateds",
                        localField: 'pair',
                        foreignField: "id",
                        as: "pairDetails"
                    }
                },
                {
                    $project: {
                        _id: 0,
                        pair: 1,
                        amount: 1,
                        exchangeRate: 1,
                        decimals: "$pairDetails.exchangeRateDecimals",
                        orderType: 1
                    }
                },
                {
                    $sort: { "exchangeRate": 1 }
                }

            ]
        );

        let mapSell = {};
        let mapBuy = {}
        for (let i in getOrderDetails) {

            if (!mapSell[`${getOrderDetails[i].exchangeRate}`] && getOrderDetails[i].orderType == "0") {

                mapSell[`${getOrderDetails[i].exchangeRate}`] = getOrderDetails[i].amount;

            }
            else if (mapSell[`${getOrderDetails[i].exchangeRate}`] && getOrderDetails[i].orderType == "0") {

                mapSell[`${getOrderDetails[i].exchangeRate}`] = `${Number(mapSell[`${getOrderDetails[i].exchangeRate}`]) + Number(getOrderDetails[i].amount)}`;
            }
            else if (!mapBuy[`${getOrderDetails[i].exchangeRate}`] && getOrderDetails[i].orderType == "1") {

                mapBuy[`${getOrderDetails[i].exchangeRate}`] = getOrderDetails[i].amount;
            }
            else if (mapBuy[`${getOrderDetails[i].exchangeRate}`] && getOrderDetails[i].orderType == "1") {

                mapBuy[`${getOrderDetails[i].exchangeRate}`] = `${Number(mapBuy[`${getOrderDetails[i].exchangeRate}`]) + Number(getOrderDetails[i].amount)}`;
            }

        };

        let data;

        let sellOrders = [];

        let sellEntries = Object.entries(mapSell);

        for (let i in sellEntries) {
            let temp = {
                exchangeRate: Number(sellEntries[i][0]),
                amount: sellEntries[i][1]
            }
            sellOrders.push(temp)
        }

        let buyOrders = [];

        let buyEntries = Object.entries(mapBuy);

        for (let i in buyEntries) {
            let temp = {
                exchangeRate: Number(buyEntries[i][0]),
                amount: buyEntries[i][1]
            }
            buyOrders.push(temp)
        }

        buyOrders = buyOrders.sort((a, b) => (b.exchangeRate - a.exchangeRate));
        sellOrders = sellOrders.sort((a, b) => (a.exchangeRate - b.exchangeRate));


        if (getOrderDetails.length > 0) {
            data = {
                pair: getOrderDetails[0].pair,
                decimals: getOrderDetails[0].decimals[0],
                sellOrders: sellOrders,
                buyOrders: buyOrders
            }
        } else {
            data = {
                pair: isPairIdExist.id,
                decimals: isPairIdExist.exchangeRateDecimals,
                sellOrders: [],
                buyOrders: []
            }
        }

        return res.status(200).send({ status: true, data: data });
    }
    catch (error) {
        console.log("Error @ fetchOrders", error);
        return res.status(500).send({ status: false, error: error.message });
    }
};


async function getAllTokens(req, res) {

    try {

        const getAllTokens = await Token.find().select({ _id: 0, name: 1, symbol: 1, decimals: 1, id: 1 }).lean();

        return res.status(200).send({ status: true, data: getAllTokens });

    }
    catch (error) {
        console.log("Error @ getAllTokens", error);
        return res.status(500).send({ status: false, error: error.message });
    }

};



async function getMatchedOrders(req, res) {

    try {

        let pairId = req.params.pairId;
        let exchangeRate = req.query.exchange_rate;
        let orderType = req.query.order_type;
        let amount = Number(req.query.amount);



        let getMatchedDoc;
        if (orderType == '1') {
            getMatchedDoc = await OrderCreated.find({ pair: pairId, exchangeRate: { $lte: Number(exchangeRate) }, orderType: '0' }).sort({ exchangeRate: 1 }).select({ id: 1, amount: 1, exchangeRate: 1, _id: 0 }).lean();
        }
        else if (orderType == '0') {
            getMatchedDoc = await OrderCreated.find({ pair: pairId, exchangeRate: { $gte: Number(exchangeRate) }, orderType: '1' }).sort({ exchangeRate: -1 }).select({ id: 1, amount: 1, exchangeRate: 1, _id: 0 }).lean();
        }


        let data = [];
        let currAmount = 0
        for (let i in getMatchedDoc) {

            if (currAmount >= amount) {
                break;
            }

            currAmount += Number(getMatchedDoc[i].amount);
            data.push(getMatchedDoc[i]);

        }

        return res.status(200).send({ status: true, data: data });
    }
    catch (error) {
        console.log("Error @ getMatchedOrders", error);
        return res.status(500).send({ status: false, error: error.message });
    }
};


async function getPairPriceTrend(req, res) {

    try {

        let pairId = req.params.pairId;
        let interval = Number(req.query.interval);

        if (isNaN(interval) == true || interval < 60000) {
            return res.status(400).send({ status: false, message: `interval ${interval} must be valid number greater than 300000` });
        }

        let data = await OrderExecuted.find({ pair: pairId }).sort({ blockTimestamp: 1, createdAt: 1 }).lean()

        if (data.length == 0) {

            let isPairExist = await PairCreated.findOne({ id: pairId });

            if (!isPairExist) {
                return res.status(400).send({ status: false, message: `pairId ${pairId} does not exist` });
            }
            return res.status(200).send({ status: true, data: [] });
        }

        let exchangeRatesTrend = [];
        let volumeTrend = [];

        let min = Infinity;
        let max = 0;
        let open = data[0].exchangeRate;
        let close = data[0].exchangeRate;
        let currTimestamp = data[0].blockTimestamp;
        let endTimestamp;
        let volume = 0;

        for (let i in data) {

            if (data[i].blockTimestamp <= currTimestamp + interval) {

                if (data[i].exchangeRate > max) {
                    max = data[i].exchangeRate;
                }

                if (data[i].exchangeRate < min) {
                    min = data[i].exchangeRate
                }

                close = data[i].exchangeRate;
                endTimestamp = data[i].blockTimestamp;
                volume = Big(volume).plus(data[i].fillAmount).toString();

                if (i == data.length - 1) {

                    let temp = {
                        time: currTimestamp / 1000,
                        open: Big(open).div(Big(10).pow(data[i].exchangeRateDecimals)).toString(),
                        high: Big(max).div(Big(10).pow(data[i].exchangeRateDecimals)).toString(),
                        close: Big(close).div(Big(10).pow(data[i].exchangeRateDecimals)).toString(),
                        low: Big(min).div(Big(10).pow(data[i].exchangeRateDecimals)).toString(),
                        // timeE: endTimestamp,
                        // volume: Big(volume).div(Big(10).pow(18)).toString()
                    }
                    exchangeRatesTrend.push(temp);
                    volumeTrend.push({ time: currTimestamp / 1000, value: Big(volume).div(Big(10).pow(18)).toString() })

                }
            }
            else {

                let temp = {
                    time: currTimestamp / 1000,
                    open: Big(open).div(Big(10).pow(data[i].exchangeRateDecimals)).toString(),
                    high: Big(max).div(Big(10).pow(data[i].exchangeRateDecimals)).toString(),
                    close: Big(close).div(Big(10).pow(data[i].exchangeRateDecimals)).toString(),
                    low: Big(min).div(Big(10).pow(data[i].exchangeRateDecimals)).toString(),
                    // timeE: endTimestamp,
                    // volume: Big(volume).div(Big(10).pow(18)).toString()
                }
                exchangeRatesTrend.push(temp);
                volumeTrend.push({ time: currTimestamp / 1000, value: Big(volume).div(Big(10).pow(18)).toString() });

                min = data[i].exchangeRate;
                max = data[i].exchangeRate;
                open = data[i].exchangeRate;
                close = data[i].exchangeRate;
                currTimestamp = data[i].blockTimestamp;
                endTimestamp = data[i].blockTimestamp;
                volume = data[i].fillAmount;

                if (i == data.length - 1) {

                    // let temp = {
                    //     open: Big(open).div(Big(10).pow(data[i].exchangeRateDecimals)).toString(),
                    //     close: Big(close).div(Big(10).pow(data[i].exchangeRateDecimals)).toString(),
                    //     high: Big(max).div(Big(10).pow(data[i].exchangeRateDecimals)).toString(),
                    //     low: Big(min).div(Big(10).pow(data[i].exchangeRateDecimals)).toString(),
                    //     timeS: currTimestamp,
                    //     timeE: endTimestamp,
                    //     volume: Big(volume).div(Big(10).pow(18)).toString()
                    // }
                    let temp = {
                        time: currTimestamp / 1000,
                        open: Big(open).div(Big(10).pow(data[i].exchangeRateDecimals)).toString(),
                        high: Big(max).div(Big(10).pow(data[i].exchangeRateDecimals)).toString(),
                        close: Big(close).div(Big(10).pow(data[i].exchangeRateDecimals)).toString(),
                        low: Big(min).div(Big(10).pow(data[i].exchangeRateDecimals)).toString(),
                        // timeE: endTimestamp,
                        // volume: Big(volume).div(Big(10).pow(18)).toString()
                    }
                    exchangeRatesTrend.push(temp);
                    volumeTrend.push({ time: currTimestamp / 1000, value: Big(volume).div(Big(10).pow(18)).toString() });

                }

            }
        };

        let result = {
            exchangeRate: exchangeRatesTrend,
            volume: volumeTrend
        }
        return res.status(200).send({ status: true, data: result });
    }

    catch (error) {
        console.log("Error @ getPriceDetails", error);
        return res.status(500).send({ status: false, error: error.message });
    }
};


async function getUserPlacedOrders(req, res) {

    try {

        let maker = req.params.maker;
        let pairId = req.params.pairId;

        const getMakerOrders = await OrderCreated.find({ maker: maker, pair: pairId }).sort({ blockTimestamp: -1, createdAt: -1 }).select({ orderType: 1, exchangeRate: 1, amount: 1, _id: 0, id: 1 }).lean()

        return res.status(200).send({ status: true, data: getMakerOrders });
    }
    catch (error) {
        console.log("Error @ getUserPlacedOrders", error);
        return res.status(500).send({ status: false, error: error.message });
    }


}

async function getUserOrderHistory(req, res) {
    try {

        let taker = req.params.taker;
        let pairId = req.params.pairId;

        const getOrderHistory = await OrderExecuted.find({ taker: taker, pair: pairId }).sort({ blockTimestamp: -1, createdAt: -1 }).select({ orderType: 1, exchangeRate: 1, fillAmount: 1, _id: 0 }).lean()

        return res.status(200).send({ status: true, data: getOrderHistory });
    }
    catch (error) {
        console.log("Error @ getUserOrderHistory", error);
        return res.status(500).send({ status: false, error: error.message });
    }
};

async function userDepositsAndWithdraws(req, res) {

    try {

        let userId = req.params.id;

        let deposits = TokenDeposited.find({ id: userId }).sort({ blockTimestamp: -1, createdAt: -1 }).select({ token: 1, amount: 1, _id: 0, blockTimestamp: 1, txnId: 1 }).lean();
        let withdraws = TokenWithdrawn.find({ id: userId }).sort({ blockTimestamp: -1, createdAt: -1 }).select({ token: 1, amount: 1, _id: 0, blockTimestamp: 1, txnId: 1 }).lean();

        let promise = await Promise.all([deposits, withdraws]);

        let data = {
            deposits: promise[0],
            withdraws: promise[1]
        };

        return res.status(200).send({ status: true, data: data });
    }
    catch (error) {
        console.log("Error @ userDepositsAndWithdraws", error);
        return res.status(500).send({ status: false, error: error.message });
    }
};

async function getPairOrderExecutedHistory(req, res) {
    try {

        let pairId = req.params.id;

        let getPairOrderHistory = await OrderExecuted.find({pair : pairId}).sort({ blockTimestamp: -1, createdAt: -1}).select({fillAmount: 1, exchangeRate : 1, orderType : 1, _id : 0}).lean();

        return res.status(200).send({ status: true, data: getPairOrderHistory });

    }
    catch (error) {
        console.log("Error @ getPairOrderExecutedHistory", error);
        return res.status(500).send({ status: false, error: error.message });
    }
}


module.exports = { getAllPairDetails, fetchOrders, getAllTokens, getMatchedOrders, getPairPriceTrend, getUserPlacedOrders, getUserOrderHistory, userDepositsAndWithdraws, getPairOrderExecutedHistory };


// let data = [
//     {
//         exchangeRate: 1500,
//         pair: "abc",
//         amount: 200,
//         timestamp: 1667462562000
//     },
//     {
//         exchangeRate: 1510,
//         pair: "abc",
//         amount: 10,
//         timestamp: 1667462622000
//     },
//     {
//         exchangeRate: 1505,
//         pair: "abc",
//         amount: 20,
//         timestamp: 1667462682000
//     },
//     {
//         exchangeRate: 1490,
//         pair: "abc",
//         amount: 50,
//         timestamp: 1667462742000
//     },
//     {
//         exchangeRate: 1550,
//         pair: "abc",
//         amount: 30,
//         timestamp: 1667462802000
//     },
//     {
//         exchangeRate: 1510,
//         pair: "abc",
//         amount: 40,
//         timestamp: 1667462862000
//     },
//     {
//         exchangeRate: 1530,
//         pair: "abc",
//         amount: 50,
//         timestamp: 1667462922000
//     },
//     {
//         exchangeRate: 1480,
//         pair: "abc",
//         amount: 70,
//         timestamp: 1667462982000
//     },
//     {
//         exchangeRate: 1495,
//         pair: "abc",
//         amount: 85,
//         timestamp: 1667463042000
//     },
//     {
//         exchangeRate: 1515,
//         pair: "abc",
//         amount: 95,
//         timestamp: 1667463102000
//     },
//     {
//         exchangeRate: 1503,
//         pair: "abc",
//         amount: 5,
//         timestamp: 1667463162000
//     },
//     {
//         exchangeRate: 1509,
//         pair: "abc",
//         amount: 15,
//         timestamp: 1667463222000
//     },
//     {
//         exchangeRate: 1520,
//         pair: "abc",
//         amount: 2,
//         timestamp: 1667463282000
//     },
// ]