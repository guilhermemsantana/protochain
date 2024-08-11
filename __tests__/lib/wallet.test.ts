import Wallet from "../../src/lib/wallet";
import TransactionInput from "../../src/lib/transactionInput";

describe("Wallet tests", () => {

    const exampleWIF = "5HueCGU8rMjxEXxiPuD5BDku4MkFqeZyd4dZ1jvhTVqvbTLvyTJ";
    let alice: Wallet;

    beforeAll(() => {
        alice = new Wallet();
    });

    test("Should generate wallet", () => {
        const wallet = new Wallet();
        expect(wallet.privateKey).toBeTruthy();
        expect(wallet.publicKey).toBeTruthy();
    });

    test("Should recover wallet from private key", () => {
        const wallet = new Wallet(alice.privateKey);
        expect(wallet.privateKey).toBeTruthy();
        expect(wallet.publicKey).toBeTruthy();
        expect(wallet.privateKey).toEqual(alice.privateKey);
        expect(wallet.publicKey).toEqual(alice.publicKey);
    });

    test("Should recover wallet from WIF", () => {
        const wallet = new Wallet(exampleWIF);
        expect(wallet.privateKey).toBeTruthy();
        expect(wallet.publicKey).toBeTruthy();
    });

});