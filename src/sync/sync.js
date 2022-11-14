const axios = require("axios");
const { Sync } = require("../db");
const ethers = require('ethers');
const { connect } = require('../db');
require("dotenv").config()



// const iface = new ethers.utils.Interface(abi)


function decode_log_data(data, topics, iface) {
    try {

        const result = iface.parseLog({ data, topics });
        return result;
    }
    catch (error) {
        return
    }
};


let pageNumberExchange;
async function syncAndListen({ contractAddress, abi, handlers }, chainId) {


    let syncDetails = await Sync.findOne();

    if (!syncDetails) {
        await Sync.create({ pageNumberExchange: 0, chainId: chainId });
        pageNumberExchange = 0;

    } else {
        pageNumberExchange = syncDetails.pageNumberExchange ?? 0;
    }

    let reqUrl = `https://api.covalenthq.com/v1/${chainId}/address/${contractAddress}/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=false&page-number=${pageNumberExchange}&page-size=50&key=${process.env.AURORA_API_KEY}`
    let isLastPage = false;
    let errorCount = 0;


    sync();

    async function sync() {
        try {
           
            let resp = await axios.get(reqUrl);
            let data = resp.data.data;

            if (data.pagination.has_more == false) {
                pageNumberExchange = Number(data.pagination.page_number);
                isLastPage = true;
            } else {

                reqUrl = `https://api.covalenthq.com/v1/${chainId}/address/${contractAddress}/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=false&page-number=${pageNumberExchange}&page-size=50&key=${process.env.AURORA_API_KEY}`
                pageNumberExchange = Number(data.pagination.page_number) + 1;

            }
           
            const iface = new ethers.utils.Interface(abi);

            if (data.items.length > 0) {

                for (let i = 0; i < data.items.length; i++) {

                    let txnId = data.items[i].tx_hash;
                    let blockTimestamp = data.items[i].block_signed_at;
                    let blockNumber = data.items[i].block_height;
                    let logEvents = data.items[i].log_events;

                    if (logEvents.length > 0) {

                        for (let j = 0; j < logEvents.length; j++) {
                            lastTxnTimestamp = blockTimestamp;
                            const rawLogTopics = logEvents[j].raw_log_topics;
                            const rawLogData = logEvents[j].raw_log_data;
                            const address = logEvents[j].sender_address;

                            let arguments = {
                                txnId: txnId,
                                blockTimestamp: blockTimestamp,
                                blockNumber: blockNumber,
                                address: address,
                                chainId: chainId
                            }

                            const decoded_data = await decode_log_data(rawLogData, rawLogTopics, iface);

                            if (decoded_data && decoded_data.args != undefined) {

                                // console.log("Event", decoded_data.args) 
                                if (handlers[decoded_data["name"]]) {
                                    await handlers[decoded_data["name"]](decoded_data.args, arguments)
                                }
                            }
                        }
                    }
                }
            }

            if (isLastPage == false) {
                sync();
                return
            }
            else if (isLastPage == true) {
                await Sync.findOneAndUpdate({}, { $set: { pageNumberExchange: pageNumberExchange } });
                syncAndListen({ contractAddress, abi, handlers }, chainId);
                return

            }
        }
        catch (error) {
            if (errorCount < 5) {
                syncAndListen({ contractAddress, abi, handlers }, chainId);
                return
            }
            else {
                await Sync.findOneAndUpdate({}, { $set: { pageNumberExchange: pageNumberExchange } })
                console.log(`error`, error.message, error);
            }

        }
    }
};



let pageNumberVault;
async function syncAndListen1({ contractAddress, abi, handlers }, chainId) {

    
    let syncDetails = await Sync.findOne();

    if (!syncDetails) {
        await Sync.create({ pageNumberVault: 0, chainId: chainId });
        pageNumberVault = 0;

    } else {
        pageNumberVault = syncDetails.pageNumberVault ?? 0;
    }

    let reqUrl = `https://api.covalenthq.com/v1/${chainId}/address/${contractAddress}/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=false&page-number=${pageNumberVault}&page-size=50&key=ckey_fe0490001dc04de2854e3c23e63`
    let isLastPage = false;
    let errorCount = 0;


    sync1();

    async function sync1() {
        try {

            let resp = await axios.get(reqUrl);
            let data = resp.data.data;

            if (data.pagination.has_more == false) {
                pageNumberVault = Number(data.pagination.page_number);
                isLastPage = true;
            } else {

                reqUrl = `https://api.covalenthq.com/v1/${chainId}/address/${contractAddress}/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=false&page-number=${pageNumberVault}&page-size=50&key=ckey_fe0490001dc04de2854e3c23e63`
                pageNumberVault = Number(data.pagination.page_number) + 1;

            }

            const iface = new ethers.utils.Interface(abi);

            if (data.items.length > 0) {

                for (let i = 0; i < data.items.length; i++) {

                    let txnId = data.items[i].tx_hash;
                    let blockTimestamp = data.items[i].block_signed_at;
                    let blockNumber = data.items[i].block_height;
                    let logEvents = data.items[i].log_events;

                    if (logEvents.length > 0) {

                        for (let j = 0; j < logEvents.length; j++) {
                            lastTxnTimestamp = blockTimestamp;
                            const rawLogTopics = logEvents[j].raw_log_topics;
                            const rawLogData = logEvents[j].raw_log_data;
                            const address = logEvents[j].sender_address;

                            let arguments = {
                                txnId: txnId,
                                blockTimestamp: blockTimestamp,
                                blockNumber: blockNumber,
                                address: address,
                                chainId: chainId
                            }

                            const decoded_data = await decode_log_data(rawLogData, rawLogTopics, iface);

                            if (decoded_data && decoded_data.args != undefined) {

                                console.log("Event", decoded_data.args) 
                                if (handlers[decoded_data["name"]]) {
                                    await handlers[decoded_data["name"]](decoded_data.args, arguments)
                                }
                            }
                        }
                    }
                }
            }

            if (isLastPage == false) {
                sync1();
                return
            }
            else if (isLastPage == true) {
                await Sync.findOneAndUpdate({}, { $set: { pageNumberVault: pageNumberVault } });
                syncAndListen1({ contractAddress, abi, handlers }, chainId);
                return

            }
        }
        catch (error) {
            if (errorCount < 5) {
                syncAndListen1({ contractAddress, abi, handlers }, chainId);
                return
            }
            else {
                await Sync.findOneAndUpdate({}, { $set: { pageNumberVault: pageNumberVault } })
                console.log(`error`, error.message, error);
            }

        }
    }
};



// syncAndListen({
//     contractAddress: "0x047d17892cd3D3226C455B12E5edef7d75b3E50D",
//     abi: getExchangeABI(),
//     handlers: {
//         "PairCreated": handlePairCreated,
//         "OrderCreated": handleOrderCreated,
//         "OrderExecuted": handleOrderExecuted,
//         "OrderUpdated": handleOrderUpdated
//     }
// }, "1313161555");


module.exports = { syncAndListen, syncAndListen1 }



// module.exports = { syncAndListen }