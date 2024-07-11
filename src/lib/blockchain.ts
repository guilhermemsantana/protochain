import Block from "./block";
import Validation from "./validation";
import { BlockInfo } from "./types/blockInfo";
import Transaction from "./transaction";
import { TransactionType } from "./types/transactionType";
import { TransactionSearch } from "./types/transactionSearch";

/**
 * Blockchain class
 */
export default class Blockchain {
    blocks: Block[];
    mempool: Transaction[];
    nextIndex: number = 0;

    static readonly DIFFICULTY_FACTOR = 5;
    static readonly MAX_DIFFICULTY = 62;
    static readonly TX_PER_BLOCK = 2;

    /**
     * Creates a new blockchain
     */
    constructor() {
        this.mempool = [];
        this.blocks = [
            new Block(
                {
                    index: this.nextIndex,
                    previousHash: "",
                    transactions: [
                        new Transaction(
                            {
                                type: TransactionType.FEE,
                                data: new Date().toString()
                            } as Transaction
                        )
                    ] as Transaction[]
                } as Block
            )
        ];
        this.nextIndex++;
    };

    /**
     * Gets the last block of the blockchain
     * @returns Returns the block in the last position based on blockchain length
     */
    getLastBlock(): Block {
        return this.blocks[this.blocks.length - 1];
    };

    addTransaction(transaction: Transaction): Validation {
        if (!transaction.isValid().success) {
             return new Validation(false, `Invalid tx: ${transaction.isValid().message}`);
        }

        if (this.blocks.some(b => b.transactions.some(tx => tx.hash === transaction.hash))) {
            return new Validation(false, `Duplicated tx in blockchain: ${transaction.hash}`);
        }

        if (this.mempool.some(tx => tx.hash === transaction.hash)) {
            return new Validation(false, `Duplicated tx in mempool: ${transaction.hash}`)
        }

        this.mempool.push(transaction);
        return new Validation(true, transaction.hash);
    };

    /**
     * Adds a new block to the blockchain
     * @returns Returns true when successfully adding a block to the blockchain
     */
    addBlock(block: Block): Validation {
        const lastBlock = this.getLastBlock();
        const validation = block.isValid(lastBlock.index, lastBlock.hash, this.getDifficulty());
        
        if (!validation.success) {
            return new Validation(false, `Invalid block: ${validation.message}`);
        }

        const txs = block.transactions.filter(tx => tx.type !== TransactionType.FEE).map(tx => tx.hash);
        const newMempool = this.mempool.filter(tx => !txs.includes(tx.hash));

        if (newMempool.length + txs.length !== this.mempool.length) {
            return new Validation(false, "Invalid tx in block: mempool")
        }
        
        this.mempool = newMempool;
        this.blocks.push(block);
        this.nextIndex++;

        return new Validation(true, block.hash);
    };

    /**
     * Gets one block based on hash or index
     * @param indexOrHash
     * @returns Returns the block if found based on its hash or index
     */
    getBlock(indexOrHash: string): Block | undefined {
        return this.blocks.find(block => block.index === parseInt(indexOrHash) || block.hash === indexOrHash);
    };

    getTransaction(hash: string): TransactionSearch {
        const mempoolIndex = this.mempool.findIndex(tx => tx.hash ===hash);
        if (mempoolIndex !== -1) {
            return {
                mempoolIndex,
                transaction: this.mempool[mempoolIndex]
            } as TransactionSearch
        }

        const blockIndex = this.blocks.findIndex(b => b.transactions.some(tx => tx.hash === hash));
        if (blockIndex !== -1) {
            return {
                blockIndex,
                transaction: this.blocks[blockIndex].transactions.find(tx => tx.hash === hash)
            } as TransactionSearch
        }

        return {
            blockIndex: -1,
            mempoolIndex: -1
        } as TransactionSearch
    };

    /**
     * Validates the blockchain
     * @returns Returns true if the blockchain is valid
     */
    isValid(): Validation {
        for(let i = this.blocks.length - 1; i > 0; i--) {
            const currentBlock = this.blocks[i];
            const previousBlock = this.blocks[i - 1];
            const validation = currentBlock.isValid(previousBlock.index, previousBlock.hash, this.getDifficulty());

            if (!validation.success) {
                return new Validation(false, `Invalid block #${currentBlock.index}: ${validation.message}`);
            }
        };

        return new Validation();
    };

    /**
     * Gets the blockchain difficulty
     * @returns Returns the calculated blockchain difficulty
     */
    getDifficulty(): number {
        return Math.ceil(this.blocks.length / Blockchain.DIFFICULTY_FACTOR)
    };

    /**
     * Gets the blockchain miner reward rate
     * @returns Returns the blockchain transaction fee
     */
    getFeePerTx(): number {
        return 1;
    };

    /**
     * Gets the next block to be mined from the blockchain
     * @returns Returns the next block info
     */
    getNextBlock(): BlockInfo | null{
        if (!this.mempool || !this.mempool.length) {
            return null;
        }

        const transactions = this.mempool.slice(0, Blockchain.TX_PER_BLOCK);

        return {
            transactions, 
            difficulty: this.getDifficulty(),
            previousHash: this.getLastBlock().hash,
            index: this.blocks.length,
            feePerTx: this.getFeePerTx(),
            maxDifficulty: Blockchain.MAX_DIFFICULTY
        } as BlockInfo;
    };
};