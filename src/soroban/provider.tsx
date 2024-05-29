import { SorobanReactProvider, fromURLToServer } from '@soroban-react/core'
import type React from 'react'
import { allowedChains } from './allowedChains'
import { allowedConnectors } from './connectors'

const MySorobanReactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SorobanReactProvider
      chains={allowedChains}
      connectors={allowedConnectors}
      server={fromURLToServer(
        'https://testnet.stellar.validationcloud.io/v1/Mewk7YPYiUy3wAlDNlQsIhwxbdumICRYrz2tXS2vOck'
      )}
    >
      {children}
    </SorobanReactProvider>
  )
}
export default MySorobanReactProvider
