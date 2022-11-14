const { Token } = require("../db");
    const { getERC20ABI, getExchangeABI, getExchangeAddress } = require("../utils");
const ethers = require('ethers');
const Big = require('big.js')


async function _handleToken(token){
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

async function handleToken(token, chainId){
    try{
        const isTokenExist = await Token.findOne({id : token});

        if(isTokenExist){
            return;
        }
        let providerAdd = 'https://testnet.aurora.dev';
        let chainIds = ['1313161555'] ;
        let providerAddresses = ['https://testnet.aurora.dev'];
        let indexOfChainId = chainIds.indexOf(chainId);
        let provider = new ethers.providers.JsonRpcProvider( providerAddresses[indexOfChainId] )
        let getTokenDetails = new ethers.Contract( token , getERC20ABI() , provider );

        let name = getTokenDetails['name']();
        let symbol = getTokenDetails['symbol']();
        let decimals = getTokenDetails['decimals']();
        let promise = await Promise.all([name, symbol, decimals]);
        name = promise[0];
        symbol = promise[1];
        decimals = promise[2];

        let temp = {
            id : token,
            name : name,
            symbol : symbol,
            decimals : decimals,
            price : "0",
            chainId : chainId
        };
        
        Token.create(temp);
        console.log("Token Added", token, chainId)
    }
    catch(error){
        console.log("Error @ handleToken1", error)
    }
}

module.exports = {handleToken}
