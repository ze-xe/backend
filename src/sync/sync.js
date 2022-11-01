const axios = require("axios");
const { Sync } = require("../db");















let lastTxnTimestamp;
let lastBlockNumber;
async function syncAndListen({ contractAddress, abi, handlers }) {

    if (handlers["PairCreated"]) {

        let syncDetails = await Sync.findOne();

        if (!syncDetails) {
            await Sync.create({ lastBlockTimestampExchange: 0 });
            lastTxnTimestamp = 0;

        } else {
            lastTxnTimestamp = syncDetails.lastBlockTimestampExchange;
        }
    }
    // else {
    //     let syncDetails = await Sync.findOne();

    //     if (!syncDetails) {
    //         await Sync.create({ lastBlockTimestampVault: 0 });
    //         lastTxnTimestamp = 0;

    //     } else {
    //         lastTxnTimestamp = syncDetails.lastBlockTimestampVault;
    //     }
    // }


    let reqUrl = `https://nile.trongrid.io/v1/contracts/${contractAddress}/events?order_by=block_timestamp,asc&limit=50&only_confirmed=false&min_block_timestamp=${lastTxnTimestamp}`;
    let isLastPage;


    _sync();

    async function _sync() {
        try {


            let resp = await axios.get(reqUrl);

            if (resp.data.meta.links) {
                reqUrl = resp.data.meta.links.next
                isLastPage = false
            } else {
                isLastPage = true;
            }

            let data = resp.data.data

            if (data) {

                for (let i in data) {

                    let res = data[i].result;
                    let arr = Object.keys(res);
                    let len = Object.keys(res).length;
                    let args = [];
                    for (let i = 0; i < len / 2; i++) {
                        args.push(res[`${arr[i]}`])
                    };

                    data[i].args = args;

                    let arguments = {
                        txnId: data[i].transaction_id,
                        blockTimestamp: data[i].block_timestamp,
                        blockNumber: data[i].block_number,
                        index: data[i].event_index,
                        address: data[i].contract_address,
                        from: 0

                    }
                    lastTxnTimestamp = data[i].block_timestamp;
                    lastBlockNumber = data[i].block_number
                    // console.log(data[i]["event_name"], data[i])
                    if (handlers[data[i]["event_name"]] && data[i].result != undefined) {

                        await handlers[data[i]["event_name"]](data[i].args, arguments)
                    }

                }

            }

            if (isLastPage === false) {
                _sync()
                return
            }
            else if (isLastPage === true) {


                if (handlers["PairCreated"]) {

                    await Sync.findOneAndUpdate({}, { $set: { lastBlockTimestampExchange: lastTxnTimestamp, blockNumberExchange: lastBlockNumber } })
                    syncAndListen({ contractAddress, abi, handlers });
                  
                    return
                }
                //  else {

                //     await Sync.findOneAndUpdate({}, { $set: { lastBlockTimestampVault: lastTxnTimestamp, blockNumberVault: lastBlockNumber } })
                //     syncAndListen({ contractAddress, abi, handlers });
                  
                //     return
                // }

            }




        }
        catch (error) {


            if (handlers["PairCreated"]) {
                await Sync.findOneAndUpdate({}, { $set: { lastBlockTimestampExchange: lastTxnTimestamp, blockNumberExchange: lastBlockNumber } })
                syncAndListen({ contractAddress, abi, handlers });
               
                return
            }
            //  else {
            //     await Sync.findOneAndUpdate({}, { $set: { lastBlockTimestampVault: lastTxnTimestamp, blockNumberVault: lastBlockNumber } })
            //     syncAndListen({ contractAddress, abi, handlers });
               
            //     return
            // }

        }
    }
}


let _lastTxnTimestamp;
let _lastBlockNumber;
async function _syncAndListen({ contractAddress, abi, handlers }) {

    // if (handlers["PairCreated"]) {

    //     let syncDetails = await Sync.findOne();

    //     if (!syncDetails) {
    //         await Sync.create({ lastBlockTimestampExchange: 0 });
    //         _lastTxnTimestamp = 0;

    //     } else {
    //         _lastTxnTimestamp = syncDetails.lastBlockTimestampExchange;
    //     }
    // }
    // else {
        let syncDetails = await Sync.findOne();

        if (!syncDetails) {
            await Sync.create({ lastBlockTimestampVault: 0 });
            _lastTxnTimestamp = 0;

        } else {
            _lastTxnTimestamp = syncDetails.lastBlockTimestampVault;
        }
    // }


    let reqUrl = `https://nile.trongrid.io/v1/contracts/${contractAddress}/events?order_by=block_timestamp,asc&limit=50&only_confirmed=false&min_block_timestamp=${lastTxnTimestamp}`;
    let isLastPage;


    _sync();

    async function _sync() {
        try {


            let resp = await axios.get(reqUrl);

            if (resp.data.meta.links) {
                reqUrl = resp.data.meta.links.next
                isLastPage = false
            } else {
                isLastPage = true;
            }

            let data = resp.data.data

            if (data) {

                for (let i in data) {

                    let res = data[i].result;
                    let arr = Object.keys(res);
                    let len = Object.keys(res).length;
                    let args = [];
                    for (let i = 0; i < len / 2; i++) {
                        args.push(res[`${arr[i]}`])
                    };

                    data[i].args = args;

                    let arguments = {
                        txnId: data[i].transaction_id,
                        blockTimestamp: data[i].block_timestamp,
                        blockNumber: data[i].block_number,
                        index: data[i].event_index,
                        address: data[i].contract_address,
                        from: 0

                    }
                    _lastTxnTimestamp = data[i].block_timestamp;
                    _lastBlockNumber = data[i].block_number
                    // console.log(data[i]["event_name"], data[i])
                    if (handlers[data[i]["event_name"]] && data[i].result != undefined) {

                        await handlers[data[i]["event_name"]](data[i].args, arguments)
                    }

                }

            }

            if (isLastPage === false) {
                _sync()
                return
            }
            else if (isLastPage === true) {


                // if (handlers["PairCreated"]) {

                //     await Sync.findOneAndUpdate({}, { $set: { lastBlockTimestampExchange: _lastTxnTimestamp, blockNumberExchange: _lastBlockNumber } })
                //     syncAndListen({ contractAddress, abi, handlers });
                  
                //     return
                // } else {

                    await Sync.findOneAndUpdate({}, { $set: { lastBlockTimestampVault: _lastTxnTimestamp, blockNumberVault: _lastBlockNumber } })
                    syncAndListen({ contractAddress, abi, handlers });
                  
                    return
                // }

            }




        }
        catch (error) {


            // if (handlers["PairCreated"]) {
            //     await Sync.findOneAndUpdate({}, { $set: { lastBlockTimestampExchange: _lastTxnTimestamp, blockNumberExchange: _lastBlockNumber } })
            //     syncAndListen({ contractAddress, abi, handlers });
               
            //     return
            // } else {
                await Sync.findOneAndUpdate({}, { $set: { lastBlockTimestampVault: _lastTxnTimestamp, blockNumberVault: _lastBlockNumber } })
                syncAndListen({ contractAddress, abi, handlers });
               
                return
            // }

        }
    }
}



module.exports = { syncAndListen, _syncAndListen }