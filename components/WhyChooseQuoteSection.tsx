'use client'
import { motion } from 'framer-motion'

const PLAIN = 'True Security Is Invisible Yet Ever-Present. At White Line, We Believe That Absolute Peace Of Mind Cannot Be Achieved'
const BOLD  = 'Through Ordinary Measures—It Requires A Seamless Integration Of Advanced Vehicle Tracking, Rigorous Vetting.'

const plainWords = PLAIN.split(' ')
const boldWords  = BOLD.split(' ')
const allWords   = [
  ...plainWords.map(w => ({ text: w, bold: false })),
  ...boldWords.map(w =>  ({ text: w, bold: true  })),
]

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: 0.2 },
  },
}

const word = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
}

export default function WhyChooseQuoteSection() {
  return (
    <section
      className="w-full flex items-center justify-center"
      style={{
        background: '#0d3535',
        minHeight: '100vh',
        padding: 'clamp(80px, 10vw, 140px) clamp(24px, 8vw, 120px)',
      }}
    >
      <motion.p
        className="text-center text-white mx-auto"
        style={{
          fontFamily: 'Montserrat, sans-serif',
          fontSize: 'clamp(20px, 3vw, 40px)',
          lineHeight: 1.65,
          fontWeight: 300,
          maxWidth: 960,
          letterSpacing: '-0.01em',
        }}
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-12% 0px' }}
      >
        {allWords.map((w, i) => (
          <motion.span
            key={i}
            variants={word}
            style={{
              display: 'inline-block',
              marginRight: '0.28em',
              fontWeight: w.bold ? 700 : 300,
            }}
          >
            {w.text}
          </motion.span>
        ))}
      </motion.p>
    </section>
  )
}

