const { PairCreated, Token, connect, OrderCreated } = require("../db")





async function getAllPairDetails(req, res) {

    try {

        let allPairs = await PairCreated.find();

        let data = []

        for (let i in allPairs) {

            let temp = {
                id: allPairs[i].id,
                exchangeRate: allPairs[i].exchangeRate
            }
            let token0 = await Token.findOne({ id: allPairs[i].token0 }).select({ name: 1, symbol: 1, decimals: 1, _id: 0 });
            let token1 = await Token.findOne({ id: allPairs[i].token1 }).select({ name: 1, symbol: 1, decimals: 1, _id: 0 });
            temp.token0 = token0;
            temp.token1 = token1;
            data.push(temp)

        };

        res.status(200).send({ status: true, data: data });

    }
    catch (error) {
        console.log("Error @ getAllPairDetails", error);
        res.status(500).send({ status: false, error: error.message });
    }
};

async function fetchOrders(req, res) {
    try {

        let pairId = req.params.pairId;

        if (!pairId) {

            res.status(400).send({ status: false, message: "Please provide pairId" });

        };

        const isPairIdExist = await PairCreated.findOne({ id: pairId });

        if (!isPairIdExist) {
            res.status(404).send({ status: false, message: "Please provide valid pairId" });
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
                        decimals: "$pairDetails.exchangeRateDecimals"
                    }
                }

            ]
        );
        let map = {}
        for (let i in getOrderDetails) {

            if (!map[`${getOrderDetails[i].exchangeRate}`]) {

                map[`${getOrderDetails[i].exchangeRate}`] = getOrderDetails[i].amount;

            }
            else {
                map[`${getOrderDetails[i].exchangeRate}`] = `${Number(map[`${getOrderDetails[i].exchangeRate}`]) + Number(getOrderDetails[i].amount)}`;
            }

        }

        let data = {
            pair: getOrderDetails[0].pair,
            decimals: getOrderDetails[0].decimals[0],
            orders: map
        }

        res.status(200).send({ status: true, data: data });
    }
    catch (error) {
        console.log("Error @ fetchOrders", error);
        res.status(500).send({ status: false, error: error.message });
    }
}



module.exports = { getAllPairDetails, fetchOrders };