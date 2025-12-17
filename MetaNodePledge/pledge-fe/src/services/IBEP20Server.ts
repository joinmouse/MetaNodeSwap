import { gasOptions, getIBEP20Contract } from './web3';
import type { IBEP20 } from '_src/contracts/IBEP20';
import { pledge_address, ORACLE_address } from '_src/utils/constants';

const IBEP20Server = {
  async getfaucet_transfer(contractAddress) {
    const contract = getIBEP20Contract(contractAddress);
    let options = await gasOptions();

    // faucet_transfer 无参数，合约内部使用 msg.sender 获取调用者地址
    const rates = await contract.methods.faucet_transfer().send(options);
    return rates;
  },
};

export default IBEP20Server;
