import { Fragment, useEffect, useState } from 'react'
import { crowdfund } from '../../../shared/contracts'
import { Utils } from '../../../shared/utils'
import { Spacer } from '../../atoms/spacer'
import styles from './style.module.css'

export interface IDepositsProps {
  address: string
  decimals: number
  name?: string
  symbol?: string
}

export function Deposits(props: IDepositsProps) {
  const [balance, setBalance] = useState<bigint>(BigInt(0))

  useEffect(() => {
    ;(async () => {
      await crowdfund.balance({ user: props.address }).then((tx) => setBalance(tx.result))
    })()
  }, [props.address])

  if (Number(balance) <= 0) {
    return <Fragment />
  }

  return (
    <>
      <Spacer rem={2} />
      <h6>You’ve Pledged</h6>
      <div className={styles.pledgeContainer}>
        <span className={styles.values}>
          {Utils.formatAmount(balance, props.decimals)}{' '}
          <span title={props.name}>{props.symbol}</span>
        </span>
        {/*<a>
          <h6>
            09/22/22 <Image src={OpenSvg} width={12} height={12} alt={'Open'} />
          </h6>
        </a>*/}
      </div>
    </>
  )
}
