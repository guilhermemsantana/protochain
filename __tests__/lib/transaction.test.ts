import Transaction from "../../src/lib/transaction";
import { TransactionType } from "../../src/lib/types/transactionType";

describe("Transaction tests", () => {

    test("Should be valid (REGULAR)", () => {
        const tx = new Transaction(
            {
                data: "tx"
            } as Transaction
        )

        const validation = tx.isValid();
        expect(validation.success).toBeTruthy();
    });

    test("Should be valid (FEE)", () => {
        const tx = new Transaction(
            {
                data: "tx",
                type: TransactionType.FEE
            } as Transaction
        )

        const validation = tx.isValid();
        expect(validation.success).toBeTruthy();
    });

    test("Should NOT be valid (hash)", () => {
        const tx = new Transaction(
            {
                data: "tx",
                type: TransactionType.REGULAR,
                timestamp: Date.now(),
                hash: "abc"
            } as Transaction
        )

        const validation = tx.isValid();
        expect(validation.success).toBeFalsy();
        expect(validation.message).not.toBeUndefined();
        expect(validation.message).toEqual("Invalid transaction hash.");
    });

    test("Should NOT be valid (data)", () => {
        const tx = new Transaction();
        const validation = tx.isValid();
        expect(validation.success).toBeFalsy();
        expect(validation.message).not.toBeUndefined();
        expect(validation.message).toEqual("Invalid transaction data.");
    });
    
});