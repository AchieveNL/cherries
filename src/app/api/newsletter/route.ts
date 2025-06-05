import { NextRequest, NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';

interface NewsletterRequest {
  email: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const { email }: NewsletterRequest = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Geldig e-mailadres is vereist' }, { status: 400 });
    }

    // Create transporter using your one.com SMTP settings
    const transporter = nodemailer.createTransport({
      host: 'send.one.com',
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASSWORD as string,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Email notification to admin about new subscriber
    const adminNotificationHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background-color: #830016; color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .info-box { background-color: #EFE8DD; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .email-address { font-size: 18px; font-weight: bold; color: #830016; word-break: break-all; }
            .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 Nieuwe Nieuwsbrief Aanmelding</h1>
            </div>
            <div class="content">
              <p>Er heeft zich iemand nieuw aangemeld voor de nieuwsbrief!</p>

              <div class="info-box">
                <p><strong>Email adres:</strong></p>
                <div class="email-address">${email}</div>
              </div>

              <p><strong>Aanmelddatum:</strong> ${new Date().toLocaleString('nl-NL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}</p>

              <p><strong>Tijdstempel:</strong> ${new Date().toISOString()}</p>

              <p>Je kunt deze persoon nu toevoegen aan je nieuwsbrief mailinglijst.</p>
            </div>
            <div class="footer">
              <p>Deze notificatie werd automatisch verstuurd vanaf je website.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send notification to admin
    await transporter.sendMail({
      from: 'no-reply@cherriesofficial.com',
      to: 'info@cherriesofficial.com',
      subject: `Nieuwe nieuwsbrief aanmelding: ${email}`,
      html: adminNotificationHtml,
    });

    return NextResponse.json({
      success: true,
      message: 'Bedankt voor je aanmelding! We nemen binnenkort contact met je op.',
    });
  } catch (error: unknown) {
    console.error('Newsletter signup failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Onbekende fout';

    return NextResponse.json({ success: false, error: `Er is een fout opgetreden: ${errorMessage}` }, { status: 500 });
  }
}
