import axios from "axios";
import { BlockInfo } from "../lib/types/blockInfo";
import Block from "../lib/block";

const BLOCKCHAIN_SERVER = `${process.env.BLOCKCHAIN_SERVER}:${process.env.BLOCKCHAIN_PORT}`;
const minerWallet = {
    privateKey: "123456",
    publicKey: `${process.env.MINER_WALLET}`
};

let totalMined = 0;

console.log(`Logged as ${minerWallet.publicKey}`);

async function mine() {
    console.log("Getting next block info...");
    const { data } = await axios.get(`${BLOCKCHAIN_SERVER}/blockchain/blocks/next`);

    if (!data) {
        console.log("No tx found. Waiting...");
        return setTimeout(() => {
            mine();
        }, 5000);
    }

    const blockInfo = data as BlockInfo;
    const newBlock = Block.fromBlockInfo(blockInfo);

    console.log(`Start mining block #${newBlock.index}`);
    newBlock.mine(blockInfo.difficulty, minerWallet.publicKey);
    console.log(`Block mined!`);

    try {
        console.log(`Sending the block #${newBlock.index} to blockchain...`);
        await axios.post(`${BLOCKCHAIN_SERVER}/blockchain/blocks`, newBlock);
        console.log("Block sent and accepted!");

        totalMined++;
        console.log(`Total mined blocks: ${totalMined}`);
    } catch (error: any) {
        console.error(error.response ? error.response.data : error.message);
    }

    setTimeout(() => {
        mine();
    }, 1000);
};

mine();