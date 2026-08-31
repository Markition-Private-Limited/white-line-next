'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

function FaqItem({
  faq,
  isOpen,
  onToggle,
  index,
}: {
  faq: { q: string; a: string }
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
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: isOpen ? 700 : 600,
            fontSize: 'clamp(14px, 1.3vw, 16px)',
            color: isOpen ? '#005C66' : '#111118',
            transition: 'color 0.3s, font-weight 0.3s',
            lineHeight: 1.4,
          }}
        >
          {faq.q}
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
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function WhyChooseFaqSection() {
  const { trans } = useLanguage()
  const { faq } = trans.whyChooseUsPage
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (i: number) => setOpenIndex(prev => (prev === i ? null : i))

  return (
    <section className="w-full bg-white" style={{ padding: 'clamp(64px, 7vw, 100px) 0' }}>
      <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-16">

        <motion.div
          className="flex items-center justify-center gap-3 mb-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <span className="block h-px w-8" style={{ background: '#005C66' }} />
          <span
            className="text-xs tracking-[0.22em] uppercase font-medium"
            style={{ fontFamily: 'Inter, sans-serif', color: '#005C66' }}
          >
            {faq.label}
          </span>
          <span className="block h-px w-8" style={{ background: '#005C66' }} />
        </motion.div>

        <motion.h2
          className="text-center text-[#111118] leading-tight mb-14"
          style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(28px, 4vw, 48px)' }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span style={{ fontWeight: 400 }}>{faq.h1}</span>
          <span style={{ fontWeight: 800, fontStyle: 'italic' }}>{faq.h2}</span>
          <br />
          <span style={{ fontWeight: 400 }}>{faq.h3}</span>
        </motion.h2>

        <div className="flex flex-col gap-3">
          {faq.items.map((item, i) => (
            <FaqItem
              key={i}
              faq={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
