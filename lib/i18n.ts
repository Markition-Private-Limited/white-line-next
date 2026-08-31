// ─── Language registry ────────────────────────────────────────────────────────
export type LangCode = 'en' | 'ar'

export interface LangMeta {
  label: string
  nativeLabel: string
  dir: 'ltr' | 'rtl'
  flag: string     // emoji flag (fallback)
  flagCode: string // ISO 3166-1 alpha-2 country code for flag-icons
}

export const LANG_META: Record<LangCode, LangMeta> = {
  en: { label: 'English',  nativeLabel: 'English',  dir: 'ltr', flag: '🇺🇸', flagCode: 'us' },
  ar: { label: 'Arabic',   nativeLabel: 'العربية',  dir: 'rtl', flag: '🇸🇦', flagCode: 'sa' },
}

// ─── Canonical English shape ──────────────────────────────────────────────────
const en = {
  nav: {
    links: [
      { label: 'Home',       to: '/' },
      { label: 'About Us',           to: '/about' },
      { label: 'Our Services',       to: '/services' },
      { label: 'Our Fleet',          to: '/fleet' },
      { label: 'White Line Partners', to: '/b2b/login' },
      { label: 'Contact Us', to: '/contact' },
    ],
    download: 'Download Now',
  },

  hero: {
    line1: 'Luxury Travel With',
    line2: 'Purpose & Precision.',
    sub: 'White Lane brings together premium chauffeur services and modern technology to create a transportation experience built around comfort, reliability, privacy, and exceptional service.',
    services: [
      { title: 'One Way Ride',      desc: 'Simple point-to-point travel.' },
      { title: 'Hourly Chauffeur',  desc: 'Keep your chauffeur by the hour.' },
      { title: 'City-to-City',      desc: 'Comfortable intercity travel.' },
      { title: 'Day Service',       desc: 'Full-day vehicle block.' },
      { title: 'Airport Transfer',  desc: 'Airport pickups and drop-offs.' },
    ],
    bookNow: 'Book Now',
  },

  experience: {
    label: 'The Whiteline Experience',
    h1: 'More Than A Ride. A',
    h2: 'Better Way To Move.',
    sub: 'WhiteLane delivers premium chauffeur transportation for people who value comfort, reliability, and exceptional service. From airport transfers to corporate journeys, every ride is designed to make growing more effortless.',
    stats: [
      { suffix: 'K+',  label: 'Successfully\nCompleted Rides' },
      { suffix: '+',   label: 'Elite\nChauffeurs' },
      { suffix: '%',   label: 'On-Time\nRating' },
      { suffix: '24/7',label: 'Dedicated\nSupport' },
    ],
  },

  services: {
    label: 'Our Services',
    h1: 'One Destination Or Many.',
    h2: "We've Got The Ride.",
    sub: 'WhiteLane delivers premium chauffeur transportation for people who value comfort, reliability, and exceptional service. From airport transfers to corporate journeys, every ride is designed to make growing more effortless.',
    explore: 'Explore Service',
    cards: [
      { title: 'One-Way Ride',       desc: 'Seamless point-to-point urban transportation — arrive promptly and composed, free from traffic stress and unnecessary detours.' },
      { title: 'Hourly Chauffeur',   desc: 'A dedicated private chauffeur at your disposal for dynamic itineraries, multiple stops, and complete scheduling flexibility.' },
      { title: 'City to City',       desc: 'Private executive travel between major cities in absolute comfort — relax or conduct business uninterrupted across regions.' },
      { title: 'Day Service',        desc: 'Full-day dedicated transport for back-to-back meetings, VIP hosting, and multi-location itineraries with continuous vehicle availability.' },
      { title: 'Airport Transfer',   desc: 'Premier airport transfers with real-time flight tracking, proactive delay adjustments, and professional luggage assistance.' },
    ],
  },

  whyChoose: {
    h1: 'Why Choose',
    brand: 'Whiteline',
    sub: 'Elevate your travel experience with White Line, where distinction between standard transit & premium service is found in every meticulously detail. We replace uncertainty of traditional transport with uncompromising reliability.',
    readMore: 'Read More',
  },

  journey: {
    label: 'More Than Transportation',
    h1: 'Designed Around',
    h2: 'Your Journey.',
    sub: 'Every booking is managed to perfection, ensuring that you arrive refreshed, relaxed, and strictly on time.',
    stats: [
      { num: 50,  suffix: 'K+', label: 'Completed Rides' },
      { num: 500, suffix: '+',  label: 'Elite Chauffeurs' },
      { num: 99,  suffix: '%',  label: 'On-Time Rating' },
    ],
  },

  fleet: {
    label: 'The Whiteline Fleet',
    h1: 'Travel In Exceptional',
    h2: 'Comfort.',
    sub: 'A meticulously maintained collection of luxury sedans and executive vehicles, engineered for utmost comfort, privacy, and seamless travel across the Kingdom.',
    cars: [
      { title: 'Premium SUV',      desc: 'Spacious, versatile, and elegant. Perfect for small groups, families, and extra luggage capacity.' },
      { title: 'Executive Class',  desc: 'Uncompromised style and modern design. Tailored for individuals and business leaders.' },
      { title: 'Luxury Sedan',     desc: 'The absolute standard of executive comfort. Sleek profile with premium interior amenities.' },
      { title: 'Business SUV',     desc: 'Ideal for corporate events and group transfers. Combining power, comfort, and refined style.' },
      { title: 'Corporate Sedan',  desc: 'Sleek performance meets executive privilege. A seamless experience for the modern professional.' },
      { title: 'VIP Limousine',    desc: 'The pinnacle of luxury ground travel. Discreet, spacious, and impeccably appointed.' },
    ],
  },

  testimonials: {
    label: 'The Whiteline Experience',
    h1: 'What Our',
    h2: 'Customers',
    h3: 'Say',
    sub: 'Trusted by leaders, dignitaries, and frequent travelers across Saudi Arabia. Read how our unwavering commitment to discretion and punctuality shapes every journey.',
    reviews: [
      { name: 'Raza Hussain',    role: 'Consultant',        text: 'Park next busy ever. Elinor her his secure far twenty eat object. Any far saw size want man. Which way you wrong.' },
      { name: 'Sultan Ali',      role: 'Business Traveller', text: 'Ten the hastened steepest feelings pleasant few surprise property. An brother he do colonel against.' },
      { name: 'Farah Khan',      role: 'Operations Manager', text: 'Can how elinor warmly mrs basket marked. Led raising expense yet demesne weather musical. Me mr what.' },
      { name: 'Raza Hussain',    role: 'Executive Director', text: 'Park next busy ever. Elinor her his secure far twenty eat object. Any far saw size want man. Which way you wrong.' },
      { name: 'Khalid Al-Rashid',role: 'CEO',                text: 'Absolute excellence in service. Every journey has been seamless — the professionalism is unmatched.' },
      { name: 'Noor Al-Sayed',   role: 'VIP Guest',          text: 'The discretion and punctuality set Whiteline apart. I would not use any other chauffeur service.' },
      { name: 'Abdullah Hassan', role: 'Senior Manager',     text: 'Reliable, comfortable, and always on time. A truly premium experience from booking to arrival.' },
      { name: 'Mohammed Tariq',  role: 'Corporate Client',   text: 'Outstanding fleet and exceptional drivers. My clients are always impressed. Highly recommended.' },
    ],
  },

  app: {
    h1a: 'Professional',
    h1b: 'chauffeurs',
    h2: 'at your fingertips',
    hMob1: 'Professional',
    hMob2: 'Chauffeurs',
    hMob3: 'At Your Fingertips',
    sub: 'Download the Whiteline Chauffeur Hailing™ app to hail chauffeurs on demand in select cities.',
    apple:  { sub: 'Download on the', main: 'App Store' },
    google: { sub: 'Get it on',        main: 'Google Play' },
  },

  about: {
    hero: {
      h1: 'Redefining Executive',
      h2: 'Travel In The Kingdom',
      sub: 'Beyond a ride — we engineer seamless journeys. From single airport transfers to full-scale corporate delegations, our curated fleet and professional chauffeurs ensure you travel in absolute comfort, privacy, and punctuality across Saudi Arabia.',
      btn1: 'Explore Our Services',
      btn2: 'Book Your Ride',
    },
    whiteline: {
      h1: 'Engineered For',
      h2: 'Discerning Standards',
      sub: 'At White Line, luxury is not merely an aesthetic — it is a discipline. We believe that true executive travel requires an uncompromising dedication to precision, where every minute detail is anticipated before you even step inside the vehicle. Our operational framework is built from the ground up to serve leaders, dignitaries, and high-profile individuals who demand absolute perfection from their environment.',
      stats: [
        { suffix: 'K+',   label: 'Successfully\nCompleted Rides' },
        { suffix: '+',    label: 'Elite\nChauffeurs' },
        { suffix: '%',    label: 'On-Time\nRating' },
        { suffix: '24/7', label: 'Dedicated\nSupport' },
      ],
    },
    mastery: {
      label: 'Mastery Behind the Wheel',
      h1: 'Engineered For',
      h2: 'Discerning Standards',
      sub: 'At White Line, luxury is not merely an aesthetic — it is a discipline. We believe that true executive travel requires an uncompromising dedication to precision, where every minute detail is anticipated.',
      cards: [
        { title: 'Mastery Behind the Wheel', desc: 'Every chauffeur in our network is handpicked and rigorously trained beyond ordinary driving standards — ensuring each journey is handled with expertise and grace.' },
        { title: 'Punctuality as a Standard', desc: 'We treat time as the most valuable currency. Zero-compromise scheduling, real-time tracking, and proactive adjustments keep every arrival precisely on time.' },
        { title: 'Sanctuaries of Quiet Luxury', desc: 'Our fleet represents the pinnacle of automotive comfort. Each vehicle undergoes multi-point inspections and pristine detailing before every assignment.' },
      ],
    },
    advantage: {
      label: 'Tailored Corporate Solutions',
      h1: 'The WhiteLine',
      h2: 'Advantage',
      sub: 'In a world where transportation is commonplace, we treat every journey as a standard of distinction. By combining an elite fleet, rigorously trained chauffeurs, and a relentless commitment to your privacy and punctuality.',
      cells: [
        { title: 'Designed around your journey.', desc: 'From real-time tracking to any custom destination, every detail is custom-tailored.' },
        { title: 'Professional service.', desc: 'Experienced chauffeurs, trained strictly to prioritise comfort and discretion.' },
        { title: 'Technology that works for you.', desc: 'Simple booking, automatic notifications, transparent payments, and responsive support.' },
      ],
    },
    goldStandard: {
      label: 'The Gold Standard',
      h1: 'Why Leaders Choose',
      h2: 'WhiteLine',
      sub: 'Built on an uncompromising foundation of luxury, safety, and discretion, our service is tailored to meet the exacting standards of the Kingdom\'s elite.',
      cards: [
        { title: 'Elite Professionals', desc: 'Rigorously vetted chauffeurs trained in executive etiquette and absolute confidentiality.' },
        { title: 'Pristine Vehicles', desc: 'Meticulously maintained luxury sedans engineered for supreme comfort and safety.' },
        { title: 'Total Privacy', desc: 'Secure operational workflows ensuring complete discretion for dignitaries and leaders.' },
      ],
    },
  },

  footer: {
    tagline: 'Premium chauffeur services built on comfort, reliability, and discretion.',
    columns: {
      company:   { title: 'Company',   links: ['About Us','Partners','Cancellation Policy','Privacy Policy',  ] },
      services:  { title: 'Services',  links: ['One Way Ride', 'Hourly Chauffeur', 'City-To-City', 'Day Service', 'Airport Transfer'] },
      resources: { title: 'Our Fleet', links: ['First Class', 'Business Class', 'SUV', 'Sedan', 'Van', 'Coaster & Bus'] },
      support:   { title: 'Support',   links: ['Contact Us', 'Customer Support', 'Testimonials', 'FAQs', 'Help Center'] },
    },
  },

  servicesPage: {
    hero: {
      h1a: 'Every Journey',
      h1b: 'Deserves A Better Way.',
      sub: 'From the moment you land to the moment you arrive, WhiteLine delivers premium chauffeur transportation with privacy, precision and a service experience designed around you.',
      btn1: 'Explore Our Services',
      btn2: 'Book Your Ride',
    },
    list: {
      label: 'Our Services',
      h1: 'One Destination Or Many.',
      h2: "We've Got The Ride.",
      sub: 'WhiteLine delivers premium chauffeur transportation for people who value comfort, reliability, and exceptional service. From airport transfers to corporate journeys, every ride is designed to make growing more effortless.',
      explore: 'Explore Service',
      items: [
        { label: 'One-Way Ride',       h1a: 'Direct ',   h1b: 'Point-To-Point', h1c: '',         h2a: 'Urban Transportation',   h2b: '',                      body: 'Experience seamless, point-to-point urban transportation meticulously designed for efficiency and elegance. Whether you are heading to a high-stakes corporate briefing, a private appointment, or a critical engagement across town, our direct transit service ensures you arrive promptly and completely composed, eliminating the stress of navigation, traffic management, and unnecessary detours.' },
        { label: 'Hourly Chauffeur',   h1a: 'On-Demand Hourly', h1b: '',        h1c: '',         h2a: '',                       h2b: 'Chauffeur Service',       body: 'Enjoy the ultimate convenience of dedicated mobility with a private chauffeur entirely at your disposal throughout the day. Designed for dynamic, ever-changing itineraries and multiple consecutive stops, this bespoke service offers unmatched flexibility, allowing you to move through your schedule at your own pace while your vehicle and driver remain ready and waiting nearby.' },
        { label: 'City To City',       h1a: '',          h1b: 'Long-Distance',  h1c: ' Intercity', h2a: 'Executive Travel',      h2b: '',                      body: 'Bridge the distance between major metropolitan hubs in absolute comfort and tranquility. Our intercity travel service provides a smooth, private environment within an elite luxury vehicle, allowing you to relax, prepare for upcoming engagements, or conduct confidential business uninterrupted while traveling seamlessly across regions.' },
        { label: 'Day Service',        h1a: 'Dedicated Full-Day', h1b: '',      h1c: '',         h2a: '',                       h2b: 'Professional Transport',  body: "Secure a dedicated professional transportation partner for your entire day's schedule. Perfect for back-to-back corporate meetings, VIP hosting, and complex multi-location event itineraries, this comprehensive service guarantees continuous vehicle availability, flawless coordination, and uncompromised discretion from your first morning departure until late into the evening." },
        { label: 'Airport Transfer',   h1a: 'Seamless ', h1b: 'Airport Transfers', h1c: '',     h2a: '& Flight Tracking',     h2b: '',                      body: 'Start or conclude your international journey with absolute peace of mind through our premier airport transfer service. Featuring real-time flight tracking, proactive schedule adjustments for delayed flights, and professional luggage assistance, our chauffeurs ensure a smooth, effortless transition between the terminal and your final destination.' },
      ],
    },
  },

  customerSupportPage: {
    hero: {
      h1a: "We're Here When",
      h1b: 'You Need Us.',
      sub: 'Professional assistance for all your client support needs. Available 24/7 to handle every ticket, journey detail, dispatcher issue and unexpected delay.',
      btn: 'Get Support',
    },
    services: {
      label: 'Customer Stories',
      h1: 'More Than A Ride.',
      h2a: 'A ',
      h2b: 'Better Experience.',
      sub: 'Every journey is different. What remains consistent is the experience our passengers receive — professional chauffeurs, dependable service, premium vehicles and the comfort of knowing everything is taken care of.',
      cards: [
        { title: '24/7 Phone Support',   desc: 'Native speakers prepared to manage high-call volumes, emergency calls and trip tracking around the clock.' },
        { title: 'Booking Assistance',   desc: 'Welcome changes to active reservations, getting users matched to options directly and effortlessly.' },
        { title: 'Cancelation Support',  desc: 'Smooth handling of incoming cancelation requests with prompt communication to keep drivers updated.' },
        { title: 'Ride Issues',          desc: 'Solving urgent road situations and matching backup options quickly to maintain dispatcher performance.' },
      ],
    },
    activeTrip: {
      label: 'Active Trip Support',
      h1a: 'On The Road?',
      h1b: "We've Got You.",
      sub: 'Whether matching a fleeting slot, looking up route variants, or speaking with active drivers, our system remains synchronized.',
      btn: 'Contact Dispatch',
      cardTitle: 'Create Journey',
      cardMap: 'Active Map',
      fieldFrom: 'FROM',
      fieldTo: 'TO',
      fieldPassengers: 'PASSENGERS',
      checkRates: 'Check Rates',
      bookSupport: 'Book Support',
    },
  },

  testimonialsPage: {
    hero: {
      h1a: 'Our Customers',
      h1b: 'Say It Best.',
      sub: 'From airport arrivals to executive journeys, White Line is trusted by passengers and businesses who expect more from every mile.',
      btn: 'Read Customer Reviews',
    },
    stories: {
      label: 'Customer Stories',
      h1: 'More Than A Ride.',
      h2a: 'A ',
      h2b: 'Better Experience.',
      sub: 'Every journey is different. What remains consistent is the experience our passengers receive — professional chauffeurs, dependable service, premium vehicles and the comfort of knowing everything is taken care of.',
      quote: '"White Line made every part of my journey feel effortless. The chauffeur was punctual, discreet and incredibly professional."',
      reviewerName: 'Riad Husseini',
      reviewerRole: 'Entrepreneur',
    },
    voices: {
      label: 'Voices of Distinction',
      h1: 'Trusted By Those Who Demand',
      h2: 'Absolute Excellence',
      sub: 'Hear firsthand from the corporate leaders, dignitaries, and discerning travelers who rely on White Line to elevate their journeys, protect their privacy, and deliver uncompromised luxury across every mile.',
    },
  },

  contactPage: {
    hero: {
      h1a: "We're Here To Make Your",
      h1b: 'Journey Effortless.',
      sub: 'Whether you need help with a booking, want to arrange corporate transportation, or simply have questions, our team is ready to assist.',
    },
    info: {
      h1: "Let's Talk About Your",
      h2: 'Next Journey.',
      body: 'Our team is available to help with reservations, chauffeur services, corporate accounts, fleet questions, and customer support.',
      cards: [
        { title: 'Call Us',            value: '+1 (555) 000-0000',     sub: 'For bookings and immediate assistance' },
        { title: 'Email Us',           value: 'support@whitelane.com', sub: 'We aim to respond as quickly as possible' },
        { title: 'Support Available',  value: '24/7 Customer Support', sub: 'For active rides and urgent inquiries' },
      ],
    },
    form: {
      title: 'Send us a message',
      sub: 'Fill out what you need and a member of our team will get back to you.',
      firstName: 'First Name', firstNamePh: 'First name',
      lastName: 'Last Name',   lastNamePh: 'Last name',
      email: 'Email address',  emailPh: 'your@email.com',
      phone: 'Phone Number',   phonePh: '+1 (555) 000-0000',
      helpLabel: 'How can we help?', helpPh: 'Select an option',
      helpOptions: ['Book a Ride', 'Corporate Account Inquiry', 'Fleet Information', 'Customer Support', 'Other'],
      dateLabel: 'Preferred Date',
      passengersLabel: 'Passengers',
      passenger: 'Passenger', passengers: 'Passengers',
      messageLabel: 'Message', messagePh: 'Tell us about your request...',
      disclaimer: "By submitting this form you agree to White Lane's",
      privacyLink: 'privacy policy', and: 'and', termsLink: 'terms of service',
      sendBtn: 'Send Message',
      sentTitle: 'Message Sent!',
      sentBody: 'Thank you for reaching out. A member of our team will get back to you shortly.',
      errFirstName: 'First name is required',
      errLastName: 'Last name is required',
      errEmail: 'Email address is required',
      errEmailInvalid: 'Enter a valid email address',
      errHelpTopic: 'Please select an option',
      errMessage: 'Message is required',
    },
  },

  b2bLogin: {
    portal: 'B2B Client Portal',
    tagline: 'Precision in Motion',
    sub: 'The command center for the world\'s most elite chauffeur logistics operations.',
    copyright: '© 2026 Elite Chauffeur Logistics',
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    loginTab: 'Login',
    signupTab: 'Sign UP',
    email: 'Email Address',
    emailPlaceholder: 'Enter your email address',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    forgotPassword: 'Forgot Password?',
    rememberMe: 'Remember me',
    loginBtn: 'Login to Dashboard',
  },

  fleetPage: {
    hero: {
      h1a: 'A ',
      h1b: 'Vehicle',
      h1c: ' For',
      h2: 'Every Occasion',
      sub: 'Professional assistance for all your client support needs. Available 24/7 to handle every ticket, journey detail, dispatcher issue and unexpected delay.',
      btn: 'Explore Our Fleet',
    },
    cars: {
      label: 'Whiteline Fleet',
      h1: 'An Elite Fleet Engineered For',
      h2a: 'Supreme ',
      h2b: 'Comfort And Distinction',
      sub: 'Our meticulously maintained collection of high-end vehicles represents the absolute pinnacle of automotive luxury. Each model in our fleet undergoes rigorous multi-point inspections and pristine detailing.',
      luggages: 'Luggages',
      persons: 'Persons',
      filters: ['All', 'First Class', 'Business Class', 'SUV', 'Sedan', 'Van', 'Coaster & Bus'],
      desc: 'Spacious, versatile, and elegant',
    },
  },

  airportTransferPage: {
    hero: {
      h1a: 'Seamless',
      h1b: 'Airport Transfers',
      sub: 'From the moment your flight lands to your final destination — White Line ensures a flawless, punctual, and completely stress-free airport experience with professional chauffeurs and real-time flight tracking.',
      btn1: 'Book a Transfer',
      btn2: 'Explore Our Fleet',
    },
    overview: {
      label: 'Service Overview',
      h1a: 'Elevating',
      h1b: 'Airport Transfers',
      h2: 'Through Precision Logistics',
      body: 'Starting or concluding an international journey should never be a source of friction. Our airport service is meticulously engineered to eliminate the uncertainties of modern air travel, providing a seamless transition between the terminal and your final destination. By integrating real-time flight monitoring, proactive schedule adjustments for delayed arrivals, and personalised meet-and-greet protocols inside the terminal, we ensure that your arrival or departure is met with absolute punctuality and effortless elegance.',
    },
    steps: {
      label: 'Precision Logistics',
      h1a: 'A Effortless',
      h1b: 'Four-Step Journey',
      h2: 'Designed For Peace Of Mind',
      sub: 'Every journey is different. What remains consistent is the experience our passengers receive — professional chauffeurs, dependable service, premium vehicles and the comfort of knowing everything is taken care of.',
      items: [
        { num: '01', title: 'Effortless Booking', desc: 'Secure your vehicle seamlessly through our intuitive platform or digital app by simply entering your flight number, schedule, and destination details to initiate your reservation instantly.' },
        { num: '02', title: 'Proactive Monitoring', desc: "Our dispatch system continuously monitors your flight's live status, automatically adjusting your chauffeur's arrival time to accommodate early landings or unexpected delays without any hassle." },
        { num: '03', title: 'Terminal Welcome', desc: 'Step off the plane and into expert care as your vetted, professional chauffeur greets you inside the terminal arrival hall, holding a clear identifier and assisting you with your luggage.' },
        { num: '04', title: 'Tranquil Transit', desc: 'Relax or catch up on work within a private, climate-controlled luxury sanctuary as your chauffeur navigates the optimal route directly to your hotel, office, or residence.' },
      ],
    },
    features: {
      label: 'Key Features',
      h1a: 'Your ',
      h1b: 'Chauffeur',
      h1c: ', At',
      h2: 'Your Fingertips.',
      sub: 'The White Line app acts as your personal terminal concierge. Real-time driver status, terminal coordination notes, and instant billing are always active.',
      items: [
        { title: 'Stress-Free Arrival Windows', desc: 'Enjoy inclusive complimentary waiting time after landing so you never feel rushed through customs and luggage retrieval.' },
        { title: 'Live Flight Monitoring', desc: 'Continuous tracking allows our team to automatically adjust your pickup time for early arrivals or flight delays.' },
        { title: 'Professional Meet & Greet', desc: 'Your vetted, professional chauffeur greets you inside the arrival hall with a clear sign and full luggage assistance.' },
        { title: 'Tailored Luxury Vehicles', desc: 'Select from elite sedans and spacious SUVs perfectly suited for solo travelers or large corporate delegations.' },
      ],
    },
    faq: {
      label: 'Answers To Frequent Concerns',
      h1: 'Questions Before',
      h2: 'You Book?',
      sub: 'We operate with absolute transparency. If your question is not listed here, please connect with our round-the-clock support.',
      items: [
        {
          q: 'How do I track my incoming driver?',
          a: 'Through the White Line app, you receive live GPS tracking of your chauffeur from the moment they are dispatched. You will also receive proactive SMS notifications with real-time arrival estimates.',
        },
        {
          q: 'Can I alter my drop-off location mid-trip?',
          a: 'Yes. Simply inform your chauffeur or contact our support team during the journey. Changes are accommodated without friction — any fare adjustment is communicated transparently before it is applied.',
        },
        {
          q: 'What if my incoming flight is significantly delayed?',
          a: 'Our dispatch system monitors your flight in real time. Your chauffeur\'s arrival is automatically adjusted to align with your updated landing time at no additional charge — no calls or messages required from your side.',
        },
        {
          q: 'How are toll prices and parking fees calculated?',
          a: 'All applicable tolls and airport parking fees are included in your quoted fare upfront. There are no surprise charges at the end of your journey — what you see at booking is what you pay.',
        },
      ],
    },
  },

  hourlyBookingPage: {
    hero: {
      h1a: 'Flexible Hourly Chauffeur',
      h1b: 'Service Tailored',
      sub: 'Move through your demanding schedule with total freedom and poise. Our premium hourly chauffeur service keeps a private luxury vehicle and professional driver entirely at your disposal, ensuring seamless mobility, zero wait times, and complete privacy across every mile of your journey.',
      btn1: 'Book Hourly Booking',
      btn2: 'Explore Service',
    },
    overview: {
      label: 'Service Overview',
      h1a: 'Elevating On-Demand Mobility',
      h1b: '',
      h2: 'Through Unmatched Flexibility',
      body: 'Moving through a demanding schedule should never be constrained by rigid transportation plans. Our hourly chauffeur service is meticulously engineered to provide absolute flexibility, keeping a private luxury vehicle and professional driver entirely at your disposal. Whether you are managing back-to-back corporate meetings, private site visits, or a dynamic city itinerary, we ensure a seamless, uninterrupted environment where your time is fiercely protected and every route is masterfully navigated.',
    },
    steps: {
      label: 'Precision Logistics',
      h1a: 'A Effortless',
      h1b: 'Four-Step Journey',
      h2: 'Designed For Peace Of Mind',
      sub: 'Every journey is different. What remains consistent is the experience our passengers receive — professional chauffeurs, dependable service, premium vehicles and the comfort of knowing everything is taken care of.',
      items: [
        { num: '01', title: 'Effortless Booking', desc: 'Secure your vehicle seamlessly through our intuitive platform or digital app by simply entering your flight number, schedule, and destination details to initiate your reservation instantly.' },
        { num: '02', title: 'Proactive Monitoring', desc: "Our dispatch system continuously monitors your flight's live status, automatically adjusting your chauffeur's arrival time to accommodate early landings or unexpected delays without any hassle." },
        { num: '03', title: 'Terminal Welcome', desc: 'Step off the plane and into expert care as your vetted, professional chauffeur greets you inside the terminal arrival hall, holding a clear identifier and assisting you with your luggage.' },
        { num: '04', title: 'Tranquil Transit', desc: 'Relax or catch up on work within a private, climate-controlled luxury sanctuary as your chauffeur navigates the optimal route directly to your hotel, office, or residence.' },
      ],
    },
    features: {
      label: 'Key Features',
      h1a: 'Your ',
      h1b: 'Chauffeur',
      h1c: ', At',
      h2: 'Your Fingertips.',
      sub: 'The White Line app acts as your personal terminal concierge. Real-time driver status, terminal coordination notes, and instant billing are always active.',
      items: [
        { title: 'Stress-Free Arrival Windows', desc: 'Enjoy inclusive complimentary waiting time after landing so you never feel rushed through customs and luggage retrieval.' },
        { title: 'On-Demand Adaptability', desc: 'Enjoy complete freedom to update your itinerary, add impromptu stops, or modify your destination.' },
        { title: 'Dedicated Presence', desc: 'Step out of your meetings or appointments to find your professional chauffeur and pristine vehicle ready.' },
        { title: 'Seamless Completion', desc: 'Conclude your productive day with a relaxed ride back to your residence or hotel, supported by flawless service.' },
      ],
    },
    faq: {
      label: 'Answers To Frequent Concerns',
      h1: 'Questions Before',
      h2: 'You Book?',
      sub: 'We operate with absolute transparency. If your question is not listed here, please connect with our round-the-clock support.',
      items: [
        {
          q: 'How do I track my incoming driver?',
          a: 'Through the White Line app, you receive live GPS tracking of your chauffeur from the moment they are dispatched. You will also receive proactive SMS notifications with real-time arrival estimates.',
        },
        {
          q: 'Can I alter my drop-off location mid-trip?',
          a: 'Yes. Simply inform your chauffeur or contact our support team during the journey. Changes are accommodated without friction — any fare adjustment is communicated transparently before it is applied.',
        },
        {
          q: 'What if my incoming flight is significantly delayed?',
          a: 'Our dispatch system monitors your flight in real time. Your chauffeur\'s arrival is automatically adjusted to align with your updated landing time at no additional charge — no calls or messages required from your side.',
        },
        {
          q: 'How are toll prices and parking fees calculated?',
          a: 'All applicable tolls and airport parking fees are included in your quoted fare upfront. There are no surprise charges at the end of your journey — what you see at booking is what you pay.',
        },
      ],
    },
  },

  cityToCityPage: {
    hero: {
      h1a: 'Seamless Long-Distance',
      h1b: 'Intercity Travel',
      sub: 'Bridge the distance between major metropolitan hubs without the friction of traditional travel. Our premium city-to-city service provides an elite, private environment within a luxury vehicle, allowing you to relax, prepare for upcoming engagements, or conduct confidential business uninterrupted across every mile.',
      btn1: 'Book City To City',
      btn2: 'Explore Service',
    },
    overview: {
      label: 'Service Overview',
      h1a: 'Elevating',
      h1b: 'Intercity Travel',
      h2: 'Through Smooth Transit',
      body: 'Traveling between cities should be an extension of your productive workspace or a tranquil sanctuary rather than a commute to endure. Our intercity transport service is meticulously engineered to eliminate the fatigue of long-distance driving, airport security lines, and crowded transit hubs. By providing an elite vehicle, an experienced long-distance chauffeur, and a completely private, quiet cabin, we ensure that your regional journeys are transformed into an effortless, relaxing experience from your departure point to your final destination.',
    },
    steps: {
      label: 'Precision Logistics',
      h1a: 'A Effortless',
      h1b: 'Four-Step Journey',
      h2: 'Designed For Peace Of Mind',
      sub: 'Every journey is different. What remains consistent is the experience our passengers receive — professional chauffeurs, dependable service, premium vehicles and the comfort of knowing everything is taken care of.',
      items: [
        { num: '01', title: 'Effortless Booking', desc: 'Secure your vehicle seamlessly through our intuitive platform or digital app by simply entering your flight number, schedule, and destination details to initiate your reservation instantly.' },
        { num: '02', title: 'Proactive Monitoring', desc: "Our dispatch system continuously monitors your flight's live status, automatically adjusting your chauffeur's arrival time to accommodate early landings or unexpected delays without any hassle." },
        { num: '03', title: 'Terminal Welcome', desc: 'Step off the plane and into expert care as your vetted, professional chauffeur greets you inside the terminal arrival hall, holding a clear identifier and assisting you with your luggage.' },
        { num: '04', title: 'Tranquil Transit', desc: 'Relax or catch up on work within a private, climate-controlled luxury sanctuary as your chauffeur navigates the optimal route directly to your hotel, office, or residence.' },
      ],
    },
    features: {
      label: 'Key Features',
      h1a: 'Your ',
      h1b: 'Long-Distance Journey',
      h1c: ',',
      h2: 'Optimized For Comfort & Focus.',
      sub: 'Experience regional travel built around premium amenities, safety, and total privacy.',
      items: [
        { title: 'Direct Intercity Travel', desc: 'Skip the airport terminals and train stations with direct, door-to-door transportation from your exact origin to your destination.' },
        { title: 'Long-Distance Experts', desc: 'Travel securely with rigorously vetted, professional chauffeurs experienced in navigating regional highways.' },
        { title: 'Quiet, Connected Cabin', desc: 'Utilize the uninterrupted, climate-controlled environment to conduct calls, review documents, or rest peacefully.' },
        { title: 'Luxury Vehicles for Long Hauls', desc: 'Choose from our high-end fleet of spacious sedans and luxury SUVs engineered specifically to deliver supreme ride comfort.' },
      ],
    },
    faq: {
      label: 'Answers To Frequent Concerns',
      h1: 'Questions Before',
      h2: 'You Book?',
      sub: 'We operate with absolute transparency. If your question is not listed here, please connect with our round-the-clock support.',
      items: [
        {
          q: 'How do I track my incoming driver?',
          a: 'Through the White Line app, you receive live GPS tracking of your chauffeur from the moment they are dispatched. You will also receive proactive SMS notifications with real-time arrival estimates.',
        },
        {
          q: 'Can I alter my drop-off location mid-trip?',
          a: 'Yes. Simply inform your chauffeur or contact our support team during the journey. Changes are accommodated without friction — any fare adjustment is communicated transparently before it is applied.',
        },
        {
          q: 'What if my incoming flight is significantly delayed?',
          a: 'Our dispatch system monitors your flight in real time. Your chauffeur\'s arrival is automatically adjusted to align with your updated landing time at no additional charge — no calls or messages required from your side.',
        },
        {
          q: 'How are toll prices and parking fees calculated?',
          a: 'All applicable tolls and airport parking fees are included in your quoted fare upfront. There are no surprise charges at the end of your journey — what you see at booking is what you pay.',
        },
      ],
    },
  },

  dayServicePage: {
    hero: {
      h1a: 'Dedicated Full-Day',
      h1b: 'Professional Transportation',
      sub: "Secure a dedicated professional transportation partner for your entire day's schedule. Perfect for back-to-back corporate meetings, VIP hosting, and complex multi-location event itineraries, our comprehensive day service guarantees continuous vehicle availability and flawless coordination.",
      btn1: 'Book Day Service',
      btn2: 'Explore Service',
    },
    overview: {
      label: 'Service Overview',
      h1a: 'Comprehensive',
      h1b: 'Full-Day',
      h2: 'Partnerships',
      body: 'Managing high-stakes corporate events, intensive business tours, or VIP guest hosting requires a transportation partner who offers total reliability and adaptability. Our day service is meticulously designed to provide a dedicated luxury vehicle and chauffeur for an extended full-day duration. By eliminating the need for recurring bookings and ensuring continuous availability, we create a stable, private environment that adapts effortlessly to your evolving schedule, allowing you to focus entirely on your objectives while every logistical detail is handled with precision.',
    },
    steps: {
      label: 'Precision Logistics',
      h1a: 'A Effortless',
      h1b: 'Four-Step Journey',
      h2: 'Designed For Peace Of Mind',
      sub: 'Every journey is different. What remains consistent is the experience our passengers receive — professional chauffeurs, dependable service, premium vehicles and the comfort of knowing everything is taken care of.',
      items: [
        { num: '01', title: 'Effortless Booking', desc: 'Secure your vehicle seamlessly through our intuitive platform or digital app by simply entering your flight number, schedule, and destination details to initiate your reservation instantly.' },
        { num: '02', title: 'Proactive Monitoring', desc: "Our dispatch system continuously monitors your flight's live status, automatically adjusting your chauffeur's arrival time to accommodate early landings or unexpected delays without any hassle." },
        { num: '03', title: 'Terminal Welcome', desc: 'Step off the plane and into expert care as your vetted, professional chauffeur greets you inside the terminal arrival hall, holding a clear identifier and assisting you with your luggage.' },
        { num: '04', title: 'Tranquil Transit', desc: 'Relax or catch up on work within a private, climate-controlled luxury sanctuary as your chauffeur navigates the optimal route directly to your hotel, office, or residence.' },
      ],
    },
    features: {
      label: 'Key Features',
      h1a: 'Premium ',
      h1b: 'Full-Day Benefits',
      h1c: '',
      h2: 'Designed For Reliability',
      sub: 'Experience continuous, uninterrupted luxury transportation backed by elite service standards built for demanding schedules.',
      items: [
        { title: 'Continuous Vehicle Dedication', desc: 'Enjoy a dedicated luxury vehicle and chauffeur entirely at your disposal from morning until night.' },
        { title: 'Multi-Stop Coordination', desc: 'Effortlessly handle back-to-back corporate meetings, venue changes, and VIP hosting schedules with seamless routing.' },
        { title: 'Elite Privacy Standards', desc: 'Operate securely within a confidential, private environment supported by background-vetted, professional chauffeurs.' },
        { title: 'Executive Vehicles for Delegations', desc: 'Select from our high-end sedans and spacious luxury vehicles perfectly configured to accommodate executives.' },
      ],
    },
    faq: {
      label: 'Answers To Frequent Concerns',
      h1: 'Questions Before',
      h2: 'You Book?',
      sub: 'We operate with absolute transparency. If your question is not listed here, please connect with our round-the-clock support.',
      items: [
        {
          q: 'How do I track my incoming driver?',
          a: 'Through the White Line app, you receive live GPS tracking of your chauffeur from the moment they are dispatched. You will also receive proactive SMS notifications with real-time arrival estimates.',
        },
        {
          q: 'Can I alter my drop-off location mid-trip?',
          a: 'Yes. Simply inform your chauffeur or contact our support team during the journey. Changes are accommodated without friction — any fare adjustment is communicated transparently before it is applied.',
        },
        {
          q: 'What if my incoming flight is significantly delayed?',
          a: 'Our dispatch system monitors your flight in real time. Your chauffeur\'s arrival is automatically adjusted to align with your updated landing time at no additional charge — no calls or messages required from your side.',
        },
        {
          q: 'How are toll prices and parking fees calculated?',
          a: 'All applicable tolls and airport parking fees are included in your quoted fare upfront. There are no surprise charges at the end of your journey — what you see at booking is what you pay.',
        },
      ],
    },
  },

  oneWayRidePage: {
    hero: {
      h1a: 'Direct Point-To-Point',
      h1b: 'Urban Transportation',
      sub: 'Experience seamless, point-to-point urban transportation meticulously designed for efficiency and elegance. Whether you are heading to a high-stakes corporate briefing, a private appointment, or an evening engagement, your journey remains direct, private, and perfectly timed.',
      btn1: 'Book One Way Ride',
      btn2: 'Explore Service',
    },
    overview: {
      label: 'Service Overview',
      h1a: 'Elevating Direct Transit Through',
      h1b: 'Uncompromised Punctuality',
      h2: '',
      body: 'Navigating urban environments for a single destination should never be complicated by traffic stress or navigation hurdles. Our one-way ride service is engineered to provide direct, point-to-point executive transit that gets you where you need to be with absolute efficiency. By removing the friction of driving and parking, we offer a tranquil, climate-controlled cabin where you can relax, review your notes, or prepare mentally for your upcoming engagement, arriving completely composed and on time.',
    },
    steps: {
      label: 'Precision Logistics',
      h1a: 'A Effortless',
      h1b: 'Four-Step Journey',
      h2: 'Designed For Peace Of Mind',
      sub: 'Every journey is different. What remains consistent is the experience our passengers receive — professional chauffeurs, dependable service, premium vehicles and the comfort of knowing everything is taken care of.',
      items: [
        { num: '01', title: 'Effortless Booking', desc: 'Secure your vehicle seamlessly through our intuitive platform or digital app by simply entering your flight number, schedule, and destination details to initiate your reservation instantly.' },
        { num: '02', title: 'Proactive Monitoring', desc: "Our dispatch system continuously monitors your flight's live status, automatically adjusting your chauffeur's arrival time to accommodate early landings or unexpected delays without any hassle." },
        { num: '03', title: 'Terminal Welcome', desc: 'Step off the plane and into expert care as your vetted, professional chauffeur greets you inside the terminal arrival hall, holding a clear identifier and assisting you with your luggage.' },
        { num: '04', title: 'Tranquil Transit', desc: 'Relax or catch up on work within a private, climate-controlled luxury sanctuary as your chauffeur navigates the optimal route directly to your hotel, office, or residence.' },
      ],
    },
    features: {
      label: 'Key Features',
      h1a: 'An Effortless ',
      h1b: 'Four-Step Journey',
      h1c: '',
      h2: 'From Pickup To Destination',
      sub: 'From booking your direct ride to your final drop-off, our streamlined workflow ensures absolute transparency, smooth dispatch, and complete peace of mind.',
      items: [
        { title: 'Non-Stop Urban Transit', desc: 'Travel directly from your exact origin to your destination without any unnecessary detours or intermediate stops.' },
        { title: 'Timely Schedule Execution', desc: 'Arrive at your corporate meetings or private appointments strictly on time, supported by advanced route planning.' },
        { title: 'Undisturbed Environment', desc: 'Utilize your transit time to make confidential phone calls, handle emails, or simply relax in complete privacy.' },
        { title: 'Premium Fleet Selection', desc: 'Choose from our immaculate range of luxury sedans and executive vehicles designed for refined urban travel.' },
      ],
    },
    faq: {
      label: 'Answers To Frequent Concerns',
      h1: 'Questions Before',
      h2: 'You Book?',
      sub: 'We operate with absolute transparency. If your question is not listed here, please connect with our round-the-clock support.',
      items: [
        {
          q: 'How do I track my incoming driver?',
          a: 'Through the White Line app, you receive live GPS tracking of your chauffeur from the moment they are dispatched. You will also receive proactive SMS notifications with real-time arrival estimates.',
        },
        {
          q: 'Can I alter my drop-off location mid-trip?',
          a: 'Yes. Simply inform your chauffeur or contact our support team during the journey. Changes are accommodated without friction — any fare adjustment is communicated transparently before it is applied.',
        },
        {
          q: 'What if my incoming flight is significantly delayed?',
          a: 'Our dispatch system monitors your flight in real time. Your chauffeur\'s arrival is automatically adjusted to align with your updated landing time at no additional charge — no calls or messages required from your side.',
        },
        {
          q: 'How are toll prices and parking fees calculated?',
          a: 'All applicable tolls and airport parking fees are included in your quoted fare upfront. There are no surprise charges at the end of your journey — what you see at booking is what you pay.',
        },
      ],
    },
  },

  whyChooseUsPage: {
    hero: {
      h1a: 'The ',
      h1b: 'Difference',
      h1c: ' Is',
      h2: 'In Every Mile.',
      sub: 'White Line brings together premium chauffeur services and modern technology to create a transportation experience built around comfort, reliability, privacy, and exceptional service.',
      btn1: 'Explore Our Services',
      btn2: 'About Our Cars',
    },
    detail: {
      row1: {
        h1: 'Why Leaders Choose White Line For',
        h2: 'Executive Travel',
        body: 'In a fast-paced world where ordinary transportation often overlooks the finer nuances of comfort and security, White Line stands apart by treating every single journey as a true standard of distinction. We understand that for corporate leaders, dignitaries, and high-profile individuals, travel is not merely about reaching a physical destination — it is a critical extension of your professional standing, personal standards, and peace of mind.',
      },
      row2: {
        h1: 'Designed For ',
        h2: 'Every Scale',
        h3: 'Of Corporate Travel',
        body: "True luxury is defined by effortless execution, and our operational philosophy is built to adapt seamlessly to your exact requirements, no matter the scale. Whether you require a single, highly confidential airport transfer for a key executive arrival or an entire luxury fleet reserved for a multi-day international corporate summit, our advanced logistics framework handles the complexity behind the scenes so you don't have to.",
      },
    },
    quote: {
      plain: 'True Security Is Invisible Yet Ever-Present. At White Line, We Believe That Absolute Peace Of Mind Cannot Be Achieved',
      bold: 'Through Ordinary Measures—It Requires A Seamless Integration Of Advanced Vehicle Tracking, Rigorous Vetting.',
    },
    betterExp: {
      label: 'A Better Experience',
      h1: 'Luxury Is How You ',
      h2: 'Feel.',
      body: "We don't define luxury by expensive extras. For us, luxury is removing friction, keeping you secure, knowing your chauffeur is prepared, and having the information you need in a seamless way.",
      points: [
        { num: '01', title: 'Prepared for Your Journey', desc: 'The vehicle is sanitized, equipped with charging options, and climate-set before you board.' },
        { num: '02', title: 'Connected From Booking to Arrival', desc: 'Instant confirmations, driver contact info, vehicle status, and invoice copies are always accessible.' },
        { num: '03', title: 'Designed Around You', desc: 'Save favorite routes, choose preferred interior setups, and tailor support requests easily.' },
      ],
    },
    faq: {
      label: 'Frequently Asked Questions',
      h1: 'Before You ',
      h2: 'Reach Out.',
      h3: 'Everything You Need To Know',
      items: [
        { q: 'How can I book a White Line ride?', a: 'Booking is simple — use our mobile app, website, or call our 24/7 concierge line. You can schedule rides in advance or request one on demand. Instant confirmation is sent the moment your booking is secured.' },
        { q: 'Can I contact support about an existing booking?', a: "Absolutely. Our support team is reachable around the clock via in-app chat, email, or phone. You can modify, cancel, or get updates on any booking within seconds. Your driver's contact details are also shared once a chauffeur is assigned." },
        { q: 'Do you offer corporate transportation?', a: 'Yes. We provide dedicated corporate accounts with monthly invoicing, priority fleet access, multi-passenger coordination, and a dedicated account manager. Our corporate packages are tailored to fit the pace of your business.' },
        { q: 'Can I request a specific vehicle?', a: 'You can choose from our curated fleet — from executive sedans to full-size SUVs — at the time of booking. If you have a recurring preference, we save it to your profile so every ride is set up the way you like it.' },
        { q: 'Is customer support available 24/7?', a: 'Yes. White Line operates around the clock with live agents ready to assist. Whether you need last-minute changes, have questions mid-journey, or want to plan a future trip, someone is always available to help.' },
        { q: 'Are White Line chauffeurs professionally trained?', a: 'Every chauffeur undergoes rigorous background screening, defensive driving certification, and customer-service training before joining our fleet. We regularly audit performance through passenger feedback and internal quality reviews.' },
      ],
    },
  },
}

// ─── Arabic translations (Riyadh / Saudi dialect in formal written form) ──────
const ar: typeof en = {
  nav: {
    links: [
      { label: 'الرئيسية',   to: '/' },
      { label: 'من نحن',         to: '/about' },
      { label: 'خدماتنا',       to: '/services' },
      { label: 'أسطولنا',       to: '/fleet' },
      { label: 'شركاء وايت لاين', to: '/b2b/login' },
      { label: 'تواصل معنا', to: '/contact' },
    ],
    download: 'حمّل الآن',
  },

  hero: {
    line1: 'سفر راقٍ بهدف',
    line2: 'ودقة لا تُضاهى.',
    sub: 'وايت لاين تجمع بين خدمات السائق الفاخرة والتقنية الحديثة، لتقديم تجربة نقل استثنائية مبنية على الراحة والموثوقية والخصوصية والخدمة المتميزة.',
    services: [
      { title: 'رحلة أحادية',   desc: 'تنقل مباشر من نقطة لأخرى.' },
      { title: 'سائق بالساعة', desc: 'احتفظ بسائقك الخاص بالساعة.' },
      { title: 'بين المدن',     desc: 'رحلات مريحة بين المدن.' },
      { title: 'خدمة اليوم',   desc: 'حجز السيارة ليوم كامل.' },
      { title: 'نقل المطار',    desc: 'استقبال وتوصيل من وإلى المطار.' },
    ],
    bookNow: 'احجز الآن',
  },

  experience: {
    label: 'تجربة وايت لاين',
    h1: 'أكثر من مجرد رحلة.',
    h2: 'طريقة أفضل للتنقل.',
    sub: 'تقدم وايت لاين خدمات نقل فاخرة للذين يقدّرون الراحة والموثوقية والخدمة المتميزة. من نقل المطار إلى رحلات الأعمال، كل رحلة مصممة لتجعل حياتك أكثر سلاسة.',
    stats: [
      { suffix: ' ألف+', label: 'رحلة مكتملة\nبنجاح' },
      { suffix: '+',      label: 'سائق\nمتميز' },
      { suffix: '%',      label: 'تقييم\nالالتزام بالمواعيد' },
      { suffix: '٢٤/٧',  label: 'دعم\nمتواصل' },
    ],
  },

  services: {
    label: 'خدماتنا',
    h1: 'وجهة واحدة أو أكثر.',
    h2: 'لدينا الرحلة المثالية.',
    sub: 'تقدم وايت لاين خدمات نقل فاخرة للذين يقدّرون الراحة والموثوقية والخدمة المتميزة. من نقل المطار إلى رحلات الأعمال، كل رحلة مصممة لتجعل حياتك أكثر سلاسة.',
    explore: 'استعرض الخدمة',
    cards: [
      { title: 'رحلة أحادية',   desc: 'نقل حضري سلس من نقطة إلى أخرى — صل إلى وجهتك في الوقت المحدد وبهدوء تام، بعيداً عن ضغوط المرور والمسارات غير الضرورية.' },
      { title: 'سائق بالساعة', desc: 'سائق خاص مخصص بالكامل لك طوال اليوم، مع مرونة تامة للتنقل بين مواعيد متعددة وتغييرات فورية في الجدول.' },
      { title: 'بين المدن',     desc: 'سفر تنفيذي خاص بين كبرى المدن في راحة تامة — استرخِ أو أنجز أعمالك دون انقطاع أثناء التنقل.' },
      { title: 'خدمة اليوم',   desc: 'نقل مخصص ليوم كامل للاجتماعات المتلاحقة واستضافة كبار الشخصيات والفعاليات متعددة المواقع.' },
      { title: 'نقل المطار',    desc: 'نقل مطار احترافي مع تتبع الرحلات فورياً وتعديل المواعيد تلقائياً ومساعدة متخصصة في الأمتعة.' },
    ],
  },

  whyChoose: {
    h1: 'لماذا تختار',
    brand: 'وايت لاين',
    sub: 'ارتقِ بتجربة سفرك مع وايت لاين، حيث يتجلى الفرق بين النقل العادي والخدمة الراقية في كل تفصيلة. نستبدل غموض وسائل النقل التقليدية بموثوقية لا تتنازل عنها.',
    readMore: 'اقرأ المزيد',
  },

  journey: {
    label: 'أكثر من مجرد نقل',
    h1: 'مصمم حول',
    h2: 'رحلتك.',
    sub: 'كل حجز يُدار بكل دقة واحترافية، لتصل منتعشاً ومرتاحاً وفي الوقت المحدد تماماً.',
    stats: [
      { num: 50,  suffix: ' ألف+', label: 'رحلة مكتملة' },
      { num: 500, suffix: '+',      label: 'سائق متميز' },
      { num: 99,  suffix: '%',      label: 'التزام بالمواعيد' },
    ],
  },

  fleet: {
    label: 'أسطول وايت لاين',
    h1: 'سافر بأقصى درجات',
    h2: 'الراحة والفخامة.',
    sub: 'مجموعة مختارة بعناية من السيارات الفاخرة والمركبات التنفيذية، مصممة لأقصى درجات الراحة والخصوصية والتنقل السلس في أرجاء المملكة.',
    cars: [
      { title: 'SUV الفاخرة',      desc: 'فسيحة وأنيقة ومتعددة الاستخدامات. مثالية للمجموعات الصغيرة والعائلات وسعة الأمتعة.' },
      { title: 'الدرجة التنفيذية', desc: 'أسلوب لا يُضاهى وتصميم عصري. مخصصة للأفراد وقادة الأعمال.' },
      { title: 'السيدان الفاخرة',  desc: 'أعلى معايير الراحة التنفيذية. مظهر أنيق مع أجواء داخلية راقية.' },
      { title: 'SUV الأعمال',      desc: 'مثالية لفعاليات الشركات والنقل الجماعي. تجمع القوة والراحة والأناقة.' },
      { title: 'سيدان الشركات',    desc: 'أداء رفيع يلتقي بامتياز تنفيذي. تجربة سلسة للمحترف الحديث.' },
      { title: 'ليموزين VIP',      desc: 'قمة الفخامة في السفر البري. خاصة وفسيحة ومجهزة بكل ما يلزم.' },
    ],
  },

  testimonials: {
    label: 'تجربة وايت لاين',
    h1: 'ماذا يقول',
    h2: 'عملاؤنا',
    h3: '',
    sub: 'موثوق من قِبل القادة والشخصيات الرفيعة والمسافرين المتكررين في أرجاء المملكة العربية السعودية. اقرأ كيف يُشكّل التزامنا بالخصوصية والدقة كل رحلة.',
    reviews: [
      { name: 'رزا حسين',      role: 'مستشار',          text: 'خدمة استثنائية في كل تفصيلة. وصلت في الوقت المحدد وبكل راحة. أنصح بها بشدة لكل من يبحث عن السفر الراقي.' },
      { name: 'سلطان علي',     role: 'رجل أعمال',       text: 'تجربة فاخرة لا مثيل لها. السائق كان محترفاً للغاية والسيارة كانت في قمة النظافة والأناقة.' },
      { name: 'فرح خان',       role: 'مديرة عمليات',    text: 'وايت لاين غيّرت مفهومي للنقل الراقي. الدقة في المواعيد والاهتمام بالتفاصيل أمر يُشكر.' },
      { name: 'رزا حسين',      role: 'مدير تنفيذي',     text: 'خدمة احترافية من الدرجة الأولى. كل رحلة كانت تجربة مميزة تستحق التكرار.' },
      { name: 'خالد الراشد',   role: 'الرئيس التنفيذي', text: 'تميز لا يُضاهى في الخدمة. كل رحلة كانت سلسة تماماً — الاحترافية لا مثيل لها.' },
      { name: 'نور السيد',     role: 'ضيف VIP',          text: 'الخصوصية والالتزام بالمواعيد ما يميز وايت لاين. لن أستخدم خدمة نقل أخرى بعد الآن.' },
      { name: 'عبدالله حسن',   role: 'مدير أول',        text: 'موثوق ومريح ودائم في الوقت المحدد. تجربة راقية حقاً من الحجز حتى الوصول.' },
      { name: 'محمد طارق',     role: 'عميل مؤسسي',      text: 'أسطول رائع وسائقون متميزون. عملائي دائماً يُبدون إعجابهم. أنصح بها بشدة.' },
    ],
  },

  app: {
    h1a: 'سائقون',
    h1b: 'محترفون',
    h2: 'في متناول يدك',
    hMob1: 'سائقون',
    hMob2: 'محترفون',
    hMob3: 'في متناول يدك',
    sub: 'حمّل تطبيق وايت لاين للطلب الفوري للسائقين في المدن المتاحة.',
    apple:  { sub: 'حمّل من',      main: 'App Store' },
    google: { sub: 'احصل عليه من', main: 'Google Play' },
  },

  about: {
    hero: {
      h1: 'إعادة تعريف السفر التنفيذي',
      h2: 'في المملكة',
      sub: 'أكثر من مجرد رحلة — نُهندس تجارب سفر سلسة. من نقل المطار الفردي إلى الوفود المؤسسية الكاملة، يضمن أسطولنا المنتقى وسائقونا المحترفون وصولك بكل راحة وخصوصية ودقة في أرجاء المملكة.',
      btn1: 'استكشف خدماتنا',
      btn2: 'احجز رحلتك',
    },
    whiteline: {
      h1: 'مُهندَس لمعايير',
      h2: 'الرقي والتميز',
      sub: 'في وايت لاين، الفخامة ليست مجرد مظهر — بل هي منهج عمل. نؤمن بأن السفر التنفيذي الحقيقي يستلزم التزاماً راسخاً بالدقة، حيث يُستبق كل تفصيلة قبل أن تخطو داخل المركبة. إطارنا التشغيلي مُبني من الصفر لخدمة القادة والشخصيات الرفيعة والأفراد البارزين.',
      stats: [
        { suffix: ' ألف+', label: 'رحلة مكتملة\nبنجاح' },
        { suffix: '+',      label: 'سائق\nمتميز' },
        { suffix: '%',      label: 'تقييم\nالالتزام بالمواعيد' },
        { suffix: '٢٤/٧',  label: 'دعم\nمتواصل' },
      ],
    },
    mastery: {
      label: 'الإتقان خلف المقود',
      h1: 'مُهندَس لمعايير',
      h2: 'الرقي والتميز',
      sub: 'في وايت لاين، الفخامة ليست مجرد مظهر — بل هي منهج عمل. نؤمن بأن السفر التنفيذي الحقيقي يستلزم التزاماً راسخاً بالدقة، حيث يُستبق كل تفصيلة.',
      cards: [
        { title: 'الإتقان خلف المقود', desc: 'يُختار كل سائق في شبكتنا بعناية ويتلقى تدريباً صارماً يتجاوز المعايير المعتادة — لضمان قيادة كل رحلة بخبرة ورقي.' },
        { title: 'الالتزام بالمواعيد معيارٌ ثابت', desc: 'نتعامل مع الوقت باعتباره أثمن الأصول. جدولة لا تقبل المساومة وتتبع لحظي وتعديلات استباقية تضمن دقة الوصول في كل مرة.' },
        { title: 'ملاذات من الفخامة الهادئة', desc: 'يمثل أسطولنا قمة الراحة في عالم السيارات. تخضع كل مركبة لفحوصات متعددة النقاط وتنظيف احترافي قبل كل مهمة.' },
      ],
    },
    advantage: {
      label: 'حلول مؤسسية مخصصة',
      h1: 'ميزة',
      h2: 'وايت لاين',
      sub: 'في عالم تتشابه فيه خدمات النقل، نعامل كل رحلة باعتبارها معياراً للتميز. بدمج أسطول نخبوي وسائقين مدربين تدريباً صارماً والتزام لا يتراجع بخصوصيتك ودقة مواعيدك.',
      cells: [
        { title: 'مصمم حول رحلتك.', desc: 'من التتبع اللحظي إلى أي وجهة مخصصة، كل تفصيلة مُهيَّأة وفق احتياجاتك.' },
        { title: 'خدمة احترافية.', desc: 'سائقون ذوو خبرة، مدربون على إيلاء الراحة والخصوصية الأولوية القصوى.' },
        { title: 'تقنية تعمل لصالحك.', desc: 'حجز مبسّط وإشعارات تلقائية ومدفوعات شفافة ودعم متجاوب.' },
      ],
    },
    goldStandard: {
      label: 'المعيار الذهبي',
      h1: 'لماذا يختار القادة',
      h2: 'وايت لاين',
      sub: 'خدمة مبنية على أساس راسخ من الفخامة والسلامة والخصوصية، مصممة لتلبية المعايير الصارمة لنخبة المملكة.',
      cards: [
        { title: 'محترفون من النخبة', desc: 'سائقون مدققون بصرامة ومدربون على آداب التعامل التنفيذي والسرية التامة.' },
        { title: 'مركبات في قمة الأناقة', desc: 'سيارات فاخرة مصانة بدقة، مُهندَسة لتوفير أقصى درجات الراحة والأمان.' },
        { title: 'خصوصية تامة', desc: 'أنظمة تشغيل آمنة تضمن السرية المطلقة للشخصيات الرفيعة والقادة.' },
      ],
    },
  },

  servicesPage: {
    hero: {
      h1a: 'كل رحلة',
      h1b: 'تستحق طريقة أفضل.',
      sub: 'من لحظة وصولك حتى لحظة وصولك إلى وجهتك، تُقدم وايت لاين خدمات نقل فاخرة بخصوصية ودقة وتجربة خدمة مصممة حول احتياجاتك.',
      btn1: 'استكشف خدماتنا',
      btn2: 'احجز رحلتك',
    },
    list: {
      label: 'خدماتنا',
      h1: 'وجهة واحدة أو أكثر.',
      h2: 'لدينا الرحلة المناسبة.',
      sub: 'تُقدم وايت لاين خدمات نقل فاخرة للذين يقدّرون الراحة والموثوقية والخدمة المتميزة. من نقل المطار إلى رحلات الأعمال، كل رحلة مصممة لتجعل حياتك أكثر سلاسة.',
      explore: 'استكشف الخدمة',
      items: [
        { label: 'رحلة أحادية',    h1a: 'نقل ',           h1b: 'من نقطة لأخرى',   h1c: '',          h2a: 'داخل المدينة',         h2b: '',                     body: 'استمتع بتنقل سلس من نقطة لأخرى داخل المدينة، مصمم بعناية للكفاءة والأناقة. سواء كنت متجهاً إلى اجتماع مؤسسي أو موعد خاص أو التزام عاجل عبر المدينة، تضمن لك خدمتنا المباشرة الوصول في الوقت المحدد وبكل هدوء.' },
        { label: 'سائق بالساعة',   h1a: 'سائق خاص',       h1b: '',                 h1c: '',          h2a: '',                      h2b: 'عند الطلب بالساعة',    body: 'استمتع بأقصى درجات المرونة مع سائق خاص تحت تصرفك طوال اليوم. مثالية للمواعيد المتغيرة وعدة محطات متتالية، توفر لك هذه الخدمة حرية التنقل بالوتيرة التي تناسبك بينما تظل مركبتك وسائقك في انتظارك.' },
        { label: 'بين المدن',      h1a: '',               h1b: 'سفر بعيد المدى',  h1c: ' بين المدن', h2a: 'تنفيذي فاخر',          h2b: '',                     body: 'اقطع المسافات بين المدن الكبرى في راحة وهدوء تامَّين. توفر خدمة السفر بين المدن لدينا بيئة خاصة سلسة داخل مركبة فاخرة، تتيح لك الاسترخاء والتحضير للقاءاتك القادمة أو إجراء أعمالك السرية دون انقطاع.' },
        { label: 'خدمة يوم كامل', h1a: 'نقل احترافي',    h1b: '',                 h1c: '',          h2a: '',                      h2b: 'طوال اليوم',           body: 'احجز شريكاً متخصصاً في النقل لجدولك اليومي الكامل. مثالي للاجتماعات المؤسسية المتلاحقة واستضافة كبار الشخصيات والفعاليات متعددة المواقع، يضمن توافر المركبة باستمرار والتنسيق السلس والخصوصية التامة من أول تحرك صباحاً حتى آخر الليل.' },
        { label: 'نقل المطار',     h1a: 'نقل ',           h1b: 'سلس من المطار',   h1c: '',          h2a: 'وتتبع الرحلات',         h2b: '',                     body: 'ابدأ رحلتك الدولية أو اختتمها بتمام الطمأنينة عبر خدمة نقل المطار المتميزة لدينا. مع تتبع الرحلات لحظياً وتعديلات استباقية عند التأخير ومساعدة احترافية بالأمتعة، يضمن سائقونا انتقالاً سلساً بين الصالة ووجهتك النهائية.' },
      ],
    },
  },

  footer: {
    tagline: 'خدمات سائق راقية مبنية على الراحة والموثوقية والخصوصية.',
    columns: {
      company:   { title: 'الشركة',   links: ['سياسة الخصوصية', 'الشركاء', 'من نحن'] },
      services:  { title: 'الخدمات', links: ['رحلة أحادية', 'سائق بالساعة', 'بين المدن', 'خدمة اليوم', 'نقل المطار'] },
      resources: { title: 'أسطولنا', links: ['الدرجة الأولى', 'درجة الأعمال', 'إس يو في', 'سيدان', 'فان', 'كوستر وباص'] },
      support:   { title: 'الدعم',   links: ['تواصل معنا', 'خدمة العملاء', 'التقييمات', 'المنتسبون', 'سياسة الإلغاء'] },
    },
  },

  customerSupportPage: {
    hero: {
      h1a: 'نحن هنا',
      h1b: 'عندما تحتاجنا.',
      sub: 'مساعدة احترافية لجميع احتياجات دعم عملائك. متاح على مدار الساعة للتعامل مع كل تذكرة وتفاصيل الرحلة وأي تأخير غير متوقع.',
      btn: 'احصل على الدعم',
    },
    services: {
      label: 'قصص العملاء',
      h1: 'أكثر من مجرد رحلة.',
      h2a: 'تجربة ',
      h2b: 'أفضل.',
      sub: 'كل رحلة مختلفة. ما يبقى ثابتاً هو التجربة التي يحصل عليها ركابنا — سائقون محترفون وخدمة موثوقة ومركبات فاخرة وراحة البال بأن كل شيء في أيدٍ أمينة.',
      cards: [
        { title: 'دعم هاتفي ٢٤/٧',    desc: 'ناطقون أصليون مستعدون لإدارة حجم المكالمات العالي والمكالمات الطارئة وتتبع الرحلات على مدار الساعة.' },
        { title: 'المساعدة في الحجز', desc: 'استيعاب التغييرات على الحجوزات الجارية ومطابقة المستخدمين مع الخيارات بشكل مباشر وسلس.' },
        { title: 'دعم الإلغاء',        desc: 'معالجة سلسة لطلبات الإلغاء الواردة مع التواصل الفوري للحفاظ على تحديث السائقين.' },
        { title: 'مشاكل الرحلة',      desc: 'حل المواقف الطارئة على الطريق ومطابقة البدائل بسرعة للحفاظ على أداء المرسلين.' },
      ],
    },
    activeTrip: {
      label: 'دعم الرحلات الجارية',
      h1a: 'على الطريق؟',
      h1b: 'نحن معك.',
      sub: 'سواء في مطابقة فتحة متاحة أو البحث عن طرق بديلة أو التحدث مع السائقين النشطين، يبقى نظامنا متزامناً.',
      btn: 'تواصل مع الإرسال',
      cardTitle: 'إنشاء رحلة',
      cardMap: 'الخريطة الحية',
      fieldFrom: 'من',
      fieldTo: 'إلى',
      fieldPassengers: 'الركاب',
      checkRates: 'تحقق من الأسعار',
      bookSupport: 'احجز الدعم',
    },
  },

  testimonialsPage: {
    hero: {
      h1a: 'عملاؤنا',
      h1b: 'يقولون الأفضل.',
      sub: 'من استقبال المطار إلى رحلات المديرين التنفيذيين، تحظى وايت لاين بثقة الركاب والشركات ممن يتوقعون الأفضل في كل ميل.',
      btn: 'اقرأ آراء العملاء',
    },
    stories: {
      label: 'قصص العملاء',
      h1: 'أكثر من مجرد رحلة.',
      h2a: 'تجربة ',
      h2b: 'أفضل.',
      sub: 'كل رحلة مختلفة. ما يبقى ثابتاً هو التجربة التي يحصل عليها ركابنا — سائقون محترفون وخدمة موثوقة ومركبات فاخرة وراحة البال بأن كل شيء في أيدٍ أمينة.',
      quote: '"جعلت وايت لاين كل جزء من رحلتي يبدو سلساً. كان السائق دقيقاً في المواعيد ومتحفظاً واحترافياً بشكل لا يُصدق."',
      reviewerName: 'Riad Husseini',
      reviewerRole: 'رائد أعمال',
    },
    voices: {
      label: 'أصوات التميز',
      h1: 'موثوق من قِبل من يطلبون',
      h2: 'التميز المطلق',
      sub: 'اسمع مباشرةً من قادة الشركات والشخصيات الرفيعة والمسافرين المتميزين الذين يعتمدون على وايت لاين لرفع مستوى رحلاتهم وحماية خصوصيتهم وتقديم فخامة لا تُضاهى في كل ميل.',
    },
  },

  contactPage: {
    hero: {
      h1a: 'نحن هنا لجعل',
      h1b: 'رحلتك سلسة.',
      sub: 'سواء احتجت إلى مساعدة في الحجز، أو ترغب في ترتيب نقل مؤسسي، أو لديك أسئلة، فريقنا جاهز للمساعدة.',
    },
    info: {
      h1: 'دعنا نتحدث عن',
      h2: 'رحلتك القادمة.',
      body: 'فريقنا متاح للمساعدة في الحجوزات وخدمات الشوفير والحسابات المؤسسية وأسئلة الأسطول ودعم العملاء.',
      cards: [
        { title: 'اتصل بنا',    value: '+1 (555) 000-0000',     sub: 'للحجوزات والمساعدة الفورية' },
        { title: 'راسلنا',      value: 'support@whitelane.com', sub: 'نسعى للرد بأسرع وقت ممكن' },
        { title: 'الدعم متاح', value: 'دعم العملاء ٢٤/٧',       sub: 'للرحلات الجارية والاستفسارات العاجلة' },
      ],
    },
    form: {
      title: 'أرسل لنا رسالة',
      sub: 'أخبرنا بما تحتاجه وسيتواصل معك أحد أعضاء فريقنا.',
      firstName: 'الاسم الأول',  firstNamePh: 'الاسم الأول',
      lastName: 'اسم العائلة',   lastNamePh: 'اسم العائلة',
      email: 'البريد الإلكتروني', emailPh: 'your@email.com',
      phone: 'رقم الجوال',        phonePh: '+966 5X XXX XXXX',
      helpLabel: 'كيف يمكننا مساعدتك؟', helpPh: 'اختر خياراً',
      helpOptions: ['حجز رحلة', 'استفسار عن حساب مؤسسي', 'معلومات الأسطول', 'دعم العملاء', 'أخرى'],
      dateLabel: 'التاريخ المفضل',
      passengersLabel: 'الركاب',
      passenger: 'راكب', passengers: 'ركاب',
      messageLabel: 'رسالتك', messagePh: 'أخبرنا عن طلبك...',
      disclaimer: 'بإرسال هذا النموذج فإنك توافق على',
      privacyLink: 'سياسة الخصوصية', and: 'و', termsLink: 'شروط الخدمة',
      sendBtn: 'إرسال الرسالة',
      sentTitle: 'تم إرسال رسالتك!',
      sentBody: 'شكراً لتواصلك معنا. سيتواصل معك أحد أعضاء فريقنا قريباً.',
      errFirstName: 'الاسم الأول مطلوب',
      errLastName: 'اسم العائلة مطلوب',
      errEmail: 'البريد الإلكتروني مطلوب',
      errEmailInvalid: 'أدخل بريداً إلكترونياً صحيحاً',
      errHelpTopic: 'يرجى اختيار خيار',
      errMessage: 'الرسالة مطلوبة',
    },
  },

  b2bLogin: {
    portal: 'بوابة الشركات B2B',
    tagline: 'دقة في الحركة',
    sub: 'مركز القيادة لأرقى عمليات لوجستيات الشوفير في العالم.',
    copyright: '© 2026 خدمات الشوفير الراقية',
    privacy: 'سياسة الخصوصية',
    terms: 'الشروط والأحكام',
    loginTab: 'تسجيل الدخول',
    signupTab: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    emailPlaceholder: 'أدخل بريدك الإلكتروني',
    password: 'كلمة المرور',
    passwordPlaceholder: 'أدخل كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    rememberMe: 'تذكرني',
    loginBtn: 'الدخول إلى لوحة التحكم',
  },

  fleetPage: {
    hero: {
      h1a: '',
      h1b: 'مركبة',
      h1c: ' لكل',
      h2: 'مناسبة',
      sub: 'دعم احترافي لجميع احتياجات عملائك. متاح على مدار الساعة للتعامل مع كل تذكرة وتفاصيل الرحلة وأي تأخير غير متوقع.',
      btn: 'استعرض أسطولنا',
    },
    cars: {
      label: 'أسطول وايت لاين',
      h1: 'أسطول نخبوي مصمم لأقصى',
      h2a: 'درجات ',
      h2b: 'الراحة والتميز',
      sub: 'مجموعتنا المُصانة بعناية من المركبات الفاخرة تمثل قمة الرفاهية في عالم السيارات. كل طراز في أسطولنا يخضع لفحوصات دقيقة متعددة النقاط وتجهيز احترافي.',
      luggages: 'حقيبة',
      persons: 'راكب',
      filters: ['الكل', 'الدرجة الأولى', 'درجة الأعمال', 'إس يو في', 'سيدان', 'فان', 'كوستر وباص'],
      desc: 'فسيحة وأنيقة ومتعددة الاستخدامات',
    },
  },

  airportTransferPage: {
    hero: {
      h1a: 'نقل',
      h1b: 'سلس من المطار',
      sub: 'من لحظة هبوط طائرتك حتى وجهتك النهائية — تضمن وايت لاين تجربة مطار خالية من التوتر تماماً مع سائقين محترفين وتتبع لحظي للرحلات.',
      btn1: 'احجز نقلاً',
      btn2: 'استعرض الأسطول',
    },
    overview: {
      label: 'نظرة عامة على الخدمة',
      h1a: 'الارتقاء بتجربة',
      h1b: 'نقل المطار',
      h2: 'عبر دقة لوجستية لا مثيل لها',
      body: 'لا ينبغي أن يكون بدء رحلة دولية أو إنهاؤها مصدراً للتوتر. صُممت خدمة مطارنا بعناية لإزالة كل غموض من تجربة السفر الجوي، وتوفير انتقال سلس بين الصالة ووجهتك النهائية. من خلال المراقبة اللحظية للرحلات والتعديلات الاستباقية عند التأخير وبروتوكولات الاستقبال الشخصية داخل الصالة، نضمن أن يكون وصولك أو مغادرتك مصحوباً بالدقة المطلقة والأناقة العفوية.',
    },
    steps: {
      label: 'دقة لوجستية',
      h1a: 'رحلة سلسة',
      h1b: 'من أربع خطوات',
      h2: 'مصممة لراحة البال',
      sub: 'كل رحلة مختلفة. ما يبقى ثابتاً هو التجربة التي يحصل عليها ركابنا — سائقون محترفون وخدمة موثوقة ومركبات فاخرة وراحة البال بأن كل شيء في أيدٍ أمينة.',
      items: [
        { num: '٠١', title: 'حجز سلس', desc: 'احجز مركبتك بسهولة عبر منصتنا الذكية أو تطبيقنا الرقمي بمجرد إدخال رقم رحلتك وجدولك الزمني وتفاصيل الوجهة لتأكيد حجزك فوراً.' },
        { num: '٠٢', title: 'متابعة استباقية', desc: 'يتابع نظام الإرسال لدينا حالة رحلتك مباشرة، ويضبط تلقائياً وقت وصول سائقك ليستوعب الهبوط المبكر أو التأخيرات غير المتوقعة دون أي إزعاج.' },
        { num: '٠٣', title: 'استقبال في الصالة', desc: 'انزل من الطائرة لتجد سائقاً محترفاً ومدرباً يستقبلك داخل صالة الوصول حاملاً لافتة باسمك ومستعداً لمساعدتك بأمتعتك.' },
        { num: '٠٤', title: 'رحلة هادئة', desc: 'استرخِ أو تابع عملك في مقصورة فاخرة خاصة ومُكيَّفة بينما يسلك سائقك المسار الأمثل مباشرةً إلى فندقك أو مكتبك أو مقر إقامتك.' },
      ],
    },
    features: {
      label: 'الميزات الرئيسية',
      h1a: 'سائقك ',
      h1b: 'الخاص',
      h1c: '،',
      h2: 'في متناول يدك.',
      sub: 'يعمل تطبيق وايت لاين كمرافق شخصي داخل المطار. حالة السائق اللحظية وملاحظات تنسيق الصالة والفواتير الفورية — كلها نشطة دائماً.',
      items: [
        { title: 'فترات انتظار مريحة', desc: 'استمتع بوقت انتظار مجاني بعد الهبوط حتى لا تشعر بضغط الوقت عند المرور بالجمارك وانتزاع الأمتعة.' },
        { title: 'متابعة الرحلة مباشرة', desc: 'يتيح التتبع المستمر لفريقنا ضبط وقت الاستقبال تلقائياً حال الهبوط المبكر أو تأخر الرحلة.' },
        { title: 'استقبال احترافي وترحيب', desc: 'يستقبلك سائقك المحترف داخل صالة الوصول بلافتة واضحة ويقدم المساعدة الكاملة بالأمتعة.' },
        { title: 'مركبات فاخرة مخصصة', desc: 'اختر من سيارات السيدان الراقية أو SUV الفسيحة المناسبة للمسافرين المنفردين أو الوفود المؤسسية الكبيرة.' },
      ],
    },
    faq: {
      label: 'إجابات على الأسئلة الشائعة',
      h1: 'أسئلة قبل',
      h2: 'الحجز؟',
      sub: 'نعمل بشفافية تامة. إن لم تجد سؤالك هنا، تواصل مع فريق الدعم المتاح على مدار الساعة.',
      items: [
        {
          q: 'كيف أتابع وصول سائقي؟',
          a: 'عبر تطبيق وايت لاين، تحصل على تتبع GPS مباشر لسائقك منذ لحظة إرساله. ستتلقى أيضاً إشعارات استباقية مع تقديرات وصول دقيقة وفورية.',
        },
        {
          q: 'هل يمكنني تغيير وجهة الإنزال أثناء الرحلة؟',
          a: 'نعم. فقط أخبر سائقك أو تواصل مع فريق الدعم خلال الرحلة. يتم استيعاب التغييرات بسلاسة — وأي تعديل على الأجرة يُبلَّغ به بشفافية قبل التطبيق.',
        },
        {
          q: 'ماذا لو تأخرت رحلتي كثيراً؟',
          a: 'نظامنا يتابع رحلتك لحظياً. يُعدَّل وقت وصول سائقك تلقائياً ليتوافق مع موعد هبوطك الجديد دون أي رسوم إضافية — ودون الحاجة لأي اتصال من طرفك.',
        },
        {
          q: 'كيف تُحتسب رسوم العبور ومواقف السيارات؟',
          a: 'جميع رسوم العبور ومواقف المطار مشمولة في السعر المعروض مسبقاً. لا توجد رسوم مفاجئة عند الوصول — ما تراه عند الحجز هو ما تدفعه فعلاً.',
        },
      ],
    },
  },

  hourlyBookingPage: {
    hero: {
      h1a: 'سائق خاص مرن بالساعة',
      h1b: 'خدمة مصممة لك',
      sub: 'تنقّل عبر جدولك المزدحم بحرية واتزان تامّين. تضع خدمة السائق بالساعة الفاخرة لدينا مركبة خاصة وسائقاً محترفاً تحت تصرفك بالكامل، لتضمن تنقلاً سلساً دون انتظار وخصوصية كاملة في كل ميل من رحلتك.',
      btn1: 'احجز بالساعة',
      btn2: 'استكشف الخدمة',
    },
    overview: {
      label: 'نظرة عامة على الخدمة',
      h1a: 'الارتقاء بالتنقل عند الطلب',
      h1b: '',
      h2: 'بمرونة لا مثيل لها',
      body: 'لا ينبغي أن تقيّد خطط النقل الجامدة تنقلك خلال جدول حافل. صُممت خدمة السائق بالساعة لدينا بعناية لتمنحك مرونة مطلقة، مع إبقاء مركبة فاخرة خاصة وسائق محترف تحت تصرفك بالكامل. سواء كنت تدير اجتماعات عمل متتالية أو زيارات خاصة للمواقع أو برنامجاً متغيراً داخل المدينة، فإننا نوفر بيئة سلسة ومتواصلة تحمي وقتك بعناية وتضمن إدارة كل مسار باحترافية فائقة.',
    },
    steps: {
      label: 'دقة لوجستية',
      h1a: 'رحلة سلسة',
      h1b: 'من أربع خطوات',
      h2: 'مصممة لراحة البال',
      sub: 'كل رحلة مختلفة. ما يبقى ثابتاً هو التجربة التي يحصل عليها ركابنا — سائقون محترفون وخدمة موثوقة ومركبات فاخرة وراحة البال بأن كل شيء في أيدٍ أمينة.',
      items: [
        { num: '٠١', title: 'حجز سلس', desc: 'احجز مركبتك بسهولة عبر منصتنا الذكية أو تطبيقنا الرقمي بمجرد إدخال رقم رحلتك وجدولك الزمني وتفاصيل الوجهة لتأكيد حجزك فوراً.' },
        { num: '٠٢', title: 'متابعة استباقية', desc: 'يتابع نظام الإرسال لدينا حالة رحلتك مباشرة، ويضبط تلقائياً وقت وصول سائقك ليستوعب الهبوط المبكر أو التأخيرات غير المتوقعة دون أي إزعاج.' },
        { num: '٠٣', title: 'استقبال في الصالة', desc: 'انزل من الطائرة لتجد سائقاً محترفاً ومدرباً يستقبلك داخل صالة الوصول حاملاً لافتة باسمك ومستعداً لمساعدتك بأمتعتك.' },
        { num: '٠٤', title: 'رحلة هادئة', desc: 'استرخِ أو تابع عملك في مقصورة فاخرة خاصة ومُكيَّفة بينما يسلك سائقك المسار الأمثل مباشرةً إلى فندقك أو مكتبك أو مقر إقامتك.' },
      ],
    },
    features: {
      label: 'الميزات الرئيسية',
      h1a: 'سائقك ',
      h1b: 'الخاص',
      h1c: '،',
      h2: 'في متناول يدك.',
      sub: 'يعمل تطبيق وايت لاين كمرافق شخصي لك. حالة السائق اللحظية وملاحظات التنسيق والفواتير الفورية — كلها نشطة دائماً.',
      items: [
        { title: 'فترات وصول مريحة', desc: 'استمتع بوقت انتظار مجاني حتى لا تشعر بالعجلة عند بدء رحلتك أو الانتقال بين محطات يومك.' },
        { title: 'مرونة عند الطلب', desc: 'تمتع بحرية كاملة لتحديث برنامجك وإضافة محطات مفاجئة أو تعديل وجهتك.' },
        { title: 'حضور مخصص', desc: 'غادر اجتماعاتك أو مواعيدك لتجد سائقك المحترف ومركبتك النظيفة في انتظارك.' },
        { title: 'ختام سلس', desc: 'اختتم يومك المثمر برحلة هادئة إلى مقر إقامتك أو فندقك، مدعومة بخدمة متقنة.' },
      ],
    },
    faq: {
      label: 'إجابات على الأسئلة الشائعة',
      h1: 'أسئلة قبل',
      h2: 'الحجز؟',
      sub: 'نعمل بشفافية تامة. إن لم تجد سؤالك هنا، تواصل مع فريق الدعم المتاح على مدار الساعة.',
      items: [
        {
          q: 'كيف أتابع وصول سائقي؟',
          a: 'عبر تطبيق وايت لاين، تحصل على تتبع GPS مباشر لسائقك منذ لحظة إرساله. ستتلقى أيضاً إشعارات استباقية مع تقديرات وصول دقيقة وفورية.',
        },
        {
          q: 'هل يمكنني تغيير وجهة الإنزال أثناء الرحلة؟',
          a: 'نعم. فقط أخبر سائقك أو تواصل مع فريق الدعم خلال الرحلة. يتم استيعاب التغييرات بسلاسة — وأي تعديل على الأجرة يُبلَّغ به بشفافية قبل التطبيق.',
        },
        {
          q: 'ماذا لو تأخرت رحلتي كثيراً؟',
          a: 'نظامنا يتابع رحلتك لحظياً. يُعدَّل وقت وصول سائقك تلقائياً ليتوافق مع موعد هبوطك الجديد دون أي رسوم إضافية — ودون الحاجة لأي اتصال من طرفك.',
        },
        {
          q: 'كيف تُحتسب رسوم العبور ومواقف السيارات؟',
          a: 'جميع رسوم العبور ومواقف المطار مشمولة في السعر المعروض مسبقاً. لا توجد رسوم مفاجئة عند الوصول — ما تراه عند الحجز هو ما تدفعه فعلاً.',
        },
      ],
    },
  },

  cityToCityPage: {
    hero: {
      h1a: 'رحلات سلسة لمسافات طويلة',
      h1b: 'بين المدن',
      sub: 'اختصر المسافة بين المدن الكبرى بعيداً عن تعقيدات السفر التقليدي. توفر خدمتنا الفاخرة بين المدن بيئة راقية وخاصة داخل مركبة فخمة، لتتمكن من الاسترخاء أو الاستعداد لمواعيدك القادمة أو إدارة أعمالك السرية دون انقطاع طوال الرحلة.',
      btn1: 'احجز رحلة بين المدن',
      btn2: 'استكشف الخدمة',
    },
    overview: {
      label: 'نظرة عامة على الخدمة',
      h1a: 'الارتقاء',
      h1b: 'بالسفر بين المدن',
      h2: 'عبر تنقل سلس',
      body: 'ينبغي أن يكون السفر بين المدن امتداداً لمساحة عملك المنتجة أو ملاذاً هادئاً، لا رحلة مرهقة عليك تحملها. صُممت خدمة النقل بين المدن لدينا بعناية للتخلص من إرهاق القيادة لمسافات طويلة وطوابير أمن المطارات وازدحام محطات النقل. ومن خلال توفير مركبة راقية وسائق خبير بالمسافات الطويلة ومقصورة خاصة وهادئة بالكامل، نحوّل رحلاتك الإقليمية إلى تجربة مريحة وسلسة من نقطة الانطلاق حتى وجهتك النهائية.',
    },
    steps: {
      label: 'دقة لوجستية',
      h1a: 'رحلة سلسة',
      h1b: 'من أربع خطوات',
      h2: 'مصممة لراحة البال',
      sub: 'كل رحلة مختلفة. ما يبقى ثابتاً هو التجربة التي يحصل عليها ركابنا — سائقون محترفون وخدمة موثوقة ومركبات فاخرة وراحة البال بأن كل شيء في أيدٍ أمينة.',
      items: [
        { num: '٠١', title: 'حجز سلس', desc: 'احجز مركبتك بسهولة عبر منصتنا الذكية أو تطبيقنا الرقمي بمجرد إدخال رقم رحلتك وجدولك الزمني وتفاصيل الوجهة لتأكيد حجزك فوراً.' },
        { num: '٠٢', title: 'متابعة استباقية', desc: 'يتابع نظام الإرسال لدينا حالة رحلتك مباشرة، ويضبط تلقائياً وقت وصول سائقك ليستوعب الهبوط المبكر أو التأخيرات غير المتوقعة دون أي إزعاج.' },
        { num: '٠٣', title: 'استقبال في الصالة', desc: 'انزل من الطائرة لتجد سائقاً محترفاً ومدرباً يستقبلك داخل صالة الوصول حاملاً لافتة باسمك ومستعداً لمساعدتك بأمتعتك.' },
        { num: '٠٤', title: 'رحلة هادئة', desc: 'استرخِ أو تابع عملك في مقصورة فاخرة خاصة ومُكيَّفة بينما يسلك سائقك المسار الأمثل مباشرةً إلى فندقك أو مكتبك أو مقر إقامتك.' },
      ],
    },
    features: {
      label: 'الميزات الرئيسية',
      h1a: 'رحلتك ',
      h1b: 'لمسافات طويلة',
      h1c: '،',
      h2: 'مصممة للراحة والتركيز.',
      sub: 'استمتع بسفر إقليمي مبني على وسائل راحة فاخرة وأمان وخصوصية تامة.',
      items: [
        { title: 'سفر مباشر بين المدن', desc: 'تجاوز صالات المطارات ومحطات القطار مع خدمة مباشرة من الباب إلى الباب، من نقطة انطلاقك الدقيقة حتى وجهتك.' },
        { title: 'خبراء المسافات الطويلة', desc: 'سافر بأمان مع سائقين محترفين خضعوا لفحوصات دقيقة ويتمتعون بخبرة في الطرق الإقليمية السريعة.' },
        { title: 'مقصورة هادئة ومتصلة', desc: 'استفد من بيئة هادئة ومكيّفة دون انقطاع لإجراء المكالمات أو مراجعة المستندات أو الاسترخاء بسلام.' },
        { title: 'مركبات فاخرة للرحلات الطويلة', desc: 'اختر من أسطولنا الراقي من سيارات السيدان الرحبة ومركبات SUV الفاخرة المصممة لتقديم أعلى مستويات الراحة.' },
      ],
    },
    faq: {
      label: 'إجابات على الأسئلة الشائعة',
      h1: 'أسئلة قبل',
      h2: 'الحجز؟',
      sub: 'نعمل بشفافية تامة. إن لم تجد سؤالك هنا، تواصل مع فريق الدعم المتاح على مدار الساعة.',
      items: [
        {
          q: 'كيف أتابع وصول سائقي؟',
          a: 'عبر تطبيق وايت لاين، تحصل على تتبع GPS مباشر لسائقك منذ لحظة إرساله. ستتلقى أيضاً إشعارات استباقية مع تقديرات وصول دقيقة وفورية.',
        },
        {
          q: 'هل يمكنني تغيير وجهة الإنزال أثناء الرحلة؟',
          a: 'نعم. فقط أخبر سائقك أو تواصل مع فريق الدعم خلال الرحلة. يتم استيعاب التغييرات بسلاسة — وأي تعديل على الأجرة يُبلَّغ به بشفافية قبل التطبيق.',
        },
        {
          q: 'ماذا لو تأخرت رحلتي كثيراً؟',
          a: 'نظامنا يتابع رحلتك لحظياً. يُعدَّل وقت وصول سائقك تلقائياً ليتوافق مع موعد هبوطك الجديد دون أي رسوم إضافية — ودون الحاجة لأي اتصال من طرفك.',
        },
        {
          q: 'كيف تُحتسب رسوم العبور ومواقف السيارات؟',
          a: 'جميع رسوم العبور ومواقف المطار مشمولة في السعر المعروض مسبقاً. لا توجد رسوم مفاجئة عند الوصول — ما تراه عند الحجز هو ما تدفعه فعلاً.',
        },
      ],
    },
  },

  dayServicePage: {
    hero: {
      h1a: 'خدمة مخصصة ليوم كامل',
      h1b: 'نقل احترافي',
      sub: 'احصل على شريك نقل احترافي مخصص لجدول يومك بالكامل. مثالية لاجتماعات الشركات المتتالية واستضافة كبار الشخصيات وبرامج الفعاليات المعقدة متعددة المواقع، إذ تضمن خدمتنا الشاملة لليوم الكامل توفر المركبة باستمرار وتنسيقاً متقناً.',
      btn1: 'احجز خدمة اليوم الكامل',
      btn2: 'استكشف الخدمة',
    },
    overview: {
      label: 'نظرة عامة على الخدمة',
      h1a: 'شراكة',
      h1b: 'شاملة ليوم كامل',
      h2: 'مصممة وفق جدولك',
      body: 'تتطلب إدارة الفعاليات المؤسسية المهمة أو جولات الأعمال المكثفة أو استضافة كبار الشخصيات شريك نقل يوفر موثوقية ومرونة كاملتين. صُممت خدمة اليوم الكامل لدينا بعناية لتوفير مركبة فاخرة وسائق مخصصين طوال مدة يوم ممتد. ومن خلال إلغاء الحاجة إلى الحجوزات المتكررة وضمان التوفر المستمر، نوفر بيئة مستقرة وخاصة تتكيف بسلاسة مع جدولك المتغير، لتتمكن من التركيز كلياً على أهدافك بينما تُدار كل التفاصيل اللوجستية بدقة.',
    },
    steps: {
      label: 'دقة لوجستية',
      h1a: 'رحلة سلسة',
      h1b: 'من أربع خطوات',
      h2: 'مصممة لراحة البال',
      sub: 'كل رحلة مختلفة. ما يبقى ثابتاً هو التجربة التي يحصل عليها ركابنا — سائقون محترفون وخدمة موثوقة ومركبات فاخرة وراحة البال بأن كل شيء في أيدٍ أمينة.',
      items: [
        { num: '٠١', title: 'حجز سلس', desc: 'احجز مركبتك بسهولة عبر منصتنا الذكية أو تطبيقنا الرقمي بمجرد إدخال رقم رحلتك وجدولك الزمني وتفاصيل الوجهة لتأكيد حجزك فوراً.' },
        { num: '٠٢', title: 'متابعة استباقية', desc: 'يتابع نظام الإرسال لدينا حالة رحلتك مباشرة، ويضبط تلقائياً وقت وصول سائقك ليستوعب الهبوط المبكر أو التأخيرات غير المتوقعة دون أي إزعاج.' },
        { num: '٠٣', title: 'استقبال في الصالة', desc: 'انزل من الطائرة لتجد سائقاً محترفاً ومدرباً يستقبلك داخل صالة الوصول حاملاً لافتة باسمك ومستعداً لمساعدتك بأمتعتك.' },
        { num: '٠٤', title: 'رحلة هادئة', desc: 'استرخِ أو تابع عملك في مقصورة فاخرة خاصة ومُكيَّفة بينما يسلك سائقك المسار الأمثل مباشرةً إلى فندقك أو مكتبك أو مقر إقامتك.' },
      ],
    },
    features: {
      label: 'الميزات الرئيسية',
      h1a: 'مزايا فاخرة ',
      h1b: 'ليوم كامل',
      h1c: '',
      h2: 'مصممة للموثوقية',
      sub: 'استمتع بنقل فاخر مستمر دون انقطاع، مدعوم بمعايير خدمة راقية صُممت للجداول المزدحمة.',
      items: [
        { title: 'تخصيص مستمر للمركبة', desc: 'استمتع بمركبة فاخرة وسائق مخصصين تحت تصرفك بالكامل من الصباح حتى المساء.' },
        { title: 'تنسيق متعدد المحطات', desc: 'أدر اجتماعات الشركات المتتالية وتغييرات المواقع وبرامج استضافة كبار الشخصيات بسهولة مع مسارات سلسة.' },
        { title: 'معايير خصوصية رفيعة', desc: 'اعمل بأمان داخل بيئة خاصة وسرية يدعمها سائقون محترفون خضعوا لفحوصات خلفية دقيقة.' },
        { title: 'مركبات تنفيذية للوفود', desc: 'اختر من سيارات السيدان الراقية والمركبات الفاخرة الرحبة المهيأة لاستيعاب المسؤولين التنفيذيين.' },
      ],
    },
    faq: {
      label: 'إجابات على الأسئلة الشائعة',
      h1: 'أسئلة قبل',
      h2: 'الحجز؟',
      sub: 'نعمل بشفافية تامة. إن لم تجد سؤالك هنا، تواصل مع فريق الدعم المتاح على مدار الساعة.',
      items: [
        {
          q: 'كيف أتابع وصول سائقي؟',
          a: 'عبر تطبيق وايت لاين، تحصل على تتبع GPS مباشر لسائقك منذ لحظة إرساله. ستتلقى أيضاً إشعارات استباقية مع تقديرات وصول دقيقة وفورية.',
        },
        {
          q: 'هل يمكنني تغيير وجهة الإنزال أثناء الرحلة؟',
          a: 'نعم. فقط أخبر سائقك أو تواصل مع فريق الدعم خلال الرحلة. يتم استيعاب التغييرات بسلاسة — وأي تعديل على الأجرة يُبلَّغ به بشفافية قبل التطبيق.',
        },
        {
          q: 'ماذا لو تأخرت رحلتي كثيراً؟',
          a: 'نظامنا يتابع رحلتك لحظياً. يُعدَّل وقت وصول سائقك تلقائياً ليتوافق مع موعد هبوطك الجديد دون أي رسوم إضافية — ودون الحاجة لأي اتصال من طرفك.',
        },
        {
          q: 'كيف تُحتسب رسوم العبور ومواقف السيارات؟',
          a: 'جميع رسوم العبور ومواقف المطار مشمولة في السعر المعروض مسبقاً. لا توجد رسوم مفاجئة عند الوصول — ما تراه عند الحجز هو ما تدفعه فعلاً.',
        },
      ],
    },
  },

  oneWayRidePage: {
    hero: {
      h1a: 'نقل مباشر من نقطة إلى نقطة',
      h1b: 'داخل المدينة',
      sub: 'استمتع بتنقل حضري سلس من نقطة إلى نقطة، مصمم بعناية للكفاءة والأناقة. سواء كنت متجهاً إلى اجتماع مؤسسي مهم أو موعد خاص أو مناسبة مسائية، تبقى رحلتك مباشرة وخاصة ومنضبطة التوقيت.',
      btn1: 'احجز رحلة باتجاه واحد',
      btn2: 'استكشف الخدمة',
    },
    overview: {
      label: 'نظرة عامة على الخدمة',
      h1a: 'الارتقاء بالنقل المباشر عبر',
      h1b: 'التزام كامل بالمواعيد',
      h2: '',
      body: 'لا ينبغي أن يصبح التنقل داخل المدينة إلى وجهة واحدة معقداً بسبب ضغط المرور أو تحديات الملاحة. صُممت خدمة الرحلة باتجاه واحد لتوفير نقل تنفيذي مباشر من نقطة إلى نقطة يوصلك إلى وجهتك بكفاءة مطلقة. ومن خلال إزالة عناء القيادة والبحث عن مواقف، نوفر لك مقصورة هادئة ومكيّفة يمكنك فيها الاسترخاء أو مراجعة ملاحظاتك أو الاستعداد ذهنياً لموعدك القادم، لتصل بكامل هدوئك وفي الوقت المحدد.',
    },
    steps: {
      label: 'دقة لوجستية',
      h1a: 'رحلة سلسة',
      h1b: 'من أربع خطوات',
      h2: 'مصممة لراحة البال',
      sub: 'كل رحلة مختلفة. ما يبقى ثابتاً هو التجربة التي يحصل عليها ركابنا — سائقون محترفون وخدمة موثوقة ومركبات فاخرة وراحة البال بأن كل شيء في أيدٍ أمينة.',
      items: [
        { num: '٠١', title: 'حجز سلس', desc: 'احجز مركبتك بسهولة عبر منصتنا الذكية أو تطبيقنا الرقمي بمجرد إدخال رقم رحلتك وجدولك الزمني وتفاصيل الوجهة لتأكيد حجزك فوراً.' },
        { num: '٠٢', title: 'متابعة استباقية', desc: 'يتابع نظام الإرسال لدينا حالة رحلتك مباشرة، ويضبط تلقائياً وقت وصول سائقك ليستوعب الهبوط المبكر أو التأخيرات غير المتوقعة دون أي إزعاج.' },
        { num: '٠٣', title: 'استقبال في الصالة', desc: 'انزل من الطائرة لتجد سائقاً محترفاً ومدرباً يستقبلك داخل صالة الوصول حاملاً لافتة باسمك ومستعداً لمساعدتك بأمتعتك.' },
        { num: '٠٤', title: 'رحلة هادئة', desc: 'استرخِ أو تابع عملك في مقصورة فاخرة خاصة ومُكيَّفة بينما يسلك سائقك المسار الأمثل مباشرةً إلى فندقك أو مكتبك أو مقر إقامتك.' },
      ],
    },
    features: {
      label: 'الميزات الرئيسية',
      h1a: 'رحلة سلسة ',
      h1b: 'من أربع خطوات',
      h1c: '',
      h2: 'من الاستقبال حتى الوجهة',
      sub: 'من حجز رحلتك المباشرة حتى الإنزال في وجهتك النهائية، يضمن مسارنا المبسط شفافية كاملة وإرسالاً سلساً وراحة بال تامة.',
      items: [
        { title: 'نقل حضري دون توقف', desc: 'انتقل مباشرة من نقطة انطلاقك الدقيقة إلى وجهتك دون أي التفافات غير ضرورية أو محطات وسيطة.' },
        { title: 'تنفيذ دقيق للمواعيد', desc: 'صل إلى اجتماعاتك المؤسسية أو مواعيدك الخاصة في الوقت المحدد، بدعم من تخطيط متقدم للمسارات.' },
        { title: 'بيئة هادئة دون إزعاج', desc: 'استفد من وقت الرحلة لإجراء مكالمات سرية أو متابعة البريد الإلكتروني أو الاسترخاء بخصوصية تامة.' },
        { title: 'اختيار من أسطول فاخر', desc: 'اختر من مجموعتنا المتقنة من سيارات السيدان الفاخرة والمركبات التنفيذية المصممة للتنقل الحضري الراقي.' },
      ],
    },
    faq: {
      label: 'إجابات على الأسئلة الشائعة',
      h1: 'أسئلة قبل',
      h2: 'الحجز؟',
      sub: 'نعمل بشفافية تامة. إن لم تجد سؤالك هنا، تواصل مع فريق الدعم المتاح على مدار الساعة.',
      items: [
        {
          q: 'كيف أتابع وصول سائقي؟',
          a: 'عبر تطبيق وايت لاين، تحصل على تتبع GPS مباشر لسائقك منذ لحظة إرساله. ستتلقى أيضاً إشعارات استباقية مع تقديرات وصول دقيقة وفورية.',
        },
        {
          q: 'هل يمكنني تغيير وجهة الإنزال أثناء الرحلة؟',
          a: 'نعم. فقط أخبر سائقك أو تواصل مع فريق الدعم خلال الرحلة. يتم استيعاب التغييرات بسلاسة — وأي تعديل على الأجرة يُبلَّغ به بشفافية قبل التطبيق.',
        },
        {
          q: 'ماذا لو تأخرت رحلتي كثيراً؟',
          a: 'نظامنا يتابع رحلتك لحظياً. يُعدَّل وقت وصول سائقك تلقائياً ليتوافق مع موعد هبوطك الجديد دون أي رسوم إضافية — ودون الحاجة لأي اتصال من طرفك.',
        },
        {
          q: 'كيف تُحتسب رسوم العبور ومواقف السيارات؟',
          a: 'جميع رسوم العبور ومواقف المطار مشمولة في السعر المعروض مسبقاً. لا توجد رسوم مفاجئة عند الوصول — ما تراه عند الحجز هو ما تدفعه فعلاً.',
        },
      ],
    },
  },

  whyChooseUsPage: {
    hero: {
      h1a: '',
      h1b: 'التميز',
      h1c: ' يظهر',
      h2: 'في كل ميل.',
      sub: 'تجمع وايت لاين بين خدمات السائق الفاخرة والتقنية الحديثة لتقديم تجربة نقل استثنائية مبنية على الراحة والموثوقية والخصوصية والخدمة المتميزة.',
      btn1: 'استكشف خدماتنا',
      btn2: 'تعرف على سياراتنا',
    },
    detail: {
      row1: {
        h1: 'لماذا يختار القادة وايت لاين',
        h2: 'للسفر التنفيذي',
        body: 'في عالم متسارع تتغافل فيه وسائل النقل العادية عن دقائق الراحة والأمان، تتميز وايت لاين بمعاملة كل رحلة باعتبارها معياراً للتميز. نفهم أن السفر بالنسبة لقادة الشركات والشخصيات الرفيعة والأفراد البارزين ليس مجرد وصول إلى وجهة، بل هو امتداد جوهري لمكانتك المهنية ومعاييرك الشخصية وراحة بالك.',
      },
      row2: {
        h1: 'مصمم لكل ',
        h2: 'نطاق',
        h3: 'من رحلات الأعمال',
        body: 'الفخامة الحقيقية تُقاس بسلاسة التنفيذ، وفلسفتنا التشغيلية مبنية على التكيف السلس مع متطلباتك الدقيقة مهما تنوعت. سواء احتجت إلى نقل سري واحد لمسؤول تنفيذي أو أسطول كامل لقمة مؤسسية دولية متعددة الأيام، يتولى إطارنا اللوجستي المتقدم إدارة التعقيد من وراء الكواليس ليبقى تركيزك على ما يهم.',
      },
    },
    quote: {
      plain: 'الأمان الحقيقي غير مرئي لكنه دائم الحضور. في وايت لاين نؤمن بأن راحة البال المطلقة لا يمكن تحقيقها',
      bold: 'بتدابير عادية — بل تتطلب دمجاً سلساً لتتبع المركبات المتقدم والفحص الدقيق للكوادر.',
    },
    betterExp: {
      label: 'تجربة أفضل',
      h1: 'الفخامة هي ما ',
      h2: 'تشعر به.',
      body: 'لا نعرّف الفخامة بالإضافات المكلفة. بالنسبة لنا، الفخامة تعني إزالة الاحتكاك والحفاظ على أمانك والتأكد من استعداد سائقك وتوفير المعلومات التي تحتاجها بسلاسة تامة.',
      points: [
        { num: '٠١', title: 'جاهز لرحلتك', desc: 'يتم تعقيم المركبة وتجهيزها بخيارات الشحن وضبط درجة حرارتها قبل صعودك.' },
        { num: '٠٢', title: 'متصل من الحجز حتى الوصول', desc: 'التأكيدات الفورية وبيانات تواصل السائق وحالة المركبة ونسخ الفاتورة — كلها في متناولك دائماً.' },
        { num: '٠٣', title: 'مصمم حولك', desc: 'احفظ مساراتك المفضلة واختر إعداد المقصورة الداخلية وخصص طلبات الدعم بكل سهولة.' },
      ],
    },
    faq: {
      label: 'الأسئلة الشائعة',
      h1: 'قبل أن ',
      h2: 'تتواصل معنا.',
      h3: 'كل ما تحتاج معرفته',
      items: [
        { q: 'كيف يمكنني حجز رحلة مع وايت لاين؟', a: 'الحجز بسيط جداً — عبر تطبيقنا أو الموقع الإلكتروني أو الاتصال بخط الكونسيرج المتاح على مدار الساعة. يمكنك جدولة الرحلات مسبقاً أو طلبها فوراً. يصلك تأكيد فوري بمجرد إتمام الحجز.' },
        { q: 'هل يمكنني التواصل مع الدعم بشأن حجز قائم؟', a: 'بالتأكيد. فريق الدعم متاح على مدار الساعة عبر الدردشة داخل التطبيق أو البريد الإلكتروني أو الهاتف. يمكنك التعديل أو الإلغاء أو الاستفسار عن أي حجز في ثوانٍ. كما تُشارَك بيانات تواصل السائق بمجرد تعيينه.' },
        { q: 'هل تقدمون خدمات نقل مؤسسي؟', a: 'نعم. نوفر حسابات مؤسسية مخصصة مع فوترة شهرية وأولوية الوصول للأسطول وتنسيق متعدد الركاب ومدير حساب مخصص. باقاتنا المؤسسية مصممة لتتوافق مع إيقاع أعمالك.' },
        { q: 'هل يمكنني طلب مركبة بعينها؟', a: 'يمكنك الاختيار من أسطولنا المنتقى — من السيارات التنفيذية إلى الـ SUV الكبيرة — عند الحجز. وإن كان لديك تفضيل متكرر، نحفظه في ملفك لتجد كل رحلة جاهزة وفق ما تحب.' },
        { q: 'هل دعم العملاء متاح على مدار الساعة؟', a: 'نعم. تعمل وايت لاين على مدار الساعة مع وكلاء مباشرين جاهزين للمساعدة. سواء احتجت تغييرات اللحظة الأخيرة أو لديك أسئلة أثناء الرحلة أو تريد التخطيط لرحلة قادمة، يوجد دائماً من يساعدك.' },
        { q: 'هل سائقو وايت لاين مدربون باحترافية؟', a: 'كل سائق يخضع لفحص خلفية صارم وشهادة قيادة دفاعية وتدريب على خدمة العملاء قبل الانضمام لأسطولنا. نراجع الأداء بانتظام عبر تقييمات الركاب ومراجعات الجودة الداخلية.' },
      ],
    },
  },
}

export type Translations = typeof en

export const translations: Record<LangCode, Translations> = { en, ar }
