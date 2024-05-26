import type { SorobanContextType } from '@soroban-react/core'
import styles from './style.module.css'

export interface ConnectButtonProps {
  sorobanContext: SorobanContextType
  label: string
  isHigher?: boolean
}

export function ConnectButton({ sorobanContext, label, isHigher }: ConnectButtonProps) {
  const { connect } = sorobanContext
  const openConnectModal = async (): Promise<void> => {
    await connect()
  }

  return (
    <button
      className={styles.button}
      style={{ height: isHigher ? 50 : 38 }}
      onClick={openConnectModal}
      type="button"
    >
      {label}
    </button>
  )
}
