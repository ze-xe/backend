const express = require('express');
const { getAllPairDetails, fetchOrders, getAllTokens, getMatchedOrders, getPairPriceTrend, getUserPlacedOrders, getUserOrderHistory, userDepositsAndWithdraws, getPairOrderExecutedHistory, getPairTradingStatus, getMatchedMarketOrders, getOrderCancelled } = require('../controllers/genController');

const router = express.Router();


router.get("/allpairs", getAllPairDetails); //Ok
router.get("/orders/:pairId", fetchOrders); //Ok
router.get("/alltokens", getAllTokens); //Ok
router.get("/matchedorders/:pairId", getMatchedOrders); //Ok
router.get("/pair/pricetrend/:pairId", getPairPriceTrend); // Ok
router.get("/orders_placed/:maker/:pairId", getUserPlacedOrders); //Ok
router.get("/orders_history/:taker/:pairId", getUserOrderHistory); //Ok
router.get("/user/deposits/withdraws/:id", userDepositsAndWithdraws); //Ok
router.get("/pair/orders/history/:id", getPairOrderExecutedHistory); // ok
router.get("/pair/trading/status/:pairId", getPairTradingStatus); //OK
router.get("/market/matched/orders/:pairId", getMatchedMarketOrders); // Ok
router.get("/user/order/cancelled/:maker/:pairId", getOrderCancelled)

router.get('/', function(req , res) {
    res.send("hello world");
  });
  
  module.exports = router;