'use client'
import { useLanguage } from '../context/LanguageContext'

export default function TermsContent() {
  const { trans, dir } = useLanguage()
  const isRtl = dir === 'rtl'
  const { effectiveDate, intro, sections } = trans.termsPage

  return (
    <section className="w-full bg-white">
      <div
        className="w-full px-4 py-16 sm:px-8 lg:px-16"
        dir={isRtl ? 'rtl' : 'ltr'}
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        {/* Effective date */}
        <p
          className="mb-6"
          style={{ fontSize: '13px', color: '#111118', fontWeight: 400 }}
        >
          {effectiveDate}
        </p>

        {/* Intro paragraph */}
        <p
          className="mb-10 leading-relaxed"
          style={{ fontSize: 'clamp(13px, 1.4vw, 14px)', color: '#444', lineHeight: 1.8 }}
        >
          {intro}
        </p>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, si) => (
            <div key={si}>
              <h2
                className="mb-3 font-bold"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: 'clamp(14px, 1.6vw, 16px)',
                  color: '#111118',
                  letterSpacing: '0.01em',
                }}
              >
                {section.title}
              </h2>

              {section.body && (
                <p
                  className="mb-4 leading-relaxed"
                  style={{ fontSize: 'clamp(13px, 1.4vw, 14px)', color: '#444', lineHeight: 1.8 }}
                >
                  {section.body}
                </p>
              )}

              {section.subsections && section.subsections.length > 0 && (
                <div className="space-y-5">
                  {section.subsections.map((sub, subi) => (
                    <div key={subi}>
                      {sub.title && (
                        <h3
                          className="mb-2 font-bold"
                          style={{
                            fontFamily: 'Montserrat, sans-serif',
                            fontSize: 'clamp(13px, 1.4vw, 14px)',
                            color: '#111118',
                          }}
                        >
                          {sub.title}
                        </h3>
                      )}
                      {sub.body && (
                        <p
                          className="mb-3 leading-relaxed"
                          style={{ fontSize: 'clamp(13px, 1.4vw, 14px)', color: '#444', lineHeight: 1.8 }}
                        >
                          {sub.body}
                        </p>
                      )}
                      {sub.items && sub.items.length > 0 && (
                        <ul
                          className="mb-3 space-y-1"
                          style={{ paddingLeft: isRtl ? 0 : '1.2rem', paddingRight: isRtl ? '1.2rem' : 0 }}
                        >
                          {sub.items.map((item, ii) => (
                            <li
                              key={ii}
                              style={{
                                fontSize: 'clamp(13px, 1.4vw, 14px)',
                                color: '#444',
                                lineHeight: 1.8,
                                listStyleType: 'disc',
                              }}
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                      {(sub as any).footer && (
                        <p
                          className="mt-3 leading-relaxed"
                          style={{ fontSize: 'clamp(13px, 1.4vw, 14px)', color: '#444', lineHeight: 1.8 }}
                        >
                          {(sub as any).footer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 h-px w-full" style={{ background: '#e8e8e8' }} />
        <p
          className="mt-6 text-center"
          style={{ fontSize: '12px', color: '#999', fontFamily: 'Montserrat, sans-serif' }}
        >
          © {new Date().getFullYear()} White Line Transportation. All rights reserved.
        </p>
      </div>
    </section>
  )
}
