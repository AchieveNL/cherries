import { NextRequest, NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';

interface ContactRequest {
  fullName: string;
  email: string;
  issueType: string;
  description: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const { fullName, email, issueType, description }: ContactRequest = await request.json();

    // Validation
    if (!fullName || !email || !issueType || !description) {
      return NextResponse.json({ success: false, error: 'Alle velden zijn verplicht' }, { status: 400 });
    }

    if (!email.includes('@')) {
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

    // Get issue type display name
    const getIssueTypeDisplay = (type: string): string => {
      const types: Record<string, string> = {
        technical: 'Technische Issue',
        billing: 'Factureringsvraag',
        general: 'Algemene Vraag',
        support: 'Klantenservice',
        feedback: 'Feedback',
      };
      return types[type] || type;
    };

    // Email notification to admin about new contact form submission
    const adminNotificationHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f8f9fa;
              margin: 0;
              padding: 20px;
              line-height: 1.6;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
              background-color: #830016;
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 30px;
            }
            .info-section {
              margin-bottom: 25px;
            }
            .info-box {
              background-color: #EFE8DD;
              padding: 20px;
              border-radius: 8px;
              margin: 15px 0;
            }
            .field-label {
              font-weight: bold;
              color: #830016;
              margin-bottom: 5px;
              display: block;
            }
            .field-value {
              color: #333;
              word-break: break-word;
            }
            .email-value {
              font-size: 16px;
              font-weight: bold;
              color: #830016;
            }
            .description-value {
              background-color: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
              border-left: 4px solid #830016;
              margin-top: 10px;
              white-space: pre-wrap;
            }
            .priority-badge {
              display: inline-block;
              padding: 5px 12px;
              border-radius: 15px;
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .priority-technical { background-color: #dc3545; color: white; }
            .priority-billing { background-color: #fd7e14; color: white; }
            .priority-general { background-color: #28a745; color: white; }
            .priority-support { background-color: #007bff; color: white; }
            .priority-feedback { background-color: #6f42c1; color: white; }
            .footer {
              background-color: #f8f9fa;
              padding: 20px;
              text-align: center;
              color: #666;
              font-size: 14px;
            }
            .timestamp {
              color: #666;
              font-size: 14px;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Nieuw Contact Formulier</h1>
            </div>
            <div class="content">
              <p>Er is een nieuw contactformulier ingevuld op de website!</p>

              <div class="info-section">
                <div class="info-box">
                  <span class="field-label">Naam:</span>
                  <div class="field-value">${fullName}</div>
                </div>

                <div class="info-box">
                  <span class="field-label">Email:</span>
                  <div class="field-value email-value">${email}</div>
                </div>

                <div class="info-box">
                  <span class="field-label">Type Issue:</span>
                  <div class="field-value">
                    <span class="priority-badge priority-${issueType}">${getIssueTypeDisplay(issueType)}</span>
                  </div>
                </div>

                <div class="info-box">
                  <span class="field-label">Bericht:</span>
                  <div class="description-value">${description}</div>
                </div>
              </div>

              <div class="timestamp">
                <p><strong>Ontvangen op:</strong> ${new Date().toLocaleString('nl-NL', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}</p>
                <p><strong>Tijdstempel:</strong> ${new Date().toISOString()}</p>
              </div>
            </div>
            <div class="footer">
              <p>Deze notificatie werd automatisch verstuurd vanaf je website.</p>
              <p>Reageer direct op ${email} om contact op te nemen met de klant.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send notification to admin
    await transporter.sendMail({
      from: 'no-reply@cherriesofficial.com',
      to: 'info@cherriesofficial.com',
      subject: `Nieuw contactformulier: ${getIssueTypeDisplay(issueType)} - ${fullName}`,
      html: adminNotificationHtml,
      replyTo: email, // Allow direct reply to the customer
    });

    return NextResponse.json({
      success: true,
      message: 'Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.',
    });
  } catch (error: unknown) {
    console.error('Contact form submission failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Onbekende fout';
    return NextResponse.json({ success: false, error: `Er is een fout opgetreden: ${errorMessage}` }, { status: 500 });
  }
}
