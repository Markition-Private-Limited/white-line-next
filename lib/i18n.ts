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
      { label: 'About',      to: '/about' },
      { label: 'Services',   to: '/services' },
      { label: 'Fleet',      to: '/fleet' },
      { label: 'B2B',        to: '/b2b/login' },
      { label: 'Contact Us', to: '/contact' },
    ],
    download: 'Download Now',
  },

  hero: {
    line1: 'Luxury Travel With',
    line2: 'Purpose & Precision.',
    sub: 'White Lane brings together premium chauffeur services and modern technology to create a transportation experience built around comfort, reliability, privacy, and exceptional service.',
    services: [
      { title: 'Airport Transfer',  desc: 'Airport pickups and drop-offs.' },
      { title: 'One Way Ride',      desc: 'Simple point-to-point travel.' },
      { title: 'City-to-City',      desc: 'Comfortable intercity travel.' },
      { title: 'Day Service',       desc: 'Full-day vehicle block.' },
      { title: 'Hourly Chauffeur',  desc: 'Keep your chauffeur by the hour.' },
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
      { title: 'One-Way Ride',       desc: 'Door-to-door premium transport from/to any destination, worry-less on budget.' },
      { title: 'Hourly Chauffeur',   desc: 'Book a driver on the hour, flexible throughout your busy schedule.' },
      { title: 'City to City',       desc: 'Smooth and comfortable rides for all inter-city and regional trips.' },
      { title: 'Day Service',        desc: 'Professional transportation for meetings, events, and excursions.' },
      { title: 'Airport Transfer',   desc: 'Reliable and comfortable airport pick-ups and drop-offs with a professional chauffeur.' },
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
      company:   { title: 'Company',   links: ['Knowledge Base', 'Security', 'Privacy Policy', 'Partners', 'About Us'] },
      services:  { title: 'Services',  links: ['Contact Us', 'Press', 'Payroll', 'Library', 'Blog', 'Help Center'] },
      resources: { title: 'Resources', links: ['Pricing', 'FAQs', 'Contact Support', 'Privacy Policy', 'Terms'] },
      support:   { title: 'Support',   links: ['Contact', 'Customer Support', 'Testimonials', 'Affiliates', 'Cancellation Policy'] },
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
}

// ─── Arabic translations (Riyadh / Saudi dialect in formal written form) ──────
const ar: typeof en = {
  nav: {
    links: [
      { label: 'الرئيسية',   to: '/' },
      { label: 'من نحن',     to: '/about' },
      { label: 'الخدمات',    to: '/services' },
      { label: 'الأسطول',   to: '/fleet' },
      { label: 'للشركات',   to: '/b2b/login' },
      { label: 'تواصل معنا', to: '/contact' },
    ],
    download: 'حمّل الآن',
  },

  hero: {
    line1: 'سفر راقٍ بهدف',
    line2: 'ودقة لا تُضاهى.',
    sub: 'وايت لاين تجمع بين خدمات السائق الفاخرة والتقنية الحديثة، لتقديم تجربة نقل استثنائية مبنية على الراحة والموثوقية والخصوصية والخدمة المتميزة.',
    services: [
      { title: 'نقل المطار',    desc: 'استقبال وتوصيل من وإلى المطار.' },
      { title: 'رحلة أحادية',   desc: 'تنقل مباشر من نقطة لأخرى.' },
      { title: 'بين المدن',     desc: 'رحلات مريحة بين المدن.' },
      { title: 'خدمة اليوم',   desc: 'حجز السيارة ليوم كامل.' },
      { title: 'سائق بالساعة', desc: 'احتفظ بسائقك الخاص بالساعة.' },
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
      { title: 'رحلة أحادية',   desc: 'نقل فاخر من وإلى أي وجهة، ودون قلق على الميزانية.' },
      { title: 'سائق بالساعة', desc: 'احجز سائقاً بالساعة، مرونة تامة طوال يومك المزدحم.' },
      { title: 'بين المدن',     desc: 'رحلات سلسة ومريحة لجميع التنقلات بين المدن والمناطق.' },
      { title: 'خدمة اليوم',   desc: 'نقل احترافي للاجتماعات والفعاليات والمهمات الخاصة.' },
      { title: 'نقل المطار',    desc: 'استقبال وتوصيل موثوق ومريح مع سائق محترف.' },
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
      company:   { title: 'الشركة',   links: ['قاعدة المعرفة', 'الأمان', 'سياسة الخصوصية', 'الشركاء', 'من نحن'] },
      services:  { title: 'الخدمات', links: ['تواصل معنا', 'الصحافة', 'الرواتب', 'المكتبة', 'المدونة', 'مركز المساعدة'] },
      resources: { title: 'الموارد',  links: ['الأسعار', 'الأسئلة الشائعة', 'دعم العملاء', 'سياسة الخصوصية', 'الشروط والأحكام'] },
      support:   { title: 'الدعم',   links: ['تواصل', 'خدمة العملاء', 'التقييمات', 'المنتسبون', 'سياسة الإلغاء'] },
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
      filters: ['الكل', 'الدرجة الأولى', 'درجة الأعمال', 'SUV', 'سيدان', 'فان', 'كوستر وباص'],
      desc: 'فسيحة وأنيقة ومتعددة الاستخدامات',
    },
  },
}

export type Translations = typeof en

export const translations: Record<LangCode, Translations> = { en, ar }
