var { _hash } = require("./lib");
var { TP_NAMESPACE } = require("./constants");

const getOwnerAddress = user => TP_NAMESPACE + _hash(user)
const getFruitAddress = fruit => TP_NAMESPACE + _hash(fruit)
const getTransferAddress = fruit => TP_NAMESPACE + _hash(fruit)

const encode = obj => Buffer.from(JSON.stringify(obj, Object.keys(obj).sort()))
const decode = buf => JSON.parse(buf.toString())

class JomsStoreState {

    constructor(context) {
      this.context = context;
      this.timeout = 500;
      this.stateEntries = {};
    }
   
    createOwner(value) {
      const address = getOwnerAddress(value);
      var stateEntriesSend = {}
      stateEntriesSend[address] = Buffer.from("Request for Fruits! " + value);
      return  this.context.setState(stateEntriesSend, this.timeout).then(function(result) {
        console.log("Success", result)
      }).catch(function(error) {
        console.error("Error", error)
      })
    }
   
    getOwner(value) {
      const address = getOwnerAddress(value);
      return  this.context.getState([address], this.timeout).then(function(stateEntries) {
        Object.assign(this.stateEntries, stateEntries);
        console.log(this.stateEntries[address].toString())
        return  this.stateEntries;
      }.bind(this))
    }

    createFruit(fruit, owner) {
      const address = getFruitAddress(fruit);

      return this.context.getState([address], this.timeout)
        .then(entries => {
          const entry = entries[address]
          // if (entry && entry.length > 0) {
          //   return new InvalidTransaction('Fruit name in use')
          // }
          if (!entry || entry.length === 0) {
            return this.context.setState({
              [address]: encode({name: fruit, owner})
            })
          }
        })
    }

    transferFruit(fruit, owner, oldOwner) {
      const address = getTransferAddress(fruit)
      const fruitAddress = getFruitAddress(fruit)

      return this.context.getState([fruitAddress], this.timeout)
        .then(entries => {
          const entry = entries[fruitAddress]
          // if (!entry || entry.length === 0) {
          //   throw new InvalidTransaction('Fruit does not exist')
          // }

          // if (oldOwner !== decode(oldOwner).owner) {
          //   throw new InvalidTransaction('Only an Fruit\'s owner may transfer it')
          // }
          if (entry) {
            return this.context.setState({
              [address]: encode({fruit, owner})
            })
          }
        })
    }

    acceptTransfer(fruit, owner) {
      const address = getTransferAddress(fruit)

      return this.context.getState([address], this.timeout)
        .then(entries => {
          const entry = entries[address]
          // if (!entry || entry.length === 0) {
          //   throw new InvalidTransaction('Fruit is not being transfered')
          // }

          // if (owner !== decode(entry).owner) {
          //   throw new InvalidTransaction(
          //     'Transfers can only be accepted by the new owner'
          //   )
          // }
          if (entry) {
            return this.context.setState({
              [address]: Buffer(0),
              [getFruitAddress(fruit)]: encode({name: fruit, owner})
            })
          }
        })
    }

  rejectTransfer(asset, owner) {
    const address = getTransferAddress(asset)

    return this.context.getState([address], this.timeout)
      .then(entries => {
        const entry = entries[address]
        // if (!entry || entry.length === 0) {
        //   throw new InvalidTransaction('Fruit is not being transfered')
        // }

        // if (owner !== decode(entry).owner) {
        //   throw new InvalidTransaction(
        //     'Transfers can only be rejected by the potential new owner')
        // }
        if (entry) {
          return this.context.setState({
            [address]: Buffer(0)
          })
        }
      })
  }


}

module.exports = JomsStoreState;