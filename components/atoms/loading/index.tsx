import Image from 'next/image'
import React from 'react'
import { LoadingSvg } from '../../../assets/icons'

export interface SpacerProps {
  size: number
}

export function Loading({ size }: SpacerProps) {
  return <Image src={LoadingSvg} width={size} height={size} alt="loading..." />
}
