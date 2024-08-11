import Validation from "../validation";

/**
 * Mocked Transaction input class
 */
export default class TransactionInput {
    fromAddress: string;
    amount: number;
    signature: string;

    /**
     * Creates a new TransactionInput
     * @param txInput The tx input data
     */
    constructor (txInput?: TransactionInput) {
        this.fromAddress = txInput?.fromAddress || "wallet1";
        this.amount = txInput?.amount || 10;
        this.signature = txInput?.signature || "abc";
    };

    /**
     * Generate the tx input signature
     * @param privateKey the 'from' private key
     */
    sign (privateKey: string): void {
        this.signature = "abc";
    };

    /**
     * Generates the tx input hash
     * @returns The tx input hash
     */
    getHash() : string {
        return "abc";
    };

    /**
     * Validates if the tx input is ok
     * @returns Returns a validation result object
     */
    isValid(): Validation {
        if (!this.signature) {
            return new Validation (false, "Signature is required.");
        }

        if (this.amount < 1) {
            return new Validation(false, "Amount must be greater than zero.")
        }

        return new Validation();
    };
}