import { useEffect, useState } from 'react'
import {
  FREIGHTER_ID,
  FreighterModule,
  ISupportedWallet,
  StellarWalletsKit,
  WalletNetwork,
} from '@creit.tech/stellar-wallets-kit'
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

// Soroban is only supported on Futurenet right now
const FUTURENET_DETAILS = {
  network: 'FUTURENET',
  networkUrl: 'https://horizon-futurenet.stellar.org',
  networkPassphrase: 'Test SDF Future Network ; October 2022',
}

const STORAGE_WALLET_KEY = 'wallet'

type Props = {
  account: typeof addressObject | null
  onConnect: () => void
  onDisconnect: () => void
  isLoading: boolean
}
export function useAccount(): Props {
  const { walletAddress, setWalletAddress } = useAppContext()

  const [isLoading, setIsLoading] = useState(false)

  // Update is not only Futurenet is available
  const [selectedNetwork] = useState(FUTURENET_DETAILS)
  // Setup swc, user will set the desired wallet on connect
  const kit = new StellarWalletsKit({
      network: WalletNetwork.FUTURENET,
      selectedWalletId: FREIGHTER_ID,
      modules: [new FreighterModule()],
    })

  const getWalletAddress = async (id: any) => {
    try {
      setIsLoading(true)
      // Set selected wallet, network, and public key
      kit.setWallet(id)
      const publicKey = await kit.getPublicKey()
      kit.setNetwork(WalletNetwork.FUTURENET)

      // Short timeout to prevent blick on loading address
      setTimeout(() => {
        setWalletAddress(publicKey)
        localStorage.setItem(STORAGE_WALLET_KEY, id)
        setIsLoading(false)
      }, 500)
    } catch (error) {
      localStorage.removeItem(STORAGE_WALLET_KEY)
      setIsLoading(false)
      console.error(`Wallet connection rejected: ${error}`)
    }
  }

  // if the walletType is stored in local storage the first opening the page
  // will trigger autoconnect for users
  useEffect(() => {
    const storedWallet = localStorage.getItem(STORAGE_WALLET_KEY)
    if (
      !walletAddress &&
      storedWallet) {
      ;(async () => {
        await getWalletAddress(storedWallet)
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, getWalletAddress])

  const onConnect = async () => {
    if (!walletAddress) {
      // See https://github.com/Creit-Tech/Stellar-Wallets-Kit/tree/main for more options
      await kit.openModal({
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
