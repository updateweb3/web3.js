#!/usr/bin/env node

var Web3 = require('../index.js');
// var sleep = require('sleep')
var web3 = new Web3();
var ethUtil = require('ethereumjs-util');
var abi = require('ethereumjs-abi');

let rpcUrl = 'https://rpcproxy.thinkium.vip';     //rpc proxy
web3.setProvider(new web3.providers.HttpProvider(rpcUrl));

const privateKey = new Buffer.alloc(32, '4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318', 'hex')

web3.thk.defaultPrivateKey = privateKey
web3.thk.defaultAddress = "0x2c7536e3605d9c16a7a3d7b1898e529396a65c23"
web3.thk.defaultChainId = "1"

function sleep(delay) {   //自定义sleep方法
    var start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay) {
    }
}


function RunContract(contractName, contractText) {
    var balance = web3.thk.GetAccount(web3.thk.defaultChainId, '0x2c7536e3605d9c16a7a3d7b1898e529396a65c23');
    var contractresp = web3.thk.CompileContract(web3.thk.defaultChainId, contractText)
    code = contractresp[contractName]["code"]
    // 发布合约
    tx = {
        chainId: web3.thk.defaultChainId,
        fromChainId: web3.thk.defaultChainId,
        toChainId: web3.thk.defaultChainId,
        from: web3.thk.defaultAddress,
        to: "",
        nonce: balance['nonce'].toString(),
        value: "0",
        input: code,
    };
    web3.thk.signTransaction(tx, web3.thk.defaultPrivateKey)
    var contracthash = web3.thk.SendTx(tx)
    sleep(5000)
    // 获取合约hash
    TxHash = contracthash["TXhash"]
    var conresp = web3.thk.GetTransactionByHash(web3.thk.defaultChainId, TxHash)
    var contractAddress = conresp['contractAddress']
    web3.thk.SaveContract(contractAddress, contractresp)
    return contractAddress
}


/**
 * @description: 获取账户余额， 也可以用来获取nonce
 * @param {String} chainId
 * @param {String} address
 * @return:
 */
function getAccount(chainId, address) {
    return web3.thk.GetAccount(chainId, address)
}


/**
 * @description: 获取账户余额， 也可以用来获取nonce
 * @param {String} chainId
 * @param {String} fromAddress
 * @param {String} toAddress
 * @param {String} value
 * @param {String} nonce
 * @param {String} privateKey
 * @param {String} inputs
 * @return:
 */
function sendTx(chainId, fromAddress, toAddress, value, nonce, privateKey, inputs) {
    let obj = {
        chainId: chainId,
        fromChainId: chainId,
        toChainId: chainId,
        from: fromAddress,
        to: toAddress,
        nonce: nonce,
        value: value.toString(),
        input: inputs,
        useLocal: false,
        extra: ''
    };
    //签名参数
    let sendTxParams = web3.thk.signTransaction(obj, privateKey)
    return web3.thk.SendTx(sendTxParams)
}


/**
 * @description: 通过交易hash获取交易详情
 * @param {String} chainId
 * @param {String} txHash
 * @return:
 */
function getTxHashRes(chainId, txHash) {
    return web3.thk.GetTransactionByHash(chainId, txHash)
}


/**
 * @description: 获取链信息
 * @param {String} chainId
 * @return:
 */
function getStateInfo(chainId) {
    return web3.thk.GetStats(chainId)
}


/**
 * @description: 获取指定账户在对应链上一定高度范围内的交易信息
 * @param {String} chainId
 * @param {String} address
 * @param {Number} startHeight
 * @param {Number} endHeight
 * @return:
 */
function getTransactionInfos(chainId, address, startHeight, endHeight) {
    return web3.thk.GetTransactions(chainId, address, startHeight, endHeight)
}


/**
 * @description: 获取一条交易的详情
 * @param {String} chainId
 * @param {String} fromAddress
 * @param {String} toAddress
 * @param {String} value
 * @param {String} nonce
 * @param {String} inputs
 * @return:
 */
function getTransferInfo(chainId, fromChainId, toChainId, fromAddress, toAddress, value, nonce, inputs) {
    let obj = {
        chainId: chainId,
        from: fromAddress,
        to: toAddress,
        fromChainId: fromChainId,
        toChainId: toChainId,
        nonce: nonce,
        value: value.toString(),
        input: inputs
    };
    return web3.thk.CallTransaction(obj)
}


/**
 * @description: 获取指定块高信息
 * @param {String} chainId
 * @param {String} height
 * @return:
 */
function getBlockHeightInfo(chainId, height) {
    return web3.thk.GetBlockHeader(chainId, height)
}


/**
 * @description: 获取指定块高,指定页码数量信息
 * @param {String} chainId
 * @param {String} height
 * @param {String} page    页码
 * @param {String} size     页的大小
 * @return:
 */
function getBlockPageInfos(chainId, height, page, size) {
    return web3.thk.GetBlockTxs(chainId, height, page, size)
}


/**
 * @description: 编译合约
 * @param {String} chainId
 * @param {String} contract
 * @return:
 */
function getCompileContract(chainId, contract) {
    return web3.thk.CompileContract(chainId, contract)
}


/**
 * @description: 获取链信息
 * @param {Array} chainIds    链Id数组, 空数组为所有
 * @return:
 */
function getChainInfos(chainIds) {
    return web3.thk.GetChainInfo(chainIds)
}


/**
 * @description: 连接指定ip+端口
 * @param {String} url    链Id数组, 空数组为所有
 * @return:
 */
function pingUrl(url) {
    return web3.thk.Ping(url)
}


/**
 * @description: 获取委员会详情
 * @param {String} chainId
 * @return:
 */
function getCommittee(chainId, epoch) {
    return web3.thk.GetCommittee(chainId, epoch)
}

let com_objs = {};

function Str2Bytes(str) {
    var pos = 0;
    var len = str.length;
    if (len % 2 != 0) {
        return null;
    }
    len /= 2;
    var hexA = [];
    for (var i = 0; i < len; i++) {
        var s = str.substr(pos, 2);
        var v = parseInt(s, 16);
        hexA.push(v);
        pos += 2;
    }
    return hexA;
}

/**
 * @description: pos质押
 * @param {string} asset   质押金额
 * @param {string} contract   钱包地址绑定合约地址
 * @param {string} nodeidPrivatekey   节点私钥，  去除0x
 * @return:
 */
function depositSendTx(asset, contract, nodeidPrivatekey) {    //质押
    let balancess = getAccount('2', web3.thk.defaultAddress);
    let privateKeys = new Buffer.alloc(32, nodeidPrivatekey, 'hex')
    let nodeids = ethUtil.privateToPublic(privateKeys)

    let obj = {
        bindAddr: contract.toLowerCase(),
        nodeType: 1,
        nonce: balancess.nonce.toString(),
        amount: asset,
        nodeId: nodeids
    };
    //签名参数
    let nodeSig = web3.thk.signTransactionNew(obj, privateKeys)
    let encoded = abi.simpleEncode("deposit(bytes,uint8,address,uint64,uint256,string):(bytes,uint256,uint256,uint256,uint256,string)",
        nodeids,
        1,
        contract.toLowerCase(),
        balancess.nonce.toString(),
        asset,
        nodeSig
    );
    let objs = {
        chainId: '2',
        fromChainId: '2',
        toChainId: '2',
        from: web3.thk.defaultAddress.toLowerCase(),
        to: contract.toLowerCase(),
        nonce: balancess.nonce.toString(),
        value: asset,
        input: encoded.toString('hex'),
        useLocal: false,
        extra: ''
    };

    //签名参数
    let TxParams = web3.thk.signTransaction(objs, privateKey)
    return web3.thk.SendTx(TxParams)
}

/**
 * @description: pos赎回
 * @param {string} asset   质押金额
 * @param {string} contract   钱包地址绑定合约地址
 * @param {string} nodeidPrivatekey   节点私钥，  去除0x
 * @return:
 */
function withDraw(asset, contract, nodeidPrivatekey) {   //赎回
    let balancess = getAccount('2', web3.thk.defaultAddress);
    let privateKeys = new Buffer.alloc(32, nodeidPrivatekey, 'hex')
    let nodeids = ethUtil.privateToPublic(privateKeys).toString('hex')
    let encoded = abi.simpleEncode("withdraw(bytes,address):(bytes,uint256)",
        nodeids,
        web3.thk.defaultAddress.toLowerCase()
    );
    let objs = {
        chainId: '2',
        fromChainId: '2',
        toChainId: '2',
        from: web3.thk.defaultAddress.toLowerCase(),
        to: contract,
        nonce: balancess.nonce.toString(),
        value: asset,
        input: encoded.toString('hex'),
        useLocal: false,
        extra: ''
    };

    //签名参数
    let TxParams = web3.thk.signTransaction(objs, privateKey)
    return web3.thk.SendTx(TxParams)
}

/**
 * @description: pos提现领奖
 * @param {string} asset   质押金额
 * @param {string} contract   钱包地址绑定合约地址
 * @return:
 */
function withDrawCash(asset, contract) {    //提现
    let balancess = getAccount('2', web3.thk.defaultAddress);
    let encoded = abi.simpleEncode("withdrawCash(uint256):(uint256)", asset);
    let objs = {
        chainId: '2',
        fromChainId: '2',
        toChainId: '2',
        from: web3.thk.defaultAddress.toLowerCase(),
        to: contract.toLowerCase(),
        nonce: balancess.nonce.toString(),
        value: '0',
        input: encoded.toString('hex'),
        useLocal: false,
        extra: ''
    };

    //签名参数
    let TxParams = web3.thk.signTransaction(objs, privateKey)
    return web3.thk.SendTx(TxParams)
}

let privateKeys = new Buffer.alloc(32, '9a06fcd977f574525a866792f747702fa4f762bac39e46cf5894a8b3125564e7', 'hex')
let nodeids = ethUtil.privateToPublic(privateKeys).toString('hex');
console.log(nodeids);

// let testResult = depositSendTx('200000000000000000000000','0x7180874668217daf6f64b64c17898b5547352b7f','9a646fea4be071d1710e16b0a3f3c4b74b21a2f3ea50c67d7b54b83b7c31340c');
// console.log('get send transaction result',testResult);
// let withDrawResult = withDraw('200000000000000000000000','0x7180874668217daf6f64b64c17898b5547352b7f','9a646fea4be071d1710e16b0a3f3c4b74b21a2f3ea50c67d7b54b83b7c31340c');
// console.log('get send withdraw result',withDrawResult);
// let withDrawCashResult = withDrawCash();
// console.log('get send withdraw cash result',withDrawCashResult);

// 获取账户信息  也可获取nonce
// let balancess = getAccount('1', web3.thk.defaultAddress);
// console.log('get account balance response',balancess);

// 执行一笔交易
// let sendtxResp = sendTx('1', web3.thk.defaultAddress,'0x1900c8ee3b3a511db4f0297c8df7151ffdb71709', '10000000000000000000000', balancess.nonce.toString(), web3.thk.defaultPrivateKey,'');
// console.log("get sendtx response:",sendtxResp);

//通过交易hash获取交易详情
// var getTxByHashResp = getTxHashRes(web3.thk.defaultChainId, '0xba2fe9309f7e1bcd1a04cd9f50a918f88d5f5da09422fa025373543463eccc09');
// console.log("get  TxByHashResp response:",getTxByHashResp);

//获取链信息
// var getStatsResp = getStateInfo(web3.thk.defaultChainId);
// console.log("get statsResp:",getStatsResp);

//获取指定账户在对应链上一定高度范围内的交易信息
// var getTxsResp = getTransactionInfos(web3.thk.defaultChainId,'0x4fa1c4e6182b6b7f3bca273390cf587b50b47311', 50, 70);
// console.log("get TxinfosResp response:", getTxsResp);

//获取一条交易的详情
// var callTransactionResp = getTransferInfo(web3.thk.defaultChainId, '2', '2', '0x0000000000000000000000000000000000000000', '0x0e50cea0402d2a396b0db1c5d08155bd219cc52e', '0', '22','0xe98b7f4d0000000000000000000000000000000000000000000000000000000000000001');
// console.log("callTransactionResp response:", callTransactionResp);

//获取指定块高信息
// var getBlockHeaderResp = getBlockHeightInfo('2', '30');
// console.log('get blockheader', getBlockHeaderResp)

//获取指定块高,指定页码数量信息
// var getBlockTxsResp = getBlockPageInfos(web3.thk.defaultChainId, '30','1','10');
// console.log("getBlockTxsResp response:", getBlockTxsResp);

//编译合约
// var compileContractResp = getCompileContract(web3.thk.defaultChainId, 'pragma solidity >= 0.4.22;contract test {function multiply(uint a) public returns(uint d) {return a * 7;}}');
// console.log("compileContractResp response:",compileContractResp);

// var hash = web3.sha3("Some string to be hashed");
// console.log(hash);

//获取链信息
// var getChainInfoResp = getChainInfos([]);
// console.log("get chaininfo res:",getChainInfoResp);

//连接指定ip+端口
// var getPingResp = pingUrl("192.168.1.13:22010");
// console.log("PING res:",getPingResp);

//获取委员会详情
// var getCommitteeResp = getCommittee(web3.thk.defaultChainId,'4');
// console.log("get committee res:",getCommitteeResp);


// function getContract(abi){
//     var getcommittee = web3.thk.contract(abi);
//     return getcommittee
// }

// var abis = [
//     {
//      "constant": false,
//      "inputs": [
//       {
//        "name": "data",
//        "type": "string"
//       }
//      ],
//      "name": "setString",
//      "outputs": [],
//      "payable": false,
//      "stateMutability": "nonpayable",
//      "type": "function"
//     },
//     {
//      "constant": true,
//      "inputs": [],
//      "name": "getString",
//      "outputs": [
//       {
//        "name": "data",
//        "type": "string"
//       }
//      ],
//      "payable": false,
//      "stateMutability": "view",
//      "type": "function"
//     },
//     {
//      "constant": true,
//      "inputs": [],
//      "name": "getA",
//      "outputs": [
//       {
//        "name": "data",
//        "type": "uint256"
//       }
//      ],
//      "payable": false,
//      "stateMutability": "view",
//      "type": "function"
//     }
//    ]
// var code = "0x60806040526152f16000556040805190810160405280600581526020017f48656c6c6f00000000000000000000000000000000000000000000000000000081525060019080519060200190610055929190610068565b5034801561006257600080fd5b5061010d565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100a957805160ff19168380011785556100d7565b828001600101855582156100d7579182015b828111156100d65782518255916020019190600101906100bb565b5b5090506100e491906100e8565b5090565b61010a91905b808211156101065760008160009055506001016100ee565b5090565b90565b6103758061011c6000396000f3fe608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680637fcaf6661461005c57806389ea642f14610124578063d46300fd146101b4575b600080fd5b34801561006857600080fd5b506101226004803603602081101561007f57600080fd5b810190808035906020019064010000000081111561009c57600080fd5b8201836020820111156100ae57600080fd5b803590602001918460018302840111640100000000831117156100d057600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506101df565b005b34801561013057600080fd5b506101396101f9565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561017957808201518184015260208101905061015e565b50505050905090810190601f1680156101a65780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156101c057600080fd5b506101c961029b565b6040518082815260200191505060405180910390f35b80600190805190602001906101f59291906102a4565b5050565b606060018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156102915780601f1061026657610100808354040283529160200191610291565b820191906000526020600020905b81548152906001019060200180831161027457829003601f168201915b5050505050905090565b60008054905090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106102e557805160ff1916838001178555610313565b82800160010185558215610313579182015b828111156103125782518255916020019190600101906102f7565b5b5090506103209190610324565b5090565b61034691905b8082111561034257600081600090555060010161032a565b5090565b9056fea165627a7a72305820197c09c4339884dcfb3804dad1a8ca4b400d10582e125ed5c7c114105bd91bc00029"
// //调用合约
// var getContractResp = getContract(abis)

// getContractResp.new({data: code}, function (err, hash) {
//     if(err) {
//         console.error('error',err);
//         return;
//     } else if(hash){
//         sleep(5000)
//         var conresp = web3.thk.GetTransactionByHash(web3.thk.defaultChainId, hash)
//         var MyContract = web3.thk.contract(abis,conresp.contractAddress);
//         var contractObj = MyContract.at(conresp.contractAddress)
//         contractObj.setString("world")
//         sleep(5000)
//         contractObj.getString()
//         console.log("get contract function res:",contractObj.getString());
//     }
// });

/**
 * 跨链交易生成支票证明
 * web3.thk.RpcMakeVccProof()    具体用法参考  eachOtherChainTransfer.js文件
 * 生成取消支票
 * web3.thk.MakeCCCExistenceProof      具体用法参考  refund.js文件
 */






