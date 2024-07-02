/**
 * The interface with the information needed to mine a new block
 */
export default interface BlockInfo {
    index: number;
    previousHash: string;
    difficulty: number;
    maxDifficulty: number;
    feePerTx: number;
    data: string;
};