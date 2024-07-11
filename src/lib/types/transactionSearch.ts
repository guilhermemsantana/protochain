import Transaction from "../transaction";

export type TransactionSearch = {
    transaction: Transaction,
    mempoolIndex: number,
    blockIndex: number
};