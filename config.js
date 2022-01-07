import dotenv from 'dotenv'
dotenv.config();

export default {
    mnemonic: process.env.MNEMONIC,
    providerApi: process.env.INFURA_API,
}