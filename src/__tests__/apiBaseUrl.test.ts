import TransactionService from '../btc/transaction';
import AccountService from '../btc/account';
import { MAINNET_API_BASE_URL, TESTNET_API_BASE_URL } from '../btc/constants';

describe('API base URL', () => {
  test('testnet uses the VerifiedX signet Esplora API', () => {
    expect(TESTNET_API_BASE_URL).toEqual('https://signet.verifiedx.io/api');
    expect(new TransactionService(true).apiBaseUrl).toEqual(TESTNET_API_BASE_URL);
    expect(new AccountService(true).apiBaseUrl).toEqual(TESTNET_API_BASE_URL);
  });

  test('mainnet still uses mempool.space', () => {
    expect(MAINNET_API_BASE_URL).toEqual('https://mempool.space/api');
    expect(new TransactionService(false).apiBaseUrl).toEqual(MAINNET_API_BASE_URL);
    expect(new AccountService(false).apiBaseUrl).toEqual(MAINNET_API_BASE_URL);
  });

  test('account lookups hit the configured base', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      json: async () => ({ chain_stats: { funded_txo_sum: 0, spent_txo_sum: 0, tx_count: 0 } }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    await new AccountService(true).addressInfo('tb1qh0nx4epkftfz3gmztkg9qmcyez604q36snzg0n');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://signet.verifiedx.io/api/address/tb1qh0nx4epkftfz3gmztkg9qmcyez604q36snzg0n',
    );
  });
});
