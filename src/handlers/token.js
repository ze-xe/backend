const { Token } = require("../db");
const { getERC20ABI, tronWeb } = require("../utils");



async function handleToken(token){
    try{

        const isTokenExist = await Token.findOne({id : token});

        if(isTokenExist){
            return;
        }
        const getTokenDetails = await tronWeb.contract(getERC20ABI(), token);
        let name = getTokenDetails['name']().call();
        let symbol = getTokenDetails['symbol']().call();
        let decimals = getTokenDetails['decimals']().call();
        let promise = await Promise.all([name, symbol, decimals]);
        name = promise[0];
        symbol = promise[1];
        decimals = promise[2];

        let temp = {
            id : token,
            name : name,
            symbol : symbol,
            decimals : decimals,
            price : "0"
        };

        Token.create(temp);

        console.log("Token Added", token)
        return
    }
    catch(error){
        console.log("Error @ handleToken", error)
    }
};

module.exports = {handleToken}