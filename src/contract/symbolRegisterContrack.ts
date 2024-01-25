import { SupportedELFChainId, IContractOptions, ContractMethodType, ISendResult, IContractError } from 'types';
import { store } from 'redux/store';
import { formatErrorMsg } from './util';
import { getTxResult } from 'utils/getTxResult';
import { sleep } from 'utils/common';
import { GetContractServiceMethod } from './baseContract';

export const symbolRegisterContractRequest = async <T, R>(
  methodName: string,
  params: T,
  options?: IContractOptions,
): Promise<R | ISendResult> => {
  const info = store.getState().elfInfo.elfInfo;

  const contractAddress = info.symbolRegisterMainAddress || '';

  const curChain: Chain = SupportedELFChainId.MAIN_NET;

  console.log(
    '=====symbolRegisterContractRequest methodName, type, contractAddress, curChain, params: ',
    methodName,
    options?.type,
    contractAddress,
    curChain,
    params,
  );

  const CallContractMethod = GetContractServiceMethod(curChain, options?.type);

  try {
    const res: R = await CallContractMethod({
      contractAddress,
      methodName,
      args: params,
    });
    console.log('=====symbolRegisterContractRequest res: ', methodName, res);
    const result = res as IContractError;

    if (result?.error || result?.code || result?.Error) {
      throw formatErrorMsg(result);
    }

    if (options?.type === ContractMethodType.VIEW) {
      return res;
    }

    const { transactionId, TransactionId } = result.result || result;
    const resTransactionId = TransactionId || transactionId;
    await sleep(1000);
    const transaction = await getTxResult(resTransactionId!, curChain as Chain);

    console.log('=====symbolRegisterContractRequest transaction: ', methodName, transaction);
    return { TransactionId: transaction.TransactionId, TransactionResult: transaction.txResult };
  } catch (error) {
    console.error('=====symbolRegisterContractRequest error test:', methodName, JSON.stringify(error));
    const resError = error as IContractError;
    throw formatErrorMsg(resError);
  }
};
