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

    // 1. Send notification to the library team
    const adminNotification = transporter.sendMail({
      from: `"Glover Library App" <${process.env.SMTP_USER}>`,
      to: 'pooja502@wharton.upenn.edu',
      replyTo: userEmail,
      subject: `[New Borrow Request] ${bookTitle} - ${userName} (${pennKey})`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; max-width: 560px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #011f5b; margin-top: 0; font-family: Georgia, serif;">New Book Borrow Request</h2>
          <p style="font-size: 14px; line-height: 1.5; color: #334155;">
            A student has requested a book. Coordinate direct delivery with the patron:
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
              <td style="padding: 10px 14px; color: #64748b; font-size: 13px;">Catalog Shelf:</td>
              <td style="padding: 10px 14px; font-weight: bold; color: #990000; font-size: 13px;">${shelf || 'Floor 6 Shelf'}</td>
            </tr>
          </table>

          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-bottom: 0;">
            Glover Library • WEMBA San Francisco
          </p>
        </div>
      `,
    });

    // 2. Send delivery confirmation receipt to Patron
    const patronReceipt = transporter.sendMail({
      from: `"Glover Library" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: `[Glover Library] Request Received: "${bookTitle}"`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #1e293b; max-width: 520px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #011f5b; margin-top: 0; font-family: Georgia, serif;">Request Received</h2>
          <p style="font-size: 15px; line-height: 1.5;">Hi <strong>${userName}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.5; color: #334155;">
            Your request to borrow <strong>"${bookTitle}"</strong> has been logged with the librarian team.
          </p>
          <p style="font-size: 14px; line-height: 1.5; color: #334155;">
            Because our space is currently transitioning, our team will coordinate bringing the book directly to you during class.
          </p>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px;">
            <tr>
              <td style="padding: 10px 14px; color: #64748b; font-size: 13px; border-bottom: 1px solid #e2e8f0;">Book Title:</td>
              <td style="padding: 10px 14px; text-align: right; font-weight: bold; font-size: 13px; color: #011f5b; border-bottom: 1px solid #e2e8f0;">${bookTitle}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #64748b; font-size: 13px; border-bottom: 1px solid #e2e8f0;">Author:</td>
              <td style="padding: 10px 14px; text-align: right; font-size: 13px; color: #334155; border-bottom: 1px solid #e2e8f0;">${bookAuthor || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #64748b; font-size: 13px; border-bottom: 1px solid #e2e8f0;">Request Date:</td>
              <td style="padding: 10px 14px; text-align: right; font-weight: bold; font-size: 13px; border-bottom: 1px solid #e2e8f0;">${timestampDisplay}</td>
            </tr>
            <tr>
              <td style="padding: 10px 14px; color: #64748b; font-size: 13px;">Delivery:</td>
              <td style="padding: 10px 14px; text-align: right; font-weight: bold; font-size: 13px; color: #011f5b;">Direct hand-off during class</td>
            </tr>
          </table>

          <p style="font-size: 13px; color: #475569; line-height: 1.5;">
            You will receive follow-up timing details shortly. Thanks for helping keep our shared collection circulating!
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin-top: 24px;" />
          <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-bottom: 0;">
            Glover Library • WEMBA Executive MBA Program • San Francisco
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
