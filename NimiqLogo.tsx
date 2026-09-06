import Image from 'next/image'

export default function NimiqLogo({ size = 28 }: { size?: number }) {
  return (
    <Image
      src="/logo/nimiq-logo.jpg"
      alt="Nimiq"
      width={size}
      height={size}
      className="rounded-[6px]"
      priority
    />
  )
}
