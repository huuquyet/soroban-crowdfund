export interface SpacerProps {
  rem: number
}

export function Spacer({ rem }: SpacerProps) {
  return <div style={{ height: `${rem}rem` }} />
}
