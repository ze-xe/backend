const express = require('express');
const { getAllPairDetails, fetchOrders } = require('../controllers/genController');

const router = express.Router();


router.get("/allpairs", getAllPairDetails);
router.get("/orders/:pairId", fetchOrders)

router.get('/', function(req , res) {
    res.send("hello world");
  });
  
  module.exports = router;