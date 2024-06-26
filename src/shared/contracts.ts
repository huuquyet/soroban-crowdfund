import { SorobanRpc } from '@stellar/stellar-sdk'
import * as Abundance from 'abundance-token'
import * as Crowdfund from 'crowdfund-contract'
import config from './config.json'

const { network, rpcUrl } = config

export const abundance = new Abundance.Client({
  rpcUrl,
  ...Abundance.networks[network as keyof typeof Abundance.networks],
})

export const crowdfund = new Crowdfund.Client({
  rpcUrl,
  ...Crowdfund.networks[network as keyof typeof Crowdfund.networks],
})

export const server = new SorobanRpc.Server(rpcUrl, {
  allowHttp: rpcUrl.startsWith('http:'),
})
