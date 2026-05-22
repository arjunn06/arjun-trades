import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3.23.8';

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend';
const AUDIENCE_ID = '4cf37413-09ce-4808-bfba-04abc22ecc08';
const FROM_ADDRESS = 'Arjun Trades <workshop@ifvg.in>';

const BodySchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY missing');
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY missing');

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }
    const { name, email } = parsed.data;
    const [firstName, ...rest] = name.split(' ');
    const lastName = rest.join(' ');

    const headers = {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      'X-Connection-Api-Key': RESEND_API_KEY,
      'Content-Type': 'application/json',
    };

    // Add to audience (ignore "already exists" style errors)
    const contactRes = await fetch(`${GATEWAY_URL}/audiences/${AUDIENCE_ID}/contacts`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email,
        first_name: firstName,
        last_name: lastName,
        unsubscribed: false,
      }),
    });
    const contactData = await contactRes.json();
    if (!contactRes.ok) {
      console.error('Resend contact add failed', contactRes.status, contactData);
    } else {
      console.log('Contact added', contactData);
    }

    // Send welcome email
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #111;">
        <h1 style="font-size: 22px; margin: 0 0 16px;">Welcome to the Free iFVG Workshop, ${firstName}!</h1>
        <p style="font-size: 15px; line-height: 1.6; color: #333;">
          Thanks for registering your interest. You're officially on the list for the next live workshop.
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #333;">
          We'll email you the moment seats open with the date, time, and joining link. In the meantime,
          you can check out our latest breakdowns on YouTube and read recent blogs on our site.
        </p>
        <p style="font-size: 15px; line-height: 1.6; color: #333;">
          See you in the session.<br/>
          — Arjun Trades
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
        <p style="font-size: 12px; color: #999;">You're receiving this because you signed up at arjuntrades.</p>
      </div>
    `;

    const emailRes = await fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [email],
        subject: "You're in — Free iFVG Workshop",
        html,
      }),
    });
    const emailData = await emailRes.json();
    if (!emailRes.ok) {
      throw new Error(`Resend send failed [${emailRes.status}]: ${JSON.stringify(emailData)}`);
    }

    return new Response(
      JSON.stringify({ success: true, contact: contactData, email: emailData }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('workshop-signup-email error', message);
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
