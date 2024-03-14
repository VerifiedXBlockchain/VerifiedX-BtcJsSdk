import KeypairService from '../btc/keypair';

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
    expect(data.address).toEqual("tb1qwh4zgpkysn8j53flz303u8tn0nvj293ey72u3k")
  });


});
