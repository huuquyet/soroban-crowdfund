import Image, { type StaticImageData } from 'next/image'
import styles from './style.module.css'

export interface AuthorInfoProps {
  image: StaticImageData
  author: string
  dateTime: string
}

export function AuthorInfo({ image, author, dateTime }: AuthorInfoProps) {
  return (
    <div className={styles.content}>
      <Image src={image} width={36} height={36} alt="avatar" />
      <div className={styles.author}>
        <span>{dateTime}</span>
        <br />
        <span>
          by <b>{author}</b>
        </span>
      </div>
    </div>
  )
}
