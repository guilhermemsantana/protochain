import Transaction from "../transaction";

/**
 * The type with the information needed to mine a new block
 */
export type BlockInfo = {
    index: number;
    previousHash: string;
    difficulty: number;
    maxDifficulty: number;
    feePerTx: number;
    transactions: Transaction[];
};