import { resolve, dirname } from 'path'
import { readFileSync } from 'fs'
import solc from 'solc'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const lotteryPath = resolve(__dirname, 'contracts', 'Lottery.sol')
const source = readFileSync(lotteryPath, 'utf8')

const input = {
  language: 'Solidity',
  sources: {
    'Lottery.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
}

export default JSON.parse(solc.compile(JSON.stringify(input)))
  .contracts['Lottery.sol']
  .Lottery
