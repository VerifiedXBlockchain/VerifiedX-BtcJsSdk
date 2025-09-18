# BTC JS Library with TypeScript Support

A comprehensive Bitcoin library with full TypeScript support for keypair generation, transaction creation, and account management on both testnet and mainnet.

## Features

- **Full TypeScript Support**: Complete type definitions for all BTC functionality
- **Unified BTC Client**: Simple, clean API similar to modern crypto libraries
- **Multiple Address Types**: Support for Legacy (P2PKH), Nested SegWit (P2SH), Native SegWit (P2WPKH), and Taproot (P2TR)
- **Keypair Management**: Generate from random, mnemonic, private key, or email/password
- **Transaction Operations**: Create, sign, and broadcast Bitcoin transactions
- **Account Information**: Get address balances, transaction history, and UTXO data
- **Fee Estimation**: Real-time fee rate recommendations
- **Browser and Node.js**: Works in both environments

## Installation

```bash
npm install
npm run build:browser  # For browser usage
npm run build:node     # For Node.js usage
```

## Basic Usage

### TypeScript/ES6 Modules

```typescript
import { BtcClient } from './src';
import type { BtcKeypair, AccountInfo } from './src/types';

// Initialize client
const btcClient = new BtcClient("testnet", false); // network, dryRun

// Generate keypair
const keypair: BtcKeypair = btcClient.generatePrivateKey();
console.log(keypair.address); // Native SegWit address
console.log(keypair.addresses.p2pkh); // Legacy address
console.log(keypair.addresses.bech32m); // Taproot address

// Get account info
const accountInfo: AccountInfo = await btcClient.getAddressInfo(keypair.address);
console.log(`Balance: ${accountInfo.balance} satoshis`);

// Send Bitcoin
const txId = await btcClient.sendBtc(
  keypair.wif,
  "recipient_address",
  0.001, // 0.001 BTC
  10     // 10 sat/vB fee rate
);
```

### Browser Usage

```html
<script src="./lib/browser.js"></script>
<script>
  const client = new window.btc.BtcClient("mainnet", false);
  const keypair = client.generatePrivateKey();
  console.log('Address:', keypair.address);
</script>
```

## API Reference

### BtcClient

The main client class providing a unified interface for all Bitcoin operations.

#### Constructor
```typescript
new BtcClient(network: "mainnet" | "testnet", dryRun: boolean = false)
```

#### Keypair Methods
- `generatePrivateKey(): BtcKeypair` - Generate random keypair
- `generateMnemonic(words?: 12 | 24): BtcKeypair` - Generate from mnemonic
- `privateKeyFromMnemonic(mnemonic: string, index?: number): BtcKeypair` - Restore from mnemonic
- `addressFromPrivate(privateKey: string): BtcKeypair` - Import from private key
- `addressFromWif(wif: string): BtcKeypair` - Import from WIF

#### Account Methods
- `getAddressInfo(address: string): Promise<AccountInfo>` - Get balance and stats
- `getTransactions(address: string, limit?: number): Promise<Transaction[]>` - Get transaction history

#### Transaction Methods
- `getFeeRates(): Promise<FeeRates>` - Get current fee rates
- `createTransaction(senderWif, recipientAddress, amount, feeRate?): Promise<CreateTxResponse>` - Create transaction
- `broadcastTransaction(transactionHex: string): Promise<BroadcastTxResponse>` - Broadcast transaction
- `sendBtc(senderWif, recipientAddress, amount, feeRate?): Promise<string | null>` - Send Bitcoin (create + broadcast)

#### Signing Methods
- `getSignature(message: string, privateKey: string): string` - Sign message with private key
- `getSignatureFromWif(message: string, wif: string): string` - Sign message with WIF

### Type Definitions

All types are exported from `./src/types.ts`:

```typescript
import type {
  BtcKeypair,      // Keypair with all address types
  BtcAddresses,    // Object containing all address formats
  AccountInfo,     // Account balance and transaction count
  Transaction,     // Transaction details
  FeeRates,        // Current network fee rates
  CreateTxResponse,// Transaction creation result
  BroadcastTxResponse // Transaction broadcast result
} from './src/types';
```

## Development

```bash
npm run build        # Build for Node.js
npm run build:browser # Build for browser
npm run test         # Run tests
npm run lint         # Run linter
```

Open `example/index.html` in your browser to test the functionality.