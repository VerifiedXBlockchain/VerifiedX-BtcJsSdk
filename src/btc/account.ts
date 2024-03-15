import * as bitcoin from 'bitcoinjs-lib';
import { SATOSHI_TO_BTC_MULTIPLIER } from './constants';

const TESTNET = bitcoin.networks.testnet;
const MAINNET = bitcoin.networks.bitcoin;

export default class AccountService {
    network: bitcoin.Network;

    constructor(isTestnet: boolean) {
        this.network = isTestnet ? TESTNET : MAINNET;
    }

    public async addressInfo(address: string, inSatoshis = true) {
        const url = `https://api.blockcypher.com/v1/btc/${this.network === TESTNET ? 'test3' : 'main'}/addrs/${address}/balance`;
        const response = await fetch(url);
        const data = await response.json();

        return {
            totalRecieved: inSatoshis ? data.total_received : data.total_received * SATOSHI_TO_BTC_MULTIPLIER,
            totalSent: inSatoshis ? data.total_sent : data.total_sent * SATOSHI_TO_BTC_MULTIPLIER,
            balance: inSatoshis ? data.balance : data.balance * SATOSHI_TO_BTC_MULTIPLIER,
            unconfirmedBalance: inSatoshis ? data.unconfirmed_balance : data.unconfirmed_balance * SATOSHI_TO_BTC_MULTIPLIER,
            finalBalance: inSatoshis ? data.final_balance : data.final_balance * SATOSHI_TO_BTC_MULTIPLIER,
            txCount: data.n_tx,
            unconfirmedTxCount: data.unconfirmed_n_tx,
            finalTxCount: data.final_n_tx,
        }
    }

    public async transactions(address: string, limit = 50, before: number | null = null) {
        let url = `https://api.blockcypher.com/v1/btc/${this.network === TESTNET ? 'test3' : 'main'}/addrs/${address}/full?limit=${limit}`;
        if (before) {
            url += `&before=${before}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        const transactions = data['txs'];

        return {
            canLoadMore: data['hasMore'],
            transactions: transactions,
        }
    }


}