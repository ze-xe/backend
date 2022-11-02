const { PairCreated, Token, connect, OrderCreated } = require("../db");
const { all } = require("../routes/route");





async function getAllPairDetails(req, res) {

    try {

        let allPairs = await PairCreated.find().lean();

        let data = []

        let promiseTokens = [];

        for (let i in allPairs) {

           
            let token0 =  Token.findOne({ id: allPairs[i].token0 }).select({ name: 1, symbol: 1, decimals: 1, _id: 0, id: 1 }).lean();
            let token1 =  Token.findOne({ id: allPairs[i].token1 }).select({ name: 1, symbol: 1, decimals: 1, _id: 0, id: 1 }).lean();
            promiseTokens.push(token0,token1)
        };

        promiseTokens = await Promise.all(promiseTokens);

        for(let i in allPairs){
            let temp = {

                id: allPairs[i].id,
                exchangeRate: allPairs[i].exchangeRate,
                exchangeRateDecimals : allPairs[i].exchangeRateDecimals,
                priceDiff : allPairs[i].priceDiff,
                minToken0Order : allPairs[i].minToken0Order
            }

           let token0 = promiseTokens[2 * i];
           let token1 = promiseTokens[ 2 * i + 1];
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
                                    token0 : 1
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

        let sellOrders  = [];

        let sellEntries = Object.entries(mapSell);

        for(let i in sellEntries){
            let temp = {
                exchangeRate : sellEntries[i][0],
                amount : sellEntries[i][1]
            }
            sellOrders.push(temp)
        }
        
        let buyOrders  = [];

        let buyEntries = Object.entries(mapBuy);

        for(let i in buyEntries){
            let temp = {
                exchangeRate : buyEntries[i][0],
                amount : buyEntries[i][1]
            }
            buyOrders.push(temp)
        }
        

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
        if(orderType == '1'){
            getMatchedDoc = await OrderCreated.find({pair : pairId, exchangeRate : {$lte : Number(exchangeRate)}, orderType : '0' }).sort({exchangeRate : 1}).select({id : 1, amount : 1, exchangeRate : 1, _id : 0}).lean();
        }
        else if(orderType == '0'){
            getMatchedDoc = await OrderCreated.find({pair : pairId, exchangeRate : {$gte : Number(exchangeRate)}, orderType : '1' }).sort({exchangeRate : -1}).select({id : 1, amount : 1, exchangeRate : 1, _id : 0}).lean();
        }
         

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