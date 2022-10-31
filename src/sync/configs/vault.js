const { tronWeb, getVaultAddress, getVaultABI } = require("../../utils");

const {handleTokenWithdrawn, handleTokenDeposited} = require('../../handlers/vault')




const VaultConfig = {
    contractAddress: tronWeb.address.fromHex(getVaultAddress()),
    abi: getVaultABI(),
    handlers: {
        "TokenWithdrawn": handleTokenWithdrawn,
        "TokensDeposited" : handleTokenDeposited,       
    }
};


module.exports = {VaultConfig};
