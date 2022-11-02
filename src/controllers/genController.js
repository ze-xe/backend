const { PairCreated, Token, connect, OrderCreated } = require("../db")





async function getAllPairDetails(req, res) {

    try {

        let allPairs = await PairCreated.find();

        let data = []

        for (let i in allPairs) {

            let temp = {
                id: allPairs[i].id,
                exchangeRate: allPairs[i].exchangeRate,
                exchangeRateDecimals : allPairs[i].exchangeRateDecimals
            }
            let token0 = await Token.findOne({ id: allPairs[i].token0 }).select({ name: 1, symbol: 1, decimals: 1, _id: 0, id: 1 }).lean();
            let token1 = await Token.findOne({ id: allPairs[i].token1 }).select({ name: 1, symbol: 1, decimals: 1, _id: 0, id: 1 }).lean();
            temp.tokens = [token0, token1];
            // temp.token1 = token1
            data.push(temp)

        };

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
                                    decimals: 1
                                }
                            }

                        ],
                        as: "token"
                    }

                },
                {
                    $project:
                    {
                        _id: 0,
                        id: 1,
                        exchangeRate: 1,
                        tokens: "$token"

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

        if (getOrderDetails.length > 0) {
            data = {
                pair: getOrderDetails[0].pair,
                decimals: getOrderDetails[0].decimals[0],
                sellOrders: mapSell,
                buyOrders: mapBuy
            }
        } else {
            data = []
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


async function _getMatchedOrders() {

    try {
        connect()
        let pairId = "8d01f5b4bbb4037e9f21fada9f44273338d9cbc46128b370f3ebafccde8ad869";
        let exchangeRate = "1500 0000";
        let amount = "5000000000000000000";
        let orderType = "1";

        if (orderType == '1') {
            orderType = '0';
        }
        else if (orderType == '0') {
            orderType = '1';
        }

        const getMatchedDoc = await OrderCreated.find({pair : pairId, exchangeRate : {$lte : exchangeRate}, orderType : orderType }).select({id : 1, amount : 1, exchangeRate : 1, _id : 0}).lean();
        console.log(getMatchedDoc)

    }
    catch (error) {
        console.log("Error @ getMatchedOrders", error);
        return res.status(500).send({ status: false, error: error.message });
    }
}


// getMatchedOrders()


async function getMatchedOrders(req, res) {

    try {
       
        let pairId = req.params.pairId;
        let exchangeRate = req.query.exchange_rate;
        let orderType = req.query.order_type;
        let amount = Number(req.query.amount);

        if (orderType == '1') {
            orderType = '0';
        }
        else if (orderType == '0') {
            orderType = '1';
        }

        const getMatchedDoc = await OrderCreated.find({pair : pairId, exchangeRate : {$lte : Number(exchangeRate)}, orderType : orderType }).sort({exchangeRate : 1}).select({id : 1, amount : 1, exchangeRate : 1, _id : 0}).lean();

        let data = [];
        let currAmount = 0
        for(let i in getMatchedDoc ){

            if(currAmount >= amount){
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
}

module.exports = { getAllPairDetails, fetchOrders, getAllTokens, getMatchedOrders };