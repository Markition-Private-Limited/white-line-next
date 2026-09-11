'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import PaymentResultDialog from './PaymentResultDialog'

function Checker() {
  const params = useSearchParams()
  const router = useRouter()
  const [result, setResult] = useState<'confirmed' | 'failed' | null>(null)
  const [bookingId, setBookingId] = useState<string | null>(null)

  useEffect(() => {
    const pstatus = params.get('pstatus')
    if (pstatus === 'confirmed' || pstatus === 'failed') {
      setResult(pstatus)
      setBookingId(params.get('bid'))
      router.replace('/', { scroll: false })
    }
  }, [])

  if (!result) return null
  return (
    <PaymentResultDialog
      type={result}
      bookingId={bookingId}
      onClose={() => setResult(null)}
    />
  )
}

export default function HomePaymentChecker() {
  return (
    <Suspense>
      <Checker />
    </Suspense>
  )
}
