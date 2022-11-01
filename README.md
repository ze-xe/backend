

{
    block_number: 31170734,
    block_timestamp: 1667211213000,
    caller_contract_address: 'TSCmae3Lk4ANL2CpGWCHf9MECqDYwGPXmQ',
    contract_address: 'TSCmae3Lk4ANL2CpGWCHf9MECqDYwGPXmQ',
    event_index: 0,
    event_name: 'OrderCreated',
    result: {
      '0': '062b1a3738d64ec806049666c942193bb9d35d14374fedd207ebb885cf406b03',
      '1': '13e6be28125a94b45a83c88731eb8e82a13598d872cf302d8dbcdb960f982d7d',
      '2': '0xc4fd26c420b8b5d0a5dc09ad45169e21643d5e17',
      '3': '10000000000000000000',
      '4': '10000',
      '5': '0',
      orderType: '0',
      amount: '10000000000000000000',
      orderId: '062b1a3738d64ec806049666c942193bb9d35d14374fedd207ebb885cf406b03',
      exchangeRate: '10000',
      maker: '0xc4fd26c420b8b5d0a5dc09ad45169e21643d5e17',
      pair: '13e6be28125a94b45a83c88731eb8e82a13598d872cf302d8dbcdb960f982d7d'
    },
    result_type: {
      orderType: 'uint256',
      amount: 'uint256',
      orderId: 'bytes32',
      exchangeRate: 'uint256',
      maker: 'address',
      pair: 'bytes32'
    },
    event: 'OrderCreated(bytes32 orderId, bytes32 pair, address maker, uint256 amount, uint256 exchangeRate, uint256 orderType)',
    transaction_id: 'a635604a89ce2431985cc63edfabdeaf3a0a8c6c1bbffc685563b8c5bad2e453',
    args: [
      '062b1a3738d64ec806049666c942193bb9d35d14374fedd207ebb885cf406b03',
      '13e6be28125a94b45a83c88731eb8e82a13598d872cf302d8dbcdb960f982d7d',
      '0xc4fd26c420b8b5d0a5dc09ad45169e21643d5e17',
      '10000000000000000000',
      '10000',
      '0'
    ]
  }


  //////////////////////////////////////////////////////////////////////////////////////////////

  {
    block_number: 31169293,
    block_timestamp: 1667206848000,
    caller_contract_address: 'TSCmae3Lk4ANL2CpGWCHf9MECqDYwGPXmQ',
    contract_address: 'TSCmae3Lk4ANL2CpGWCHf9MECqDYwGPXmQ',
    event_index: 0,
    event_name: 'PairCreated',
    result: {
      '0': '13e6be28125a94b45a83c88731eb8e82a13598d872cf302d8dbcdb960f982d7d',
      '1': '0x1064c9bd9cdc75175a0f196c6bd6932dc4d0763d',
      '2': '0x3f829257e7d246b712c255e013bb544b5b4538b6',
      '3': '4',
      '4': '1000000000000000000',
      pairId: '13e6be28125a94b45a83c88731eb8e82a13598d872cf302d8dbcdb960f982d7d',
      exchangeRateDecimals: '4',
      token0: '0x1064c9bd9cdc75175a0f196c6bd6932dc4d0763d',
      token1: '0x3f829257e7d246b712c255e013bb544b5b4538b6',
      minToken0Order: '1000000000000000000'
    },
    result_type: {
      pairId: 'bytes32',
      exchangeRateDecimals: 'uint256',
      token0: 'address',
      token1: 'address',
      minToken0Order: 'uint256'
    },
    event: 'PairCreated(bytes32 pairId, address token0, address token1, uint256 exchangeRateDecimals, uint256 minToken0Order)',
    transaction_id: '48ab0c75a1f66baa2f309b55b26856846d381f7482926a71256b4b2339642344'
  },

  /////////////////////////////////////////////////////////////////////////

  OrderExecuted {
  block_number: 31194630,
  block_timestamp: 1667283627000,
  caller_contract_address: 'TRfPLnVm7tsz2gpv4SeTJVTrtSkw4zwPT8',
  contract_address: 'TRfPLnVm7tsz2gpv4SeTJVTrtSkw4zwPT8',
  event_index: 0,
  event_name: 'OrderExecuted',
  result: {
    '0': '29ec209e150fa8dd1f30a23fba53bbd0581741515c0814319ce2434b7770aafe',
    '1': '0x13d122cdca07de3bf98758f513fc4d1e44f3a4f5',
    '2': '20000000000000000000',
    orderId: '29ec209e150fa8dd1f30a23fba53bbd0581741515c0814319ce2434b7770aafe',
    fillAmount: '20000000000000000000',
    taker: '0x13d122cdca07de3bf98758f513fc4d1e44f3a4f5'
  },
  result_type: { orderId: 'bytes32', fillAmount: 'uint256', taker: 'address' },
  event: 'OrderExecuted(bytes32 orderId, address taker, uint256 fillAmount)',
  transaction_id: 'ce945c8dac14a0fb7130b79d6dc517f96839b32543cd9a975ccca65a02c70771',
  args: [
    '29ec209e150fa8dd1f30a23fba53bbd0581741515c0814319ce2434b7770aafe',
    '0x13d122cdca07de3bf98758f513fc4d1e44f3a4f5',
    '20000000000000000000'
  ]
}