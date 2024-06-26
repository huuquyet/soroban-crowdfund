import type { Dispatch, SetStateAction } from 'react'
import styles from './style.module.css'

export interface CheckboxProps {
  title: string
  value: number
  isChecked: boolean
  setAmount: Dispatch<SetStateAction<number | undefined>>
  clearInput: () => void
}

export function Checkbox({ title, value, isChecked, setAmount, clearInput }: CheckboxProps) {
  const handleCheckBox = (event: {
    target: { checked: boolean; value: string }
  }) => {
    clearInput()
    setAmount(Number.parseInt(event.target.value))
  }

  return (
    <label className={styles.label}>
      <input type="checkbox" value={value} checked={isChecked} onChange={handleCheckBox} />
      <span>{title}</span>
    </label>
  )
}
