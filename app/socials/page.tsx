import type { Metadata } from 'next'
import PageTitle from '@/components/PageTitle'
import Navbar from '@/layouts/Navbar'
import SocialChannelsSection from '@/components/SocialChannelsSection'
import SocialsMapSection from '@/components/SocialsMapSection'
import SocialsHelpSection from '@/components/SocialsHelpSection'
import AppSection from '@/components/AppSection'

export const metadata: Metadata = {
  title: 'Stay Connected',
  description: 'Follow White Line on social media for updates, offers and a closer look at our luxury chauffeur experiences across Saudi Arabia.',
}

export default function SocialsPage() {
  return (
    <>
      <PageTitle en="Stay Connected | White Line" ar="ابقَ على تواصل | White Line" />
      <div style={{ background: '#ffffff' }}>
        <Navbar frosted />
      </div>
      <SocialChannelsSection />
      <SocialsMapSection />
      <SocialsHelpSection />
      <AppSection />
    </>
  )
}
