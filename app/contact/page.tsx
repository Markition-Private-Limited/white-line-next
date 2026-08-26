import type { Metadata } from 'next'
import ContactHero from '@/components/ContactHero'
import ContactFormSection from '@/components/ContactFormSection'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: "Whether you need help with a booking, want to arrange corporate transportation, or simply have questions, our team is ready to assist.",
}

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactFormSection />
      <div className="w-full bg-white" style={{ padding: '0 0 80px' }}>
        <iframe
          src="https://maps.google.com/maps?q=24.760944,46.673028&z=15&output=embed"
          width="100%"
          height="600"
          style={{ display: 'block', border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="White Line Office Location"
        />
      </div>
    </>
  )
}
