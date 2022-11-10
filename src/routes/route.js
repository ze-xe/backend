const express = require('express');
const { getAllPairDetails, fetchOrders, getAllTokens, getMatchedOrders, getPairPriceTrend, getUserPlacedOrders, getUserOrderHistory, userDepositsAndWithdraws, getPairOrderExecutedHistory, getPairTradingStatus, getMatchedMarketOrders, getOrderCancelled } = require('../controllers/genController');

const router = express.Router();


router.get("/allpairs", getAllPairDetails); //ok
router.get("/orders/:pairId", fetchOrders); //ok
router.get("/alltokens", getAllTokens); //ok
router.get("/matchedorders/:pairId", getMatchedOrders);  //ok
router.get("/pair/pricetrend/:pairId", getPairPriceTrend); //ok
router.get("/orders_placed/:maker/:pairId", getUserPlacedOrders); // ok 
router.get("/orders_history/:taker/:pairId", getUserOrderHistory); // ok
router.get("/user/deposits/withdraws/:id", userDepositsAndWithdraws); //ok
router.get("/pair/orders/history/:id", getPairOrderExecutedHistory);  //ok
router.get("/pair/trading/status/:pairId", getPairTradingStatus); //ok
router.get("/market/matched/orders/:pairId", getMatchedMarketOrders); //ok
router.get("/user/order/cancelled/:maker/:pairId", getOrderCancelled);

router.get('/', function(req , res) {
    res.send("hello world");
  });
  
  module.exports = router;