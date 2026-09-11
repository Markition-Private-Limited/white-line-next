'use client'
import { useEffect } from 'react'

export default function BookingFailedContent() {
  useEffect(() => {
    window.location.replace('/?pstatus=failed')
  }, [])

  return null
}
