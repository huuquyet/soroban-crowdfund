import { type FunctionComponent, useEffect, useState } from 'react'
import { abundance, crowdfund } from '../../../shared/contracts'
import { Utils } from '../../../shared/utils'
import { AmountInput, Button, Checkbox } from '../../atoms'
import { Spacer } from '../../atoms/spacer'
import { TransactionModal } from '../../molecules/transaction-modal'
import styles from './style.module.css'

export interface IFormPledgeProps {
  account: string
  decimals: number
  symbol?: string
  onPledge: () => void
  updatedAt: number
}

export interface IResultSubmit {
  status: string
  value?: string
  symbol?: string
  error?: string
}

/**
 * Mint 100.0000000 tokens to the user's wallet for testing
 */
function MintButton({
  account,
  symbol,
  onComplete,
  decimals,
}: {
  decimals: number
  account: string
  symbol: string
  onComplete: () => void
}) {
  const [isSubmitting, setSubmitting] = useState(false)

  const displayAmount = 100
  const amount = BigInt(displayAmount * 10 ** decimals)

  return (
    <Button
      title={`Mint ${displayAmount} ${symbol}`}
      onClick={async () => {
        setSubmitting(true)
        const tx = await abundance.mint({ to: account, amount })
        await tx.signAndSend()
        setSubmitting(false)
        onComplete()
      }}
      disabled={isSubmitting}
      isLoading={isSubmitting}
    />
  )
}

const FormPledge: FunctionComponent<IFormPledgeProps> = (props) => {
  const [balance, setBalance] = useState<bigint>(BigInt(0))
  const [decimals, setDecimals] = useState<number>(0)
  const [symbol, setSymbol] = useState<string>()

  const [amount, setAmount] = useState<number>()
  const [resultSubmit, setResultSubmit] = useState<IResultSubmit | undefined>()
  const [input, setInput] = useState('')
  const [isSubmitting, setSubmitting] = useState(false)

  useEffect(() => {
    ;(async () => {
      await abundance.balance({ id: props.account }).then((tx) => setBalance(tx.result))
      await abundance.decimals().then((tx) => setDecimals(tx.result))
      await abundance.symbol().then((tx) => setSymbol(tx.result.toString()))
    })()
  }, [props.account, props.updatedAt])

  const clearInput = (): void => {
    setInput('')
  }

  const handleSubmit = async (): Promise<void> => {
    if (!amount) return

    setSubmitting(true)

    try {
      const tx = await crowdfund.deposit({
        user: props.account,
        amount: BigInt(amount * 10 ** decimals),
      })
      await tx.signAndSend()

      setResultSubmit({
        status: 'success',
        value: String(amount),
        symbol,
      })
      props.onPledge()
      setInput('')
      setAmount(undefined)
    } catch (e) {
      if (e instanceof Error) {
        setResultSubmit({
          status: 'error',
          error: e?.message || 'An error has occurred',
        })
      } else {
        throw e
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h6>Choose Amount</h6>
      <div className={styles.wrapper}>
        <Checkbox
          title={`100 ${props.symbol}`}
          value={100}
          isChecked={amount === 100}
          setAmount={setAmount}
          clearInput={clearInput}
        />
        <Checkbox
          title={`250 ${props.symbol}`}
          value={250}
          isChecked={amount === 250}
          setAmount={setAmount}
          clearInput={clearInput}
        />
        <Checkbox
          title={`500 ${props.symbol}`}
          value={500}
          isChecked={amount === 500}
          setAmount={setAmount}
          clearInput={clearInput}
        />
        <Checkbox
          title={`1000 ${props.symbol}`}
          value={1000}
          isChecked={amount === 1000}
          setAmount={setAmount}
          clearInput={clearInput}
        />
      </div>
      <div className={styles.centerContent}>
        <h6>OR</h6>
      </div>
      <AmountInput
        placeHolder="Custom amount"
        setAmount={setAmount}
        input={input}
        setInput={setInput}
      />
      <Button
        title={'Back this project'}
        onClick={handleSubmit}
        disabled={!amount || isSubmitting}
        isLoading={isSubmitting}
      />
      {props.account && props.decimals && props.symbol ? (
        <div>
          <Spacer rem={1} />
          <MintButton
            account={props.account}
            symbol={props.symbol}
            decimals={decimals}
            onComplete={() => props.onPledge()}
          />
          <div className={styles.wrapper}>
            <div>
              <h6>
                Your balance: {Utils.formatAmount(balance, decimals)} {symbol}
              </h6>
            </div>
          </div>
        </div>
      ) : null}
      {resultSubmit && (
        <TransactionModal result={resultSubmit} closeModal={() => setResultSubmit(undefined)} />
      )}
    </div>
  )
}

export { FormPledge }
