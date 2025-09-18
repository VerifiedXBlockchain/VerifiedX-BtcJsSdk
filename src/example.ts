import { BtcClient } from './index';
import type { BtcKeypair, AccountInfo, Transaction } from './types';

// Example usage of the BTC API with full TypeScript support

async function example() {
  // Initialize client for testnet with dry run enabled
  const btcClient = new BtcClient("testnet", true);

  // Generate a new keypair
  const keypair: BtcKeypair = btcClient.generatePrivateKey();
  console.log('Generated keypair:', {
    address: keypair.address,
    privateKey: keypair.privateKey,
    publicKey: keypair.publicKey
  });

  // Generate from mnemonic
  const mnemonicKeypair: BtcKeypair = btcClient.generateMnemonic();
  console.log('Generated from mnemonic:', {
    address: mnemonicKeypair.address,
    mnemonic: mnemonicKeypair.mnemonic
  });

  // Restore from existing mnemonic
  if (mnemonicKeypair.mnemonic) {
    const restoredKeypair: BtcKeypair = btcClient.privateKeyFromMnemonic(mnemonicKeypair.mnemonic, 0);
    console.log('Restored keypair:', restoredKeypair.address);
  }

  // Get address info
  try {
    if (keypair.address) {
      const addressInfo: AccountInfo = await btcClient.getAddressInfo(keypair.address);
      console.log('Address info:', addressInfo);

      // Get transactions
      const transactions: Transaction[] = await btcClient.getTransactions(keypair.address, 10);
      console.log('Transactions:', transactions.length);

      // Get fee rates
      const feeRates = await btcClient.getFeeRates();
      console.log('Fee rates:', feeRates);

      // Create and send transaction (dry run)
      const txResult = await btcClient.sendBtc(
        keypair.wif,
        "tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx", // Example testnet address
        0.001, // 0.001 BTC
        10 // 10 sat/vB fee rate
      );
      console.log('Transaction result:', txResult);
    }
  } catch (error) {
    console.error('Error:', error);
  }

  // Sign a message
  const message = "Hello Bitcoin!";
  if (keypair.privateKey) {
    const signature = btcClient.getSignature(message, keypair.privateKey);
    console.log('Message signature:', signature);
  }
}

// Browser usage example
// In browser environment:
// const client = new window.btc.BtcClient("mainnet", false);
// const keypair = client.generatePrivateKey();

export { example };