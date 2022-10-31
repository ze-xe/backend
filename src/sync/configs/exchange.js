const { getExchangeAddress, tronWeb } = require("../../utils");
const { getExchangeABI } = require("../../utils");

const {handlePairCreated, handleOrderCreated, handleOrderExecuted} = require('../../handlers/exchange')








const ExchangeConfig = {
    contractAddress: tronWeb.address.fromHex(getExchangeAddress()),
    abi: getExchangeABI(),
    handlers: {
        "PairCreated": handlePairCreated,
        "OrderCreated" : handleOrderCreated,
        "OrderExecuted" : handleOrderExecuted,
    }
};


module.exports = {ExchangeConfig};
