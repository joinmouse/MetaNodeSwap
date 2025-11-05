// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IUniswapV2Factory {
    // 交易对创建事件
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    // 获取费率
    function feeTo() external view returns (address);
    function feeToSetter() external view returns (address);

    // 获取交易对
    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function allPairs(uint) external view returns (address pair);
    function allPairsLength() external view returns (uint);

    // 创建交易对
    function createPair(address tokenA, address tokenB) external returns (address pair);

    // 设置费率
    function setFeeTo(address) external;
    function setFeeToSetter(address) external;
}
