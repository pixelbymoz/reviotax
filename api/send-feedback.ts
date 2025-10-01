import { Resend } from 'resend';

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
    // Initialize Resend inside the handler to avoid cold start issues
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Check if API key exists
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

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
    
    // Simplified email content to reduce processing time
    const emailText = `Feedback Baru dari Reviotax

Kategori: ${categoryLabel}
Nama: ${feedbackData.name}
Email: ${feedbackData.email}
Subjek: ${feedbackData.subject}
${feedbackData.rating > 0 ? `Rating: ${feedbackData.rating}/5 bintang` : ''}

Pesan:
${feedbackData.message}

---
Dikirim: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB`;

    // Send email using Resend
    console.log('Sending email with Resend...');
    const emailResult = await resend.emails.send({
      from: 'onboarding@resend.dev', // Use Resend's default domain
      to: ['pixelbymoz@gmail.com'],
      replyTo: feedbackData.email,
      subject: emailSubject,
      text: emailText,
    });

    if (emailResult.error) {
      console.error('Resend error:', emailResult.error);
      return new Response(
        JSON.stringify({ error: 'Failed to send email', details: emailResult.error }),
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }

    console.log('Email sent successfully:', emailResult.data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Feedback berhasil dikirim!',
        emailId: emailResult.data?.id 
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