# zexe

## Backend APIS

### 1. For Fetching All Pairs Details

### Route /allpairs

### Expected Input
```
Method : Get
Url : http://localhost:3010/allpairs
```

### Expected Output 

```
{
    "status": true,
    "data": [
        {
            "id": "62d802cb3cf079d101c55b3797b3457f82fe0dbe4f0f707eb733e6cebe2425c5",
            "exchangeRate": 1970000,
            "exchangeRateDecimals": "2",
            "priceDiff": "-2130000",
            "minToken0Order": "10000000000000",
            "tokens": [
                {
                    "id": "TT1tEKirXeCqT71u5KMnNsQPwXpT5tzR7T",
                    "name": "Bitcoin",
                    "symbol": "BTC",
                    "decimals": "18"
                },
                {
                    "id": "TCQ3oExtQd9GTZesdwAFxNB3SUWJdPz4ME",
                    "name": "Decentralised USD",
                    "symbol": "USDD",
                    "decimals": "18"
                }
            ]
        },
        ...
    ]
}
```

### 2. For Fetching All Orders Of Pair

### Route /orders/:pairId

### Expected Input
```
Method : Get
Url : http://localhost:3010/orders/:pairId
example : http://localhost:3010/orders/62d802cb3cf079d101c55b3797b3457f82fe0dbe4f0f707eb733e6cebe2425c5
```

### Expected Output 

```
{
    "status": true,
    "data": {
        "pair": "62d802cb3cf079d101c55b3797b3457f82fe0dbe4f0f707eb733e6cebe2425c5",
        "decimals": "2",
        "sellOrders": [
            {
                "exchangeRate": 2200000,
                "amount": "992584732536764700"
            },
            {
                "exchangeRate": 2500000,
                "amount": "992584732536764700"
            },
           ...
        ],
        "buyOrders": [
            {
                "exchangeRate": 1970000,
                "amount": "94938029736489087"
            },
            {
                "exchangeRate": 1920000,
                "amount": "362614702251838235"
            },
           ...
        ]
    }
}
```


### 3. For Fetching Pairs Price Trend

### Route /pair/pricetrend/:pairId

### Expected Input
```
Method : Get
Url : http://localhost:3010/pair/pricetrend/:pairId?interval=300000
interval is mandatory which must be greater than 300000 miliseconds
```

### Expected Output 

```
{
    "status": true,
    "data": {
        "exchangeRate": [
            {
                "time": 1668001491,
                "open": "17000",
                "high": "17000",
                "close": "17000",
                "low": "17000"
            },
            {
                "time": 1668002049,
                "open": "16600",
                "high": "18000",
                "close": "18000",
                "low": "16600"
            },
            ...
        ],
        "volume": [
            {
                "time": 1668001491,
                "value": "0.588235294117647059"
            },
            {
                "time": 1668002049,
                "value": "0.906764705882352941"
            },
            ...
        ]
    }
}
```
### 4. For Fetching Pairs Orders History

### Route /pair/orders/history/:id

### Expected Input
```
Method : Get
Url : http://localhost:3010/pair/orders/history/:id
Where id is pairId
```

### Expected Output 

```
{
    "status": true,
    "data": [
        {
            "fillAmount": "258473253676470005",
            "exchangeRate": 1970000,
            "orderType": "1"
        },
        {
            "fillAmount": "91209847383283167",
            "exchangeRate": 4100000,
            "orderType": "0"
        },
        {
            "fillAmount": "8790152616716833",
            "exchangeRate": 4100000,
            "orderType": "1"
        },
        ...
    ]
}
```

### 5. For Fetching Pairs Trading Status

### Route /pair/trading/status/:pairId

### Expected Input
```
Method : Get
Url : http://localhost:3010/pair/trading/status/:pairId
```

### Expected Output 

```
{
    "status": true,
    "data": [
        {
            "interval": "_24hr",
            "changeInER": -32.068965517241374,
            "volume": 49.858473253676465
        },
        {
            "interval": " _7D",
            "changeInER": 15.88235294117647,
            "volume": 52.35347325367647
        },
        {
            "interval": " _30D",
            "changeInER": 15.88235294117647,
            "volume": 52.35347325367647
        },
        {
            "interval": "_90D",
            "changeInER": 15.88235294117647,
            "volume": 52.35347325367647
        },
        {
            "interval": " _1Yr",
            "changeInER": 15.88235294117647,
            "volume": 52.35347325367647
        }
    ]
}
```

### 6. For Fetching Pairs Matched Orders Details

### Route /matchedorders/:pairId

### Expected Input
```
Method : Get
Url : http://localhost:3010/matchedorders/:pairId?exchange_rate=1700000&order_type=0&amount=606060606060606061
all fields are mandatory
order_type = 0 for sell, 1 for buy
amount = value * 10**decimals , i.e 18
exchange_rate = value * 10**exchangeRateDecimals

```

### Expected Output 

```
{
    "status": true,
    "data": [
        {
            "id": "8b20bfe2923557039685f55807eb889fe3d14b8bdf9e29a924ea015d80506426",
            "amount": "94938029736489087",
            "exchangeRate": 1970000
        },
        {
            "id": "f2fd6e80a9eb2be3bc47fab4c970aec9dc6e6273b700c5e18b873fded714b660",
            "amount": "362614702251838235",
            "exchangeRate": 1920000
        },
        ...
    ]
}
```

### 7. For Fetching Pairs Market Order Details

### Route /market/matched/orders/:pairId

### Expected Input
```
Method : Get
Url : http://localhost:3010/market/matched/orders/:pairId?order_type=1&amount=2200000
all fields are mandatory
```

### Expected Output 

```
{
    "status": true,
    "data": [
        {
            "id": "9b8a607956f796d6e76a93504c91bc90cd6be0071e816b30aba73b7cc11dd4cb",
            "amount": "992584732536764700",
            "exchangeRate": 2200000
        },
        {
            "id": "e8e8634545a08d3ae5883cbfdc8138873c1deab7708bfe717441c2ced2f111fa",
            "amount": "992584732536764700",
            "exchangeRate": 2500000
        },
        {
            "id": "6e04ce1a26f4332b3641df017317c844264b8942dd3bc39eb02a472278fd6e16",
            "amount": "449757210708634300000",
            "exchangeRate": 5500000
        }
    ]
}
```

### 8. For Fetching All Tokens Details

### Route /alltokens

### Expected Input
```
Method : Get
Url : http://localhost:3010/alltokens
```

### Expected Output 

```
{
    "status": true,
    "data": [
        {
            "id": "TT1tEKirXeCqT71u5KMnNsQPwXpT5tzR7T",
            "name": "Bitcoin",
            "symbol": "BTC",
            "decimals": "18"
        },
        {
            "id": "TCQ3oExtQd9GTZesdwAFxNB3SUWJdPz4ME",
            "name": "Decentralised USD",
            "symbol": "USDD",
            "decimals": "18"
        },
        {
            "id": "TFmcPQyjQQRSDsJAxKsTG5vp8kzxR5zCwu",
            "name": "Ethereum",
            "symbol": "ETH",
            "decimals": "18"
        },
        ...
    ]
}
```

### 9. For Fetching Users Deposits and Withdraws Details

### Route /user/deposits/withdraws/:id

### Expected Input
```
Method : Get
Url : http://localhost:3010/user/deposits/withdraws/:id
```

### Expected Output 

```
{
    "status": true,
    "data": {
        "deposits": [
            {
                "txnId": "6c076a8e5ed5c80dc5fba4841709c9bee2f991b909776ee763a8ef283cc774ef",
                "blockTimestamp": "1668059094000",
                "token": "TFmcPQyjQQRSDsJAxKsTG5vp8kzxR5zCwu",
                "amount": "4000000000000000000000"
            },
            {
                "txnId": "0d05f31a4a4aa56e2447c394b0294067ac188a7dcd1992701ea36e7438bedf79",
                "blockTimestamp": "1668059079000",
                "token": "TCQ3oExtQd9GTZesdwAFxNB3SUWJdPz4ME",
                "amount": "500000000000000000000000"
            },
            ...
        ],
        "withdraws": [
            {
                "txnId": "486d327f7d93869a52d1394beb9caf079a346406f2b05412ad8d3cdca89afe6c",
                "blockTimestamp": "1668060339000",
                "token": "TT1tEKirXeCqT71u5KMnNsQPwXpT5tzR7T",
                "amount": "20000000000000000000"
            }
        ]
    }
}
```

### 10. For Fetching Users Placed Orders Of Pair

### Route /orders_placed/:maker/:pairId

### Expected Input
```
Method : Get
Url : http://localhost:3010/orders_placed/:maker/:pairId
maker : user wallet address
```

### Expected Output 

```
{
    "status": true,
    "data": [
        {
            "id": "6e04ce1a26f4332b3641df017317c844264b8942dd3bc39eb02a472278fd6e16",
            "amount": "449757210708634300000",
            "exchangeRate": 5500000,
            "orderType": "0"
        },
        ...
    ]
}
```

### 11. For Fetching Users Orders History Of Pair

### Route /orders_history/:taker/:pairId

### Expected Input
```
Method : Get
Url : http://localhost:3010/orders_history/:taker/:pairId
taker : user wallet address
```

### Expected Output 

```
{
    "status": true,
    "data": [
        {
            "fillAmount": "91209847383283167",
            "exchangeRate": 4100000,
            "orderType": "0"
        },
        {
            "fillAmount": "8790152616716833",
            "exchangeRate": 4100000,
            "orderType": "1"
        },
        ...
    ]
}
```

### 12. For Fetching Users Cancelled Orders Of Pair

### Route /user/order/cancelled/:maker/:pairId

### Expected Input
```
Method : Get
Url : http://localhost:3010/user/order/cancelled/:maker/:pairId
```

### Expected Output 

```
{
    "status": true,
    "data": [
        {
            "amount": "8790152616716833",
            "exchangeRate": 4100000,
            "orderType": "1"
        },
        {
            "amount": "16218924345573049044",
            "exchangeRate": 2000000,
            "orderType": "1"
        },
        ...
    ]
}
```
