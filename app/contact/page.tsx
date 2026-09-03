import type { Metadata } from 'next'
import PageTitle from '@/components/PageTitle'
import ContactHero from '@/components/ContactHero'
import ContactFormSection from '@/components/ContactFormSection'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: "Whether you need help with a booking, want to arrange corporate transportation, or simply have questions, our team is ready to assist.",
}

export default function ContactPage() {
  return (
    <>
      <PageTitle en="Contact Us | White Line" ar="تواصل معنا | White Line" />
      <ContactHero />
      <ContactFormSection />
      <div className="w-full bg-white py-8 ">
    <div className="max-w-7xl mx-auto rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <iframe
        src="https://maps.google.com/maps?q=24.760944,46.673028&z=15&output=embed"
        width="100%"
        height="400"
        style={{ display: 'block', border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="White Line Office Location"
      />
    </div>
</div>
    </>
  )
}
