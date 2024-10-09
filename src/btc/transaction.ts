/* eslint-disable @typescript-eslint/no-explicit-any */
import { ECPairFactory, ECPairInterface } from 'ecpair';

import * as bitcoin from 'bitcoinjs-lib';
import ecc from '@bitcoinerlab/secp256k1';
import { BTC_TO_SATOSHI_MULTIPLIER, SATOSHI_TO_BTC_MULTIPLIER } from './constants';
import { streamToBuffer } from './utils';

// import { createTx, generateTxSignatures, sendTx } from './utils';


const ECPair = ECPairFactory(ecc);

const TESTNET = bitcoin.networks.testnet;
const MAINNET = bitcoin.networks.bitcoin;
const FEE = 700; //TODO: make an option


interface CreateTxResponse {
    success: boolean;
    result: string | null;
    error: string | null;
}

interface BroadcastTxResponse {
    success: boolean;
    result: string | null;
    error: string | null;
}



export default class TransactionService {
    network: bitcoin.Network;
    apiBaseUrl: string;

    constructor(isTestnet: boolean) {
        this.network = isTestnet ? TESTNET : MAINNET;
        this.apiBaseUrl = isTestnet ? 'https://mempool.space/testnet4/api' : 'https://mempool.space/api';
    }

    private _buildCreateResponse(success: boolean, result: string | null, error: string | null = null): CreateTxResponse {
        if (!success) {
            console.log("ERRROR: ", error);
        }
        return {
            success,
            result,
            error,
        };
    }

    private _buildBroadcastResponse(success: boolean, result: string | null, error: string | null = null): BroadcastTxResponse {
        return {
            success,
            result,
            error,
        };
    }

    private async getUtxos(address: string) {
        const response = await fetch(`${this.apiBaseUrl}/address/${address}/utxo`);
        if (!response.ok) {
            throw new Error('Error getting utxos');
        }
        const data = await response.json();
        return data;
    }

    // private async getRawTx(txId: string) {
    //     const url = `${this.apiBaseUrl}/tx/${txId}/raw`;
    //     const response = await fetch(url);

    //     if (!response.ok) {
    //         throw new Error(`Error fetching raw transaction: ${response.statusText}`);
    //     }

    //     const arrayBuffer = await response.arrayBuffer();

    //     const buffer = Buffer.from(arrayBuffer);

    //     return buffer;
    // }

    public async createTransaction(senderWif: string, recipientAddress: string, amount: number): Promise<CreateTxResponse> {
        amount = amount * BTC_TO_SATOSHI_MULTIPLIER;


        const keyPair: ECPairInterface = ECPair.fromWIF(senderWif, this.network);

        const { address } = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: this.network });
        console.log(address);


        if (address == null) {
            return this._buildCreateResponse(false, null, "Could not get address");
        }
        const utxos = await this.getUtxos(address);

        if (utxos.length === 0) {
            return this._buildCreateResponse(false, null, "No UTXOs found for the given address.");
        }

        const psbt = new bitcoin.Psbt({ network: this.network });

        let inputSum = 0;

        utxos.forEach(async (utxo: any) => {

            // const rawTx = await this.getRawTx(utxo.txid);
            console.log(utxo)
            psbt.addInput({
                hash: utxo.txid,
                index: utxo.vout,
                sequence: 0xfffffffd,
                witnessUtxo: {
                    script: bitcoin.address.toOutputScript(address, this.network),
                    value: utxo.value, // satoshis
                },
                // nonWitnessUtxo: rawTx,
            });
            inputSum += utxo.value;
        });

        psbt.addOutput({
            address: recipientAddress,
            value: amount,
        });

        const change = inputSum - amount - FEE;
        if (change > 0) {
            psbt.addOutput({
                address: address,
                value: change,
            });
        }

        psbt.signAllInputs(keyPair);
        psbt.finalizeAllInputs();

        const transactionHex = psbt.extractTransaction().toHex();

        return this._buildCreateResponse(true, transactionHex, null);

    }

    async broadcastTransaction(transactionHex: string) {

        try {
            const response = await fetch(`${this.apiBaseUrl}/tx`, { method: 'POST', body: transactionHex, headers: { 'Content-Type': 'text/plain' }, },);
            const hash = await response.text();

            return this._buildBroadcastResponse(true, hash, null);

        } catch (error) {

            return this._buildBroadcastResponse(false, null, `Error: ${error}`);
        }

    }

    // public async sendTransaction(tx: any, toSign: any, signatures: any, pubkeys: any): Promise<SendTxResponse> {
    //     const result = await sendTx(tx, toSign, signatures, pubkeys, this.network === TESTNET ? 'testnet' : 'mainnet');
    //     console.log(result)
    //     console.log('------------------')
    //     if (!result.success) {
    //         return {
    //             success: false,
    //             result: null,
    //             error: result.message ?? 'unkwnown error'
    //         }
    //     }

    //     return {
    //         success: true,
    //         result: result,
    //         error: null
    //     }
    // }


    // public async sendTransaction2(senderWif: string, recipientAddress: string, amount: number) {
    //     const sender = ECPair.fromWIF(
    //         senderWif,
    //         this.network
    //     );

    //     const payment1 = createPayment('p2pkh', [sender], this.network);
    //     const payment2 = createPayment('p2pkh', [sender], this.network);

    //     console.log({ payment1 })
    //     console.log({ payment2 })

    //     const inputData1 = await getInputData(
    //         2e5,
    //         payment1.payment,
    //         true,
    //         'noredeem',
    //     );
    //     const inputData2 = await getInputData(
    //         7e4,
    //         payment2.payment,
    //         true,
    //         'noredeem',
    //     );

    //     const { hash, index, nonWitnessUtxo } = inputData1;

    //     console.log({ hash, index, nonWitnessUtxo });

    //     const psbt = new bitcoin.Psbt({ network: this.network })
    //         .addInput(inputData1)
    //         .addInput(inputData2)
    //         .addOutput({
    //             address: recipientAddress,
    //             value: 8e4,
    //         }).addOutput({
    //             address: payment2.payment.address, // OR script, which is a Buffer.
    //             value: 1e4,
    //         });

    //     const psbtBaseText = psbt.toBase64();
    //     const signer1 = bitcoin.Psbt.fromBase64(psbtBaseText);
    //     const signer2 = bitcoin.Psbt.fromBase64(psbtBaseText);
    //     signer1.signAllInputs(payment1.keys[0]);
    //     signer2.signAllInputs(payment2.keys[0]);

    //     const s1text = signer1.toBase64();
    //     const s2text = signer2.toBase64();

    //     const final1 = bitcoin.Psbt.fromBase64(s1text);
    //     const final2 = bitcoin.Psbt.fromBase64(s2text);

    //     psbt.combine(final1, final2);

    //     psbt.finalizeAllInputs();

    //     const tx = psbt.extractTransaction().toHex();
    //     console.log('----------');
    //     console.log(tx);
    //     console.log('----------');

    //     return tx;

    // }
}