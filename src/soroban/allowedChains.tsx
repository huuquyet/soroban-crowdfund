import { futurenet, sandbox, testnet } from '@soroban-react/chains'
import type { WalletChain } from '@soroban-react/types'

export const allowedChains: WalletChain[] = [testnet, futurenet, sandbox]
