const { TransactionProcessor } = require('sawtooth-sdk/processor')

const JomsStoreHandler = require('./handler')
const transactionProcessor = new TransactionProcessor("tcp://localhost:4004")

transactionProcessor.addHandler(new JomsStoreHandler())
transactionProcessor.start()

console.log(`Starting bank transaction processor`)
console.log(`Connecting to Sawtooth validator at tcp://localhost:4004`)