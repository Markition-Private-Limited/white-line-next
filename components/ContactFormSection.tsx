'use client'
import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import callIcon from '../assets/contact_us/call.svg'
import emailIcon from '../assets/contact_us/email.svg'
import clockIcon from '../assets/contact_us/clock.svg'

interface FormData {
  firstName: string; lastName: string; email: string; phone: string
  helpTopic: string; preferredDate: string; passengers: string; message: string
}
type FormErrors = Partial<Record<keyof FormData, string>>

type ErrMsgs = {
  errFirstName: string; errLastName: string; errEmail: string
  errEmailInvalid: string; errHelpTopic: string; errMessage: string
}

function useInView(threshold = 0.08) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function validate(data: FormData, err: ErrMsgs): FormErrors {
  const errors: FormErrors = {}
  if (!data.firstName.trim())  errors.firstName = err.errFirstName
  if (!data.lastName.trim())   errors.lastName  = err.errLastName
  if (!data.email.trim())      errors.email     = err.errEmail
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = err.errEmailInvalid
  if (!data.helpTopic)         errors.helpTopic = err.errHelpTopic
  if (!data.message.trim())    errors.message   = err.errMessage
  return errors
}

function InfoCard({ icon, title, value, sub }: { icon: string; title: string; value: string; sub: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: '#f5f5f7', borderRadius: 14, padding: '20px 22px', border: '1px solid #ebebeb' }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,92,102,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <img src={icon} alt="" style={{ width: 20, height: 20 }} />
      </div>
      <div>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 14, color: '#111118', margin: '0 0 2px' }}>{title}</p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#111118', margin: '0 0 3px' }}>{value}</p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#9ca3af', margin: 0 }}>{sub}</p>
      </div>
    </div>
  )
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, color: '#374151' }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {error && (
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11.5, color: '#ef4444', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  )
}

const inputBase: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#111118',
  background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 10,
  padding: '11px 14px', width: '100%', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
}
const inputError: React.CSSProperties = { borderColor: '#fca5a5', background: '#fff5f5' }

const SELECT_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`

export default function ContactFormSection() {
  const { trans, dir } = useLanguage()
  const isRtl = dir === 'rtl'
  const { info, form: f } = trans.contactPage
  const { ref, inView } = useInView()

  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', email: '', phone: '',
    helpTopic: '', preferredDate: '', passengers: '1', message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)

  const errMsgs: ErrMsgs = {
    errFirstName: f.errFirstName, errLastName: f.errLastName,
    errEmail: f.errEmail, errEmailInvalid: f.errEmailInvalid,
    errHelpTopic: f.errHelpTopic, errMessage: f.errMessage,
  }

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const val = e.target.value
    setForm(prev => ({ ...prev, [key]: val }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  const blur = (key: keyof FormData) => () => {
    setTouched(t => ({ ...t, [key]: true }))
    const errs = validate({ ...form }, errMsgs)
    setErrors(prev => ({ ...prev, [key]: errs[key] }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(form, errMsgs)
    setErrors(errs)
    setTouched({ firstName: true, lastName: true, email: true, helpTopic: true, message: true })
    if (Object.keys(errs).length === 0) setSubmitted(true)
  }

  const fadeUp = (delay = 0): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(32px)',
    transition: `opacity 0.85s ease ${delay}s, transform 0.85s ease ${delay}s`,
  })

  const ICONS = [
    (callIcon as any).src ?? callIcon,
    (emailIcon as any).src ?? emailIcon,
    (clockIcon as any).src ?? clockIcon,
  ]

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="w-full bg-white" style={{ paddingTop: '96px', paddingBottom: '96px' }}>
      <div className="mx-auto px-4 sm:px-6 lg:px-10 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start" style={{ maxWidth: '1200px' }}>

        {/* Left: info */}
        <div className="w-full lg:w-[38%] flex-shrink-0" style={fadeUp(0)}>
          <h2 className="text-[#111118] leading-tight mb-5" style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(26px, 3.5vw, 42px)' }}>
            <span style={{ fontWeight: 300 }}>{info.h1}</span>
            <br />
            <span style={{ fontWeight: 800, fontStyle: 'italic' }}>{info.h2}</span>
          </h2>
          <p className="mb-8 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(13px, 1.3vw, 15px)', color: '#828282' }}>
            {info.body}
          </p>
          <div className="flex flex-col gap-3">
            {info.cards.map((card, i) => (
              <div key={i} style={fadeUp(0.1 + i * 0.1)}>
                <InfoCard icon={ICONS[i]} title={card.title} value={card.value} sub={card.sub} />
              </div>
            ))}
          </div>
        </div>

        {/* Right: form card */}
        <div className="w-full flex-1" style={{ ...fadeUp(0.15), background: '#f5f5f7', borderRadius: 20, padding: 'clamp(24px, 3vw, 40px)', border: '1px solid #ebebeb' }}>
          {submitted ? (
            <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: 400, gap: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,92,102,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Send size={26} color="#005C66" />
              </div>
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 22, color: '#111118', margin: 0 }}>{f.sentTitle}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#828282', maxWidth: 320, margin: 0 }}>{f.sentBody}</p>
            </div>
          ) : (
            <>
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 'clamp(18px, 2vw, 24px)', color: '#111118', margin: '0 0 6px' }}>{f.title}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13.5, color: '#9ca3af', margin: '0 0 28px' }}>{f.sub}</p>

              <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Field label={f.firstName} required error={touched.firstName ? errors.firstName : undefined}>
                    <input type="text" placeholder={f.firstNamePh} value={form.firstName} onChange={set('firstName')} onBlur={blur('firstName')}
                      style={{ ...inputBase, ...(touched.firstName && errors.firstName ? inputError : {}) }} />
                  </Field>
                  <Field label={f.lastName} required error={touched.lastName ? errors.lastName : undefined}>
                    <input type="text" placeholder={f.lastNamePh} value={form.lastName} onChange={set('lastName')} onBlur={blur('lastName')}
                      style={{ ...inputBase, ...(touched.lastName && errors.lastName ? inputError : {}) }} />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Field label={f.email} required error={touched.email ? errors.email : undefined}>
                    <input type="email" placeholder={f.emailPh} value={form.email} onChange={set('email')} onBlur={blur('email')}
                      style={{ ...inputBase, ...(touched.email && errors.email ? inputError : {}) }} />
                  </Field>
                  <Field label={f.phone}>
                    <input type="tel" placeholder={f.phonePh} value={form.phone} onChange={set('phone')} style={inputBase} />
                  </Field>
                </div>

                <div className="mb-4">
                  <Field label={f.helpLabel} required error={touched.helpTopic ? errors.helpTopic : undefined}>
                    <select value={form.helpTopic} onChange={set('helpTopic')} onBlur={blur('helpTopic')}
                      style={{ ...inputBase, color: form.helpTopic ? '#111118' : '#9ca3af', appearance: 'none', backgroundImage: SELECT_BG, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 38, ...(touched.helpTopic && errors.helpTopic ? inputError : {}) }}>
                      <option value="" disabled>{f.helpPh}</option>
                      {f.helpOptions.map((opt, i) => (
                        <option key={i} value={['booking','corporate','fleet','support','other'][i]}>{opt}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Field label={f.dateLabel}>
                    <input type="date" value={form.preferredDate} onChange={set('preferredDate')}
                      style={{ ...inputBase, color: form.preferredDate ? '#111118' : '#9ca3af' }} />
                  </Field>
                  <Field label={f.passengersLabel}>
                    <select value={form.passengers} onChange={set('passengers')}
                      style={{ ...inputBase, appearance: 'none', backgroundImage: SELECT_BG, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 38 }}>
                      {[1,2,3,4,5,6,7,8].map(n => (
                        <option key={n} value={String(n)}>{n} {n > 1 ? f.passengers : f.passenger}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="mb-5">
                  <Field label={f.messageLabel} required error={touched.message ? errors.message : undefined}>
                    <textarea placeholder={f.messagePh} value={form.message} onChange={set('message')} onBlur={blur('message')} rows={5}
                      style={{ ...inputBase, resize: 'vertical', minHeight: 120, ...(touched.message && errors.message ? inputError : {}) }} />
                  </Field>
                </div>

                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11.5, color: '#9ca3af', marginBottom: 20, lineHeight: 1.6 }}>
                  {f.disclaimer}{' '}
                  <a href="#" style={{ color: '#005C66', textDecoration: 'underline' }}>{f.privacyLink}</a>{' '}
                  {f.and}{' '}
                  <a href="#" style={{ color: '#005C66', textDecoration: 'underline' }}>{f.termsLink}</a>.
                </p>

                <button type="submit"
                  className="flex items-center gap-2.5 font-semibold transition-opacity hover:opacity-85 active:scale-[0.98]"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#fff', background: '#0A3B3C', border: 'none', borderRadius: 50, padding: '13px 28px', cursor: 'pointer', transition: 'opacity 0.2s ease, transform 0.15s ease' }}>
                  {f.sendBtn}
                  <Send size={15} style={{ transform: isRtl ? 'scaleX(-1)' : undefined }} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
