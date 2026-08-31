'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import type { ServiceDetailPageKey } from '../lib/serviceDetail'

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  return (
    <motion.div
      className="overflow-hidden rounded-2xl border"
      style={{
        borderColor: isOpen ? 'rgba(0,92,102,0.25)' : 'rgba(0,0,0,0.08)',
        background: isOpen ? 'rgba(0,92,102,0.04)' : '#f9f9f9',
        transition: 'border-color 0.3s, background 0.3s',
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start"
        aria-expanded={isOpen}
      >
        <span
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: isOpen ? 700 : 600,
            fontSize: 'clamp(14px, 1.3vw, 16px)',
            color: isOpen ? '#005C66' : '#111118',
            transition: 'color 0.3s',
            lineHeight: 1.4,
          }}
        >
          {question}
        </span>

        <motion.div
          className="flex-shrink-0 flex items-center justify-center rounded-full"
          style={{
            width: 32,
            height: 32,
            background: isOpen ? '#005C66' : 'rgba(0,0,0,0.08)',
            transition: 'background 0.3s',
          }}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {isOpen ? (
            <Minus size={14} color="#fff" strokeWidth={2.5} />
          ) : (
            <Plus size={14} color="#555" strokeWidth={2.5} />
          )}
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: 'hidden' }}
          >
            <p
              className="px-6 pb-6"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(13px, 1.15vw, 15px)',
                color: '#6b7280',
                lineHeight: 1.75,
              }}
            >
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function AirportTransferFaqSection({ servicePage = 'airportTransferPage' }: { servicePage?: ServiceDetailPageKey }) {
  const { trans } = useLanguage()
  const { faq } = trans[servicePage]
  const { ref, inView } = useInView()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const fadeUp = (delay = 0): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.85s ease ${delay}s, transform 0.85s ease ${delay}s`,
  })

  const toggle = (i: number) => setOpenIndex(prev => prev === i ? null : i)

  return (
    <section style={{ background: '#ffffff', padding: 'clamp(6px, 0.8vw, 10px)', paddingTop: 0 }}>
      <div
        ref={ref}
        className="bg-white"
        style={{
          borderRadius: 'clamp(14px, 1.5vw, 20px)',
          padding: 'clamp(48px, 7vw, 100px) clamp(24px, 5vw, 80px)',
        }}
      >
        <div className="grid gap-12 lg:grid-cols-[2fr_3fr] lg:gap-20 lg:items-start">

          {/* Left: label + heading + sub */}
          <div style={fadeUp(0)}>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#005C66]" />
              <p
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ fontFamily: 'Inter, sans-serif', color: '#005C66' }}
              >
                {faq.label}
              </p>
            </div>

            <h2
              className="mb-5 leading-tight text-[#0d0d14]"
              style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(26px, 3vw, 44px)' }}
            >
              <span style={{ fontWeight: 300 }}>{faq.h1}</span>
              <br />
              <span style={{ fontWeight: 800, fontStyle: 'italic' }}>{faq.h2}</span>
            </h2>

            <p
              className="text-sm leading-relaxed text-[#0d0d14]/55"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {faq.sub}
            </p>
          </div>

          {/* Right: accordion */}
          <div className="flex flex-col gap-3">
            {faq.items.map((item, i) => (
              <AccordionItem
                key={i}
                question={item.q}
                answer={item.a}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
                index={i}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
