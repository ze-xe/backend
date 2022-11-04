const express = require('express');
const { getAllPairDetails, fetchOrders, getAllTokens, getMatchedOrders, getPairPriceTrend } = require('../controllers/genController');

const router = express.Router();


router.get("/allpairs", getAllPairDetails);
router.get("/orders/:pairId", fetchOrders);
router.get("/alltokens", getAllTokens);
router.get("/matchedorders/:pairId", getMatchedOrders);
router.get("/pair/pricetrend/:pairId", getPairPriceTrend)

router.get('/', function(req , res) {
    res.send("hello world");
  });
  
  module.exports = router;