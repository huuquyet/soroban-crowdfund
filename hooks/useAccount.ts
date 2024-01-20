import {
  FREIGHTER_ID,
  ISupportedWallet,
  StellarWalletsKit,
  WalletNetwork,
  allowAllModules,
} from '@creit.tech/stellar-wallets-kit'
import { useEffect, useState } from 'react'
import { useAppContext } from '../context/appContext'

// returning the same object identity every time avoids unnecessary re-renders
const addressObject = {
  address: '',
  displayName: '',
}

const addressToHistoricObject = (address: string) => {
  addressObject.address = address
  addressObject.displayName = `${address.slice(0, 4)}...${address.slice(-4)}`
  return addressObject
}

const ERRORS = {
  WALLET_CONNECTION_REJECTED: 'Wallet connection rejected',
}

const STORAGE_WALLET_KEY = 'wallet'

const allowedWallets = [
  // ALBEDO_ID,
  FREIGHTER_ID,
  // RABET_ID,
  // XBULL_ID,
]

type Props = {
  account: typeof addressObject | null
  onConnect: () => void
  onDisconnect: () => void
  isLoading: boolean
}
export function useAccount(): Props {
  const { walletAddress, setWalletAddress } = useAppContext()

  const [isLoading, setIsLoading] = useState(false)

  // Setup swc, user will set the desired wallet on connect
  const [SWKKit] = useState(
    new StellarWalletsKit({
      network: WalletNetwork.FUTURENET,
      selectedWalletId: FREIGHTER_ID,
      modules: allowAllModules(),
    })
  )

  const getWalletAddress = async (type: string) => {
    try {
      setIsLoading(true)
      // Set selected wallet, network, and public key
      SWKKit.setWallet(type)
      const publicKey = await SWKKit.getPublicKey()
      await SWKKit.setNetwork(WalletNetwork.FUTURENET)

      // Short timeout to prevent blick on loading address
      setTimeout(() => {
        setWalletAddress(publicKey)
        localStorage.setItem(STORAGE_WALLET_KEY, type)
        setIsLoading(false)
      }, 500)
    } catch (error) {
      localStorage.removeItem(STORAGE_WALLET_KEY)
      setIsLoading(false)
      console.error(ERRORS.WALLET_CONNECTION_REJECTED)
    }
  }

  // if the walletType is stored in local storage the first opening the page
  // will trigger autoconnect for users
  useEffect(() => {
    const storedWallet = localStorage.getItem(STORAGE_WALLET_KEY)
    if (!walletAddress && storedWallet) {
      ;(async () => {
        await getWalletAddress(storedWallet)
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, getWalletAddress])

  const onConnect = async () => {
    if (!walletAddress) {
      // See https://github.com/Creit-Tech/Stellar-Wallets-Kit/tree/main for more options
      await SWKKit.openModal({
        onWalletSelected: async (option: ISupportedWallet) => {
          await getWalletAddress(option.id)
        },
      })
    }
  }

  const onDisconnect = () => {
    setWalletAddress('')
    localStorage.removeItem(STORAGE_WALLET_KEY)
    setIsLoading(false)
  }

  return {
    account: walletAddress ? addressToHistoricObject(walletAddress) : null,
    onConnect,
    onDisconnect,
    isLoading,
  }
}
