import { useSorobanReact } from '@soroban-react/core'
import { ConnectButton } from '../../atoms'
import styles from './style.module.css'

// TODO: Eliminate flash of unconnected content on loading
export const WalletData = () => {
  const sorobanContext = useSorobanReact()
  const { activeChain } = sorobanContext

  return (
    <>
      {activeChain ? (
        <div className={styles.displayData}>
          <div className={styles.card}>{activeChain.name}</div>
        </div>
      ) : (
        <ConnectButton label="Connect Wallet" sorobanContext={sorobanContext} />
      )}
    </>
  )
}
