import Wallet from "../../src/lib/wallet";
import TransactionInput from "../../src/lib/transactionInput";

describe("TransactionInput tests", () => {

    let alice : Wallet;

    beforeAll(() => {
        alice = new Wallet();
    });

    test("Should be valid", () => {
        const txInput = new TransactionInput({
            amount: 10,
            fromAddress: alice.publicKey
        } as TransactionInput);
        txInput.sign(alice.privateKey);

        const validation = txInput.isValid();
        expect(validation.success).toBeTruthy();
    });

});