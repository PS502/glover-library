import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const { userEmail, userName, pennKey, bookTitle, bookAuthor, shelf, requestTimestamp } = await req.json();

    if (!userEmail || !userEmail.toLowerCase().endsWith('penn.edu')) {
      return NextResponse.json({ error: 'A valid Penn email ending in penn.edu is required.' }, { status: 400 });
    }

    const timestampDisplay = requestTimestamp || new Date().toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    // 1. Send notification to Pooja
    const adminNotification = transporter.sendMail({
      from: `"Glover Library App" <${process.env.SMTP_USER}>`,
      to: 'pooja502@wharton.upenn.edu',
      replyTo: userEmail,
      subject: `[New Borrow Request] ${bookTitle} - ${userName} (${pennKey})`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; max-width: 560px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #011f5b; margin-top: 0; font-family: Georgia, serif;">New Book Borrow Request</h2>
          <p style="font-size: 14px; line-height: 1.5; color: #334155;">
            A student has requested to borrow a book from the Glover Library on Floor 6.
          </p>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px;">
            <tr>
              <td style="padding: 10px 14px; color: #64748b; font-size: 13px; border-bottom: 1px solid #e2e8f0;">Date & Time:</td>
              <td style="padding: 10px 14px; font-weight: bold; font-size: 13px; color: #011f5b; border-bottom: 1px solid #e2e8f0;">${timestampDisplay}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #64748b; font-size: 13px; border-bottom: 1px solid #e2e8f0;">Patron Name:</td>
              <td style="padding: 10px 14px; font-weight: bold; font-size: 13px; color: #011f5b; border-bottom: 1px solid #e2e8f0;">${userName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #64748b; font-size: 13px; border-bottom: 1px solid #e2e8f0;">PennKey:</td>
              <td style="padding: 10px 14px; font-weight: bold; font-family: monospace; font-size: 13px; color: #990000; border-bottom: 1px solid #e2e8f0;">${pennKey}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #64748b; font-size: 13px; border-bottom: 1px solid #e2e8f0;">Penn Email:</td>
              <td style="padding: 10px 14px; font-size: 13px; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${userEmail}">${userEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #64748b; font-size: 13px; border-bottom: 1px solid #e2e8f0;">Book Title:</td>
              <td style="padding: 10px 14px; font-weight: bold; font-size: 13px; color: #011f5b; border-bottom: 1px solid #e2e8f0;">${bookTitle}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #64748b; font-size: 13px; border-bottom: 1px solid #e2e8f0;">Author:</td>
              <td style="padding: 10px 14px; font-size: 13px; border-bottom: 1px solid #e2e8f0;">${bookAuthor || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #64748b; font-size: 13px;">Shelf Location:</td>
              <td style="padding: 10px 14px; font-weight: bold; color: #990000; font-size: 13px;">${shelf || 'Floor 6 Shelf'}</td>
            </tr>
          </table>

          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-bottom: 0;">
            Glover Library • WEMBA San Francisco • 2 Harrison St, Fl 6
          </p>
        </div>
      `,
    });

    // 2. Send receipt to Patron
    const patronReceipt = transporter.sendMail({
      from: `"Glover Library" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: `[Glover Library] Borrow Request: "${bookTitle}"`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; max-width: 520px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #011f5b; margin-top: 0; font-family: Georgia, serif;">Borrow Request Received</h2>
          <p style="font-size: 15px; line-height: 1.5;">Hi <strong>${userName}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.5; color: #334155;">
            Your request to borrow <strong>"${bookTitle}"</strong> from the Glover Library (Floor 6 break area) has been confirmed.
          </p>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px;">
            <tr>
              <td style="padding: 10px 14px; color: #64748b; font-size: 13px;">Shelf Location:</td>
              <td style="padding: 10px 14px; text-align: right; font-weight: bold; font-size: 13px; color: #011f5b;">${shelf}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #64748b; font-size: 13px;">Request Date:</td>
              <td style="padding: 10px 14px; text-align: right; font-weight: bold; font-size: 13px;">${timestampDisplay}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #64748b; font-size: 13px;">Return Location:</td>
              <td style="padding: 10px 14px; text-align: right; font-weight: bold; font-size: 13px;">2 Harrison St, Fl 6</td>
            </tr>
          </table>

          <p style="font-size: 13px; color: #475569; line-height: 1.5;">
            Enjoy the read! Please remember to return the book within 14 days so your classmates have access when they need it.
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin-top: 24px;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-bottom: 0;">
            Glover Library • WEMBA Executive MBA Program • 2 Harrison St, San Francisco
          </p>
        </div>
      `,
    });

    await Promise.all([adminNotification, patronReceipt]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return NextResponse.json({ error: 'Failed to process request email' }, { status: 500 });
  }
}
