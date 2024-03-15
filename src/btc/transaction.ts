/* eslint-disable @typescript-eslint/no-explicit-any */
import * as bitcoin from 'bitcoinjs-lib';

import { createTx, generateTxSignatures, sendTx } from './utils';



const TESTNET = bitcoin.networks.testnet;
const MAINNET = bitcoin.networks.bitcoin;


interface CreateTxData {
    tx: any;
    toSign: any;
    signatures: any;
    pubkeys: any;
}

interface CreateTxResponse {
    success: boolean;
    result: CreateTxData | null;
    error: string | null;
}



export default class TransactionService {
    network: bitcoin.Network;

    constructor(isTestnet: boolean) {
        this.network = isTestnet ? TESTNET : MAINNET;
    }

    private _buildCreateResponse(success: boolean, result: CreateTxData | null, error: string | null = null): CreateTxResponse {
        return {
            success,
            result,
            error,
        };
    }

    public async createTransaction(senderWif: string, senderAddress: string, recipientAddress: string, amount: number): Promise<CreateTxResponse> {
        const networkName = this.network === TESTNET ? 'testnet' : 'mainnet';
        const txResponse = await createTx(recipientAddress, amount, networkName, senderAddress);

        if (txResponse?.code != 1) {
            console.log(txResponse.message);
            return this._buildCreateResponse(false, null, txResponse.message);
        }
        const tx = txResponse.result.tx;
        const toSign = txResponse.result.tosign;
        const signaturesResponse = generateTxSignatures(senderWif, this.network, toSign);
        const signatures = signaturesResponse.signatures;
        const pubkeys = signaturesResponse.pubkeys;

        if (!signatures || !pubkeys) {
            console.log('invalid signatures or pubkeys')

            return this._buildCreateResponse(false, null, "invalid signatures or pubkeys");

        }

        const data = await sendTx(tx, toSign, signatures, pubkeys, this.network === TESTNET ? 'testnet' : 'mainnet');

        if (!data.success) {
            console.log(data.message)
            return this._buildCreateResponse(false, null, data.message);
        }

        return this._buildCreateResponse(true, data.result, null);



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