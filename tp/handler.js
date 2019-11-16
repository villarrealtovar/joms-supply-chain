const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction, InternalError } = require('sawtooth-sdk/processor/exceptions')
const cbor = require('cbor')
const JomsStoreState = require('./state');
var { TP_FAMILY, TP_NAMESPACE } = require("./constants");

class JomsStoreHandler extends TransactionHandler {
    constructor() {
      super(TP_FAMILY, ['1.0'], [TP_NAMESPACE])
    }

    apply(transactionProcessRequest, context) {
      // const header = TransactionHeader.decode(transactionProcessRequest.header)
      // const signer = header.signerPubkey
      const jomsStoreState = new JomsStoreState(context);
      const payload = cbor.decode(transactionProcessRequest.payload);

      switch(payload.action) {
        case 'getOwner':
          return jomsStoreState.getOwner(payload.owner)
        case 'createOwner':
          return jomsStoreState.createOwner(payload.owner)
        case 'createFruit':
          return jomsStoreState.createFruit(payload.fruit, payload.owner)
        case 'transferFruit':
            return jomsStoreState.transferFruit(payload.fruit, payload.owner, payload.oldOwner)
        case 'acceptTransfer':
            return jomsStoreState.acceptTransfer(payload.fruit, payload.owner)
        case 'rejectTransfer':
            return jomsStoreState.rejectTransfer(payload.fruit, payload.owner)
        default:
          throw  new InvalidTransaction(
            `Action must be create, delete, or take not ${payload.action}`
          )
      }
    }
}

module.exports = JomsStoreHandler;