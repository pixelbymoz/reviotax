import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const runtime = 'edge';

interface FeedbackData {
  name: string;
  email: string;
  category: 'general' | 'feature' | 'bug' | 'improvement';
  subject: string;
  message: string;
  rating: number;
}

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'general': return 'Feedback Umum';
    case 'feature': return 'Request Fitur';
    case 'bug': return 'Laporkan Bug';
    case 'improvement': return 'Saran Perbaikan';
    default: return 'Feedback';
  }
};

const getCategoryEmoji = (category: string) => {
  switch (category) {
    case 'general': return '💬';
    case 'feature': return '💡';
    case 'bug': return '🐛';
    case 'improvement': return '⭐';
    default: return '📝';
  }
};

export default async function handler(req: Request) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }

  try {
    const feedbackData: FeedbackData = await req.json();
    
    // Validate required fields
    if (!feedbackData.name || !feedbackData.email || !feedbackData.subject || !feedbackData.message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(feedbackData.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    const categoryLabel = getCategoryLabel(feedbackData.category);
    const categoryEmoji = getCategoryEmoji(feedbackData.category);
    
    // Create email content
    const emailSubject = `${categoryEmoji} [Reviotax Feedback] ${categoryLabel} - ${feedbackData.subject}`;
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #14b8a6, #06b6d4); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .footer { background: #374151; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: 600; color: #374151; margin-bottom: 5px; display: block; }
            .value { background: white; padding: 10px; border-radius: 4px; border: 1px solid #d1d5db; }
            .category-badge { display: inline-block; background: #14b8a6; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
            .rating { color: #f59e0b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 Feedback Baru dari Reviotax</h1>
              <p>Feedback dari pengguna aplikasi kalkulator pajak</p>
            </div>
            
            <div class="content">
              <div class="field">
                <span class="label">Kategori:</span>
                <div class="value">
                  <span class="category-badge">${categoryEmoji} ${categoryLabel}</span>
                </div>
              </div>
              
              <div class="field">
                <span class="label">Nama:</span>
                <div class="value">${feedbackData.name}</div>
              </div>
              
              <div class="field">
                <span class="label">Email:</span>
                <div class="value">${feedbackData.email}</div>
              </div>
              
              <div class="field">
                <span class="label">Subjek:</span>
                <div class="value">${feedbackData.subject}</div>
              </div>
              
              ${feedbackData.rating > 0 ? `
              <div class="field">
                <span class="label">Rating Pengalaman:</span>
                <div class="value">
                  <span class="rating">${'⭐'.repeat(feedbackData.rating)}</span> 
                  (${feedbackData.rating}/5 bintang)
                </div>
              </div>
              ` : ''}
              
              <div class="field">
                <span class="label">Pesan:</span>
                <div class="value" style="white-space: pre-wrap;">${feedbackData.message}</div>
              </div>
            </div>
            
            <div class="footer">
              <p>Dikirim dari Reviotax Feedback Form</p>
              <p>Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB</p>
              <p>Domain: reviotax.vercel.app</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailText = `
Feedback Baru dari Reviotax

Kategori: ${categoryLabel}
Nama: ${feedbackData.name}
Email: ${feedbackData.email}
Subjek: ${feedbackData.subject}
${feedbackData.rating > 0 ? `Rating: ${feedbackData.rating}/5 bintang` : ''}

Pesan:
${feedbackData.message}

---
Dikirim dari Reviotax Feedback Form
Waktu: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB
Domain: reviotax.vercel.app
    `.trim();

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Reviotax Feedback <noreply@reviotax.vercel.app>',
      to: ['pixelbymoz@gmail.com'],
      replyTo: feedbackData.email,
      subject: emailSubject,
      html: emailHtml,
      text: emailText,
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: error }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Feedback berhasil dikirim!',
        emailId: data?.id 
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );

  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}