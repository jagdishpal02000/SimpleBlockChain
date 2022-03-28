const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, previosHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previosHash = previosHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce +
        this.previosHash
    ).toString();
  }

  minBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join(0)
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined  " + this.hash);
  }
}

class BlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
  }
  createGenesisBlock() {
    return new Block(0, "29/03/2022", "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previosHash = this.getLatestBlock().hash;
    newBlock.minBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previosBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previosHash !== previosBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

let JagdishCoin = new BlockChain();

console.log("Mining The First Block");
JagdishCoin.addBlock(new Block(1, "10/04/2022", { amount: 5 }));

console.log("Mining The Second Block");
JagdishCoin.addBlock(new Block(2, "11/04/2022", { amount: 10 }));

console.log(JagdishCoin.chain);

// let's try to temper our a node

JagdishCoin.chain[1].data = { amount: 5000 };
JagdishCoin.chain[1].hash = JagdishCoin.chain[1].calculateHash();

// let's check the validation of the  blockchain

console.log("Is blockchain is valid : " + JagdishCoin.isValid());
