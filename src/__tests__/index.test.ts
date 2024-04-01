import KeypairService from '../btc/keypair';
import TransactionService from '../btc/transaction';
import AccountService from '../btc/account';
import { BTC_TO_SATOSHI_MULTIPLIER, SATOSHI_TO_BTC_MULTIPLIER } from '../btc/constants';

describe('Keypairs', () => {
  let keypairService: KeypairService;

  beforeAll(() => {
    keypairService = new KeypairService(true);
  });

  test('can generate random keypair', () => {
    const data = keypairService.keypairFromRandom();
    expect(data).toBeTruthy();
  });

  test('keypair has address, wif, privateKey, and publicKey', () => {
    const { address, wif, privateKey, publicKey } = keypairService.keypairFromRandom();
    expect(address).toBeTruthy();
    expect(wif).toBeTruthy();
    expect(privateKey).toBeTruthy();
    expect(publicKey).toBeTruthy();
  });

  test('can generate random mnumonic', () => {
    const data = keypairService.keypairFromRandomMnemonic();
    expect(data).toBeTruthy();
  });

  test('random mnumonic has address, wif, privateKey, publicKey, and mnumonic', () => {
    const { address, wif, privateKey, publicKey, mnemonic } = keypairService.keypairFromRandomMnemonic();
    expect(address).toBeTruthy();
    expect(wif).toBeTruthy();
    expect(privateKey).toBeTruthy();
    expect(publicKey).toBeTruthy();
    expect(mnemonic).toBeTruthy();
  });

  test('mnumonic generates correct address', () => {
    const data = keypairService.keypairFromMnemonic("entire taste skull already invest view turtle surge razor key next buffalo venue canoe sheriff winner wash ten subject hamster scrap unit shield garden", 0);
    expect(data).toBeTruthy();
    expect(data.address).toEqual("tb1qkh6v5vgl9307ukuxzg6h8frsm8azr0vq5ye8r9")
  });

  test('can generate correct address from wif', () => {
    const data = keypairService.keypairFromWif("cPQ5kbnuj8YmBoCaFmsPsZENVykN1GGmF18mg6sEZsJPX2np6PRa");
    expect(data).toBeTruthy();
    expect(data.address).toEqual("tb1qh0nx4epkftfz3gmztkg9qmcyez604q36snzg0n")
  });

  test('can generate correct address from email password', () => {
    const data = keypairService.keypairFromEmailPassword("tyler@tylersavery.com", 'password123', 0);
    expect(data).toBeTruthy();
    expect(data.address).toEqual("tb1q5vrsqhy9rtufemt643mx3j3nu6d2fh7gu5ncaj")
  });


  test('generates different addresses from different email/password combos', () => {
    const data = keypairService.keypairFromEmailPassword("tyler@tylersavery.com", 'password123', 0);
    expect(data).toBeTruthy();

    const data2 = keypairService.keypairFromEmailPassword("tyler2@tylersavery.com", 'password456', 0);
    expect(data2).toBeTruthy();
    expect(data.address == data2.address).toBeFalsy();
  });


});



// describe('Transactions', () => {
//   let transactionService: TransactionService;

//   beforeAll(() => {
//     transactionService = new TransactionService(true);
//   });

//   test('can create tx', async () => {

//     const senderWif = "cPQ5kbnuj8YmBoCaFmsPsZENVykN1GGmF18mg6sEZsJPX2np6PRa"
//     const senderAddress = "tb1qh0nx4epkftfz3gmztkg9qmcyez604q36snzg0n"
//     const recipientAddress = "tb1q4lahda9feljf695q473z4m8m7xhgzv35n6226q"
//     const amount = 0.000003

//     const data = await transactionService.createTransaction(senderWif, senderAddress, recipientAddress, amount);
//     expect(data.success).toEqual(true);
//     const hash = data.result?.tx.hash;
//     expect(hash).toBeTruthy();
//   });


// });



// describe('Account', () => {
//   let accountService: AccountService;

//   beforeAll(() => {
//     accountService = new AccountService(true);
//   });

//   test('can get address info', async () => {

//     const address = "tb1qh0nx4epkftfz3gmztkg9qmcyez604q36snzg0n"

//     const data = await accountService.addressInfo(address);
//     expect(data).toBeTruthy();
//     expect(data.balance).toBeTruthy();

//     const dataBtc = await accountService.addressInfo(address, false);
//     expect(dataBtc).toBeTruthy();
//     expect(dataBtc.balance).toEqual(data.balance * SATOSHI_TO_BTC_MULTIPLIER);

//     await new Promise(resolve => setTimeout(resolve, 3000));

//   });

//   test('can get transactions and outputs', async () => {

//     const address = "tb1qh0nx4epkftfz3gmztkg9qmcyez604q36snzg0n"

//     const data = await accountService.transactions(address);
//     expect(data).toBeTruthy();
//     expect(data.transactions.length).toBeGreaterThan(1);

//     await new Promise(resolve => setTimeout(resolve, 3000));

//   });

// test('can paginate txs', async () => {

//   const address = "tb1qh0nx4epkftfz3gmztkg9qmcyez604q36snzg0n"

//   const data = await accountService.transactions(address, 2);
//   expect(data).toBeTruthy();
//   expect(data.transactions.length).toBeGreaterThan(1);

//   const lastResult = data.transactions[data.transactions.length - 1];
//   const dataPage2 = await accountService.transactions(address, 2, lastResult.block_height);

//   await new Promise(resolve => setTimeout(resolve, 3000));


//   expect(dataPage2).toBeTruthy();
//   expect(dataPage2.transactions.length).toBeGreaterThan(1);

//   const page2lastResult = dataPage2.transactions[dataPage2.transactions.length - 1];

//   expect(page2lastResult.block_height).toBeLessThan(lastResult.block_height);

// });


// });