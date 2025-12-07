import { Steps, message } from 'antd';
import { dealNumber, dealNumber_18 } from '_src/components/Coin_pool/help';

import Button1 from '_components/Button';
import ConnectWallet from '_components/ConnectWallet';
import React from 'react';
import pageURL from '_constants/pageURL';
import services from '_src/services';

const { Step } = Steps;

interface LendActionButtonsProps {
  current: number;
  steps: any[];
  chainId: number | undefined;
  loadings: boolean;
  lendvalue: number;
  balance: string;
  poolinfo: any;
  pid: string;
  mode: string;
  warning: string;
  setwarning: (warning: string) => void;
  setloadings: (loading: boolean) => void;
  next: () => void;
  prev: () => void;
  openNotification: (message: string) => void;
  openNotificationerror: (message: string) => void;
  openNotificationlend: (message: string) => void;
  openNotificationerrorlend: (message: string) => void;
}

const LendActionButtons: React.FC<LendActionButtonsProps> = ({
  current,
  steps,
  chainId,
  loadings,
  lendvalue,
  balance,
  poolinfo,
  pid,
  mode,
  warning,
  setwarning,
  setloadings,
  next,
  prev,
  openNotification,
  openNotificationerror,
  openNotificationlend,
  openNotificationerrorlend,
}) => {
  const validateLendTransaction = () => {
    const currentTime = Math.round(new Date().getTime() / 1000).toString();
    if ((poolinfo[pid]?.state ?? 0) > 2) {
      setwarning('The pool has finished');
      return false;
    }
    if (lendvalue > (poolinfo[pid]?.maxSupply ?? 0)) {
      setwarning('Maximum exceeded');
      return false;
    }
    if (currentTime > (poolinfo[pid]?.settleTime ?? 0)) {
      setwarning('Over time');
      return false;
    }
    if (lendvalue > (balance && Number(dealNumber_18(balance)))) {
      setwarning('transfer amount exceeds balance');
      return false;
    }
    if (Number(lendvalue) + Number(poolinfo[pid]?.available_to_lend[1] ?? 0) > Number(poolinfo[pid]?.maxSupply ?? 0)) {
      setwarning('Exceed limit');
      return false;
    }
    setwarning('');
    return true;
  };

  const handleLendApprove = async () => {
    if (!validateLendTransaction()) return;
    setloadings(true);
    const num = dealNumber(lendvalue);
    try {
      await services.ERC20Server.Approve(poolinfo[pid]?.Sp ?? 0, num, chainId);
      openNotification('Success');
      setloadings(false);
      next();
      await services.ERC20Server.allowance(poolinfo[pid]?.Sp ?? 0, chainId);
    } catch (error) {
      openNotificationerror('Error');
      setloadings(false);
    }
  };

  const handleLendExecute = async () => {
    if (!validateLendTransaction()) return;
    setloadings(true);
    const num = dealNumber(lendvalue);
    try {
      await services.PoolServer.depositLend(pid, num, poolinfo[pid]?.Sp ?? 0, chainId);
      setloadings(false);
      openNotificationlend('Success');
      prev();
      window.open(`${pageURL.Lend_Borrow.replace(':mode', `${mode}`)}`, '_self');
    } catch (error) {
      openNotificationerrorlend('Error');
      setloadings(false);
    }
  };

  return (
    <div>
      <div className="steps-action" style={{ display: 'flex', justifyContent: 'space-between', margin: '42px 0 10px' }}>
        {current < steps.length - 1 && (
          <>
            {chainId === undefined ? (
              <ConnectWallet className="borrowwallet" />
            ) : (
              <Button1
                style={{ width: '48%', borderRadius: '15px' }}
                loading={loadings}
                onClick={handleLendApprove}
                disabled={lendvalue === 0 || lendvalue == null}
              >
                Approve
              </Button1>
            )}
            <Button1 style={{ width: '48%' }} disabled={true} onClick={() => message.success('Processing complete!')}>
              Lend
            </Button1>
          </>
        )}
        {current === steps.length - 1 && (
          <>
            <Button1 style={{ width: '48%', borderRadius: '15px' }} disabled={true}>
              Approve
            </Button1>
            <Button1 loading={loadings} style={{ width: '48%', borderRadius: '15px' }} onClick={handleLendExecute}>
              Lend
            </Button1>
          </>
        )}
      </div>
      <Steps current={current} style={{ width: '60%', margin: '0 auto' }}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
    </div>
  );
};

export default LendActionButtons;
