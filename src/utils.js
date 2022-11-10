const fs = require("fs");
const TronWeb = require("tronweb");

require("dotenv").config();

const tronWeb = new TronWeb({
    fullHost: 'https://nile.trongrid.io',
    headers: { "TRON-PRO-API-KEY": process.env.TRON_PRO_API_KEY },
    privateKey: process.env.TRON_PRIVATE_KEY
});

const exchangeDeployments = JSON.parse(fs.readFileSync(process.cwd() + `/abi/Exchange.json`));
const vaultDeployments = JSON.parse(fs.readFileSync(process.cwd() + `/abi/Vault.json`));
const erc20Deployments = JSON.parse(fs.readFileSync(process.cwd() + `/abi/ERC20.json`));

function getExchangeABI(){
    return exchangeDeployments["abi"]
   
}

function getVaultABI(){
    return vaultDeployments["abi"]
   
}

function getERC20ABI(){
    return erc20Deployments["abi"]
}

function getExchangeAddress(){
    return exchangeDeployments["networks"]["3"]["address"]
   
}
function getVaultAddress(){
    return vaultDeployments["networks"]["3"]["address"]
   
}

async function getContract(name){
    let contract = Deployments["contracts"][name];
    let instance = await tronWeb.contract(getABI(contract.source), contract.address)
    return instance
}

module.exports = {getExchangeABI, getExchangeAddress, getContract, tronWeb, getVaultABI, getVaultAddress, getERC20ABI}