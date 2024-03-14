import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';
import ecc from '@bitcoinerlab/secp256k1';
import { BIP32Factory } from 'bip32';


const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);


export const publicKeyToAddress = (publicKey: Buffer, network: bitcoin.Network) => {

    return bitcoin.payments.p2wpkh({ pubkey: publicKey, network: network }).address;
}

export const wifToPrivateKey = (wif: string, network: bitcoin.Network) => {
    return ECPair.fromWIF(wif, network).privateKey;
}

export const seedToPrivateKey = (seed: string, index = 0, network: bitcoin.Network) => {
    const root = bip32.fromSeed(Buffer.from(seed, 'hex'), network);
    const child = root.derivePath(`m/44'/0'/0'/0/${index}`);
    return wifToPrivateKey(child.toWIF(), network);
}

export function hashSeed(seed: string) {

    const seedBuffer = Buffer.from(seed, 'hex');
    const hashBuffer = bitcoin.crypto.sha256(seedBuffer);

    // Convert the resulting hash Buffer to a hexadecimal string
    const hashHex = hashBuffer.toString('hex');

    return hashHex;



    // // Encode the seed string into a Uint8Array using TextEncoder
    // const encoder = new TextEncoder();
    // const data = encoder.encode(seed);

    // // Use the SubtleCrypto interface to hash the data with SHA-256
    // bitcoin.crypto.sha256(data);
    // const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // // Convert the hash from an ArrayBuffer to a hexadecimal string
    // const hashArray = Array.from(new Uint8Array(hashBuffer));
    // const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // return hashHex;
}