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

        const url = `https://mempool.space${this.network == TESTNET ? '/testnet4' : ''}/api/address/${address}`;

        const response = await fetch(url);
        const result = await response.json();

        const data = result['chain_stats'];

        const totalRecieved = inSatoshis ? data.funded_txo_sum : data.funded_txo_sum * SATOSHI_TO_BTC_MULTIPLIER;
        const totalSent = inSatoshis ? data.spent_txo_sum : data.spent_txo_sum * SATOSHI_TO_BTC_MULTIPLIER;

        return {
            totalRecieved: totalRecieved,
            totalSent: totalSent,
            balance: totalRecieved - totalSent,
            txCount: data.tx_count,
        }

    }

    public async transactions(address: string, limit = 50, before: number | null = null) {
        const url = `https://mempool.space${this.network == TESTNET ? '/testnet4' : ''}/api/address/${address}`;


        // if (before) {
        //     url += `&before=${before}`;
        // }

        // const response = await fetch(url);
        // const data = await response.json();

        // const transactions = data['txs'];

        // return {
        //     canLoadMore: data['hasMore'],
        //     transactions: transactions,
        // }
    }


}