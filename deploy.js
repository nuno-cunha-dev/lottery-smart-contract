import HDWalletProvider from '@truffle/hdwallet-provider'
import Web3 from 'web3'
import metadata from './compile.js'
import config from './config.js'

const provider = new HDWalletProvider(config.mnemonic, config.providerApi)
const web3 = new Web3(provider)

console.log(JSON.stringify(metadata.abi))
let deploy = async () => {
  const account = (await web3.eth.getAccounts())[0]

  console.log('Deploy from account: ', account)
  const contract = await new web3.eth.Contract(metadata.abi)
    .deploy({
      data: metadata.evm.bytecode.object,
    })
    .send({
      gas: 1000000,
      from: account,
    })
  
  console.log('Contract address: ', contract.options.address)

  provider.engine.stop()
}

deploy()
