'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const FAQS = [
  {
    q: 'How can I book a White Lane ride?',
    a: 'Booking is simple — use our mobile app, website, or call our 24/7 concierge line. You can schedule rides in advance or request one on demand. Instant confirmation is sent the moment your booking is secured.',
  },
  {
    q: 'Can I contact support about an existing booking?',
    a: "Absolutely. Our support team is reachable around the clock via in-app chat, email, or phone. You can modify, cancel, or get updates on any booking within seconds. Your driver's contact details are also shared once a chauffeur is assigned.",
  },
  {
    q: 'Do you offer corporate transportation?',
    a: 'Yes. We provide dedicated corporate accounts with monthly invoicing, priority fleet access, multi-passenger coordination, and a dedicated account manager. Our corporate packages are tailored to fit the pace of your business.',
  },
  {
    q: 'Can I request a specific vehicle?',
    a: 'You can choose from our curated fleet — from executive sedans to full-size SUVs — at the time of booking. If you have a recurring preference, we save it to your profile so every ride is set up the way you like it.',
  },
  {
    q: 'Is customer support available 24/7?',
    a: 'Yes. White Lane operates around the clock with live agents ready to assist. Whether you need last-minute changes, have questions mid-journey, or want to plan a future trip, someone is always available to help.',
  },
  {
    q: 'Are White Lane chauffeurs professionally trained?',
    a: 'Every chauffeur undergoes rigorous background screening, defensive driving certification, and customer-service training before joining our fleet. We regularly audit performance through passenger feedback and internal quality reviews.',
  },
]

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
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
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
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (i: number) => setOpenIndex(prev => (prev === i ? null : i))

  return (
    <section className="w-full bg-white" style={{ padding: 'clamp(64px, 7vw, 100px) 0' }}>
      <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-16">

        {/* Label */}
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
            Frequently Asked Questions
          </span>
          <span className="block h-px w-8" style={{ background: '#005C66' }} />
        </motion.div>

        {/* Heading */}
        <motion.h2
          className="text-center text-[#111118] leading-tight mb-14"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            fontSize: 'clamp(28px, 4vw, 48px)',
          }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.8, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span style={{ fontWeight: 400 }}>Before You </span>
          <span style={{ fontWeight: 800, fontStyle: 'italic' }}>Reach Out.</span>
          <br />
          <span style={{ fontWeight: 400 }}>Everything You Need To Know</span>
        </motion.h2>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <FaqItem
              key={i}
              faq={faq}
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

