import { FC, ReactNode, createContext, useContext, useState } from 'react'

const AppContext = createContext({
  walletAddress: '',
  network: '',
  setNetwork: (value: any) => value,
  setWalletAddress: (value: any) => value,
})

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('')
  const [network, setNetwork] = useState('')

  return (
    <AppContext.Provider value={{ walletAddress, network, setNetwork, setWalletAddress }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = (): {
  walletAddress: string
  network: string
  setWalletAddress: (value: string) => string
  setNetwork: (value: string) => string
} => useContext(AppContext)
