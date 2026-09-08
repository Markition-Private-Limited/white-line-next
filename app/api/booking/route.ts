import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      name, email, phone,
      service, pickup, destination,
      date, time, flightNumber, duration, dayDuration,
      bookingFor, guest, category, vehicle,
    } = body

    const serviceLabel: Record<string, string> = {
      airport: 'Airport Transfer',
      hourly: 'Hourly Chauffeur',
      city: 'City Trip',
      day: 'Day Service',
      oneWay: 'One Way Ride',
    }

    const guestSection = bookingFor === 'guest' && guest
      ? `
Guest Name:  ${guest.name}
Guest Phone: ${guest.phone}
Guest Email: ${guest.email}
      `.trim()
      : ''

    const emailBody = `
New Booking Request — White Line
=================================

Service:    ${serviceLabel[service] ?? service}
Pickup:     ${pickup ?? '--'}
Destination:${destination ?? '--'}
Date:       ${date ?? '--'}
Time:       ${time ?? '--'}
${service === 'airport' ? `Flight No:  ${flightNumber ?? '--'}` : ''}
${service === 'hourly' ? `Duration:   ${duration} hours` : ''}
${service === 'day' ? `Duration:   ${dayDuration === 'full' ? 'Full Day' : 'Half Day'}` : ''}
Category:   ${category ?? '--'}
Vehicle:    ${vehicle ?? '--'}

Booking For: ${bookingFor === 'guest' ? 'Guest' : 'Self'}
${guestSection}

Contact Details
---------------
Name:  ${name}
Email: ${email}
Phone: ${phone}

Booking Reference: ${service?.toUpperCase()}-${Date.now()}
    `.trim()

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"White Line Booking" <${process.env.SMTP_USER}>`,
      to: 'booking@whitelineglobal.com',
      replyTo: email,
      subject: `New ${serviceLabel[service] ?? service} Booking — ${name}`,
      text: emailBody,
    })

    // Also send confirmation to the customer
    await transporter.sendMail({
      from: `"White Line" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Your White Line Booking Request',
      text: `Dear ${name},\n\nThank you for your booking request. Our team will review your details and confirm your chauffeur shortly.\n\n${emailBody}\n\nFor assistance, contact us at booking@whitelineglobal.com or +966 56 311 7770.\n\nWhite Line`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Booking email error:', error)
    return NextResponse.json({ success: false, error: 'Failed to send booking.' }, { status: 500 })
  }
}
