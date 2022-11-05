const express = require('express');
const { getAllPairDetails, fetchOrders, getAllTokens, getMatchedOrders, getPairPriceTrend, getUserPlacedOrders, getUserOrderHistory, userDepositsAndWithdraws, getPairOrderExecutedHistory, getPairTradingStatus, getMatchedMarketOrders, getOrderCancelled } = require('../controllers/genController');

const router = express.Router();


router.get("/allpairs", getAllPairDetails);
router.get("/orders/:pairId", fetchOrders);
router.get("/alltokens", getAllTokens);
router.get("/matchedorders/:pairId", getMatchedOrders);
router.get("/pair/pricetrend/:pairId", getPairPriceTrend);
router.get("/orders_placed/:maker/:pairId", getUserPlacedOrders);
router.get("/orders_history/:taker/:pairId", getUserOrderHistory);
router.get("/user/deposits/withdraws/:id", userDepositsAndWithdraws);
router.get("/pair/orders/history/:id", getPairOrderExecutedHistory);
router.get("/pair/trading/status/:pairId", getPairTradingStatus);
router.get("/market/matched/orders/:pairId", getMatchedMarketOrders);
router.get("/user/order/cancelled/:maker/:pairId", getOrderCancelled)

router.get('/', function(req , res) {
    res.send("hello world");
  });
  
  module.exports = router;