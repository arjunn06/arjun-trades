import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3.23.8';

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend';
const AUDIENCE_ID = '4cf37413-09ce-4808-bfba-04abc22ecc08';
const FROM_ADDRESS = 'Arjun IFVG - Workshop Update <workshop@ifvg.in>';

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
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="width=device-width" name="viewport" />
    <link
      rel="preload"
      as="image"
      href="https://resend-attachments.s3.amazonaws.com/bfc73c59-7228-4342-8b27-d8c8177f0bcb"
    />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta content="IE=edge" http-equiv="X-UA-Compatible" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta content="telephone=no,address=no,email=no,date=no,url=no" name="format-detection" />
    <style>
      body, table, td, p, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
          table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; border-collapse:collapse; }
          img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; display:block; }
          body {
            margin:0 !important;
            padding:0 !important;
            width:100% !important;
            background-color:#0a0a0a;
            /* Two red glow blobs as radial gradients — very subtle, barely-there hint of red */
            background-image:
              radial-gradient(ellipse 700px 420px at 85% 8%, rgba(255,0,0,0.18) 0%, rgba(255,0,0,0.08) 25%, rgba(255,0,0,0.02) 55%, rgba(255,0,0,0) 80%),
              radial-gradient(circle 600px at 0% 90%, rgba(255,0,0,0.14) 0%, rgba(255,0,0,0.05) 32%, rgba(255,0,0,0.015) 60%, rgba(255,0,0,0) 82%);
            background-repeat:no-repeat, no-repeat;
            background-attachment:fixed, fixed;
          }
          a { text-decoration:none; }
          :root { color-scheme:dark; supported-color-schemes:dark; }

          /* Container also carries the gradients so the effect shows in clients that strip body styles (Gmail) */
          .glow-bg {
            background-color:#0a0a0a;
            background-image:
              radial-gradient(ellipse 700px 420px at 85% 8%, rgba(255,0,0,0.18) 0%, rgba(255,0,0,0.08) 25%, rgba(255,0,0,0.02) 55%, rgba(255,0,0,0) 80%),
              radial-gradient(circle 600px at 0% 90%, rgba(255,0,0,0.14) 0%, rgba(255,0,0,0.05) 32%, rgba(255,0,0,0.015) 60%, rgba(255,0,0,0) 82%);
            background-repeat:no-repeat, no-repeat;
          }

          @media screen and (max-width:600px) {
            .container { width:100% !important; }
            .px-24 { padding-left:20px !important; padding-right:20px !important; }
            .hero-h { font-size:44px !important; }
            .meta-stack { display:block !important; width:100% !important; padding:10px 0 !important; text-align:left !important; }
            .cta-stack-text, .cta-stack-btn { display:block !important; width:100% !important; text-align:left !important; }
            .cta-stack-btn { padding:20px 0 0 0 !important; }
          }
    </style>
  </head>
  <body style="background-color:#ffffff">
    <!--$--><!--html--><!--head--><!--body-->
    <table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation" align="center">
      <tbody>
        <tr>
          <td style="background-color:#ffffff">
            <table
              align="left"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="max-width:600px;align:left;width:100%;color:#000000;background-color:#ffffff;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px;border-radius:0px;border-color:#000000"
            >
              <tbody>
                <tr style="width:100%">
                  <td>
                    <div
                      style="margin:0;padding:0;display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#0a0a0a"
                    >
                      <p style="margin:0;padding:0">
                        Workshop date &amp; time drops live on Monday. Subscribe to get notified the moment we go live.
                      </p>
                    </div>
                    <table
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      class="glow-bg"
                      style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"
                    >
                      <tbody>
                        <tr style="margin:0;padding:0">
                          <td align="center" data-id="__react-email-column" style="margin:0;padding:0">
                            <table
                              width="600"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              class="container"
                              style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0;width:600px;max-width:600px"
                            >
                              <tbody>
                                <tr style="margin:0;padding:0">
                                  <td
                                    data-id="__react-email-column"
                                    style="margin:0;padding:0;border-bottom:1px solid #1d1d1d"
                                  >
                                    <table
                                      width="100%"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                      style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0;height:56px"
                                    >
                                      <tbody>
                                        <tr style="margin:0;padding:0">
                                          <td
                                            align="left"
                                            data-id="__react-email-column"
                                            style="margin:0;padding:10px 24px"
                                          >
                                            <table
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              role="presentation"
                                              style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"
                                            >
                                              <tbody>
                                                <tr style="margin:0;padding:0">
                                                  <td
                                                    data-id="__react-email-column"
                                                    style="margin:0;padding:0;line-height:0;font-size:0"
                                                  >
                                                    <img
                                                      height="19"
                                                      src="https://resend-attachments.s3.amazonaws.com/bfc73c59-7228-4342-8b27-d8c8177f0bcb"
                                                      style="display:block;outline:none;border:none;text-decoration:none;max-width:100%"
                                                      width="19"
                                                    />
                                                    <p style="margin:0;padding:0">
                                                      <br />
                                                    </p>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                          <td
                                            align="right"
                                            data-id="__react-email-column"
                                            style="margin:0;padding:10px 24px"
                                          >
                                            <p style="margin:0;padding:0;font-size:11px">
                                              <span style="color:#999999"
                                                ><span style="text-transform:uppercase"
                                                  >IFVG.IN · Workshop Update</span
                                                ></span
                                              >
                                            </p>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                                <tr style="margin:0;padding:0">
                                  <td
                                    class="px-24"
                                    data-id="__react-email-column"
                                    style="margin:0;padding:40px 24px 0 24px"
                                  >
                                    <p
                                      style="margin:0 0 16px 0;padding:0;font-family:&#x27;JetBrains Mono&#x27;,&#x27;Courier New&#x27;,Courier,monospace;font-size:12px;line-height:1;color:#ff0000;letter-spacing:1.2px;text-transform:uppercase"
                                    >
                                      → A LETTER FROM ARJUN
                                    </p>
                                    <p
                                      class="hero-h"
                                      style="margin:0;padding:0;font-family:&#x27;Clash Display&#x27;,&#x27;Archivo&#x27;,Arial,Helvetica,sans-serif;font-weight:700;font-size:56px;line-height:0.9;color:#ffffff;letter-spacing:-2px"
                                    >
                                      Workshop Date<br /><span style="color:#ff0000">Announcement</span>
                                    </p>
                                  </td>
                                </tr>
                                <tr style="margin:0;padding:0">
                                  <td
                                    class="px-24"
                                    data-id="__react-email-column"
                                    style="margin:0;padding:40px 24px 0 24px"
                                  >
                                    <table
                                      width="100%"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                      style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0;border-top:1px solid #1d1d1d;border-bottom:1px solid #1d1d1d"
                                    >
                                      <tbody>
                                        <tr style="margin:0;padding:0">
                                          <td
                                            class="meta-stack"
                                            align="left"
                                            data-id="__react-email-column"
                                            style="margin:0;padding:14px 0;width:33%"
                                          >
                                            <p
                                              style="margin:0 0 4px 0;padding:0;font-family:&#x27;JetBrains Mono&#x27;,&#x27;Courier New&#x27;,Courier,monospace;font-size:10px;line-height:1;color:#999999;letter-spacing:0.8px"
                                            >
                                              DATE
                                            </p>
                                            <p
                                              style="margin:0;padding:0;font-family:&#x27;Archivo&#x27;,Arial,Helvetica,sans-serif;font-weight:700;font-size:13px;line-height:1;color:#ffffff"
                                            >
                                              MON, 25 MAY
                                            </p>
                                          </td>
                                          <td
                                            class="meta-stack"
                                            align="center"
                                            data-id="__react-email-column"
                                            style="margin:0;padding:14px 0;width:33%"
                                          >
                                            <table
                                              align="center"
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              role="presentation"
                                              style="margin-top:0;margin-right:auto;margin-bottom:0;margin-left:auto;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"
                                            >
                                              <tbody>
                                                <tr style="margin:0;padding:0">
                                                  <td
                                                    align="left"
                                                    data-id="__react-email-column"
                                                    style="margin:0;padding:0"
                                                  >
                                                    <p
                                                      style="margin:0 0 4px 0;padding:0;font-family:&#x27;JetBrains Mono&#x27;,&#x27;Courier New&#x27;,Courier,monospace;font-size:10px;line-height:1;color:#999999;letter-spacing:0.8px"
                                                    >
                                                      TIME
                                                    </p>
                                                    <p
                                                      style="margin:0;padding:0;font-family:&#x27;Archivo&#x27;,Arial,Helvetica,sans-serif;font-weight:700;font-size:13px;line-height:1;color:#ffffff"
                                                    >
                                                      7:00 PM IST
                                                    </p>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                          <td
                                            class="meta-stack"
                                            align="right"
                                            data-id="__react-email-column"
                                            style="margin:0;padding:14px 0;width:34%"
                                          >
                                            <table
                                              align="right"
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              role="presentation"
                                              style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"
                                            >
                                              <tbody>
                                                <tr style="margin:0;padding:0">
                                                  <td
                                                    align="left"
                                                    data-id="__react-email-column"
                                                    style="margin:0;padding:0"
                                                  >
                                                    <p
                                                      style="margin:0 0 4px 0;padding:0;font-family:&#x27;JetBrains Mono&#x27;,&#x27;Courier New&#x27;,Courier,monospace;font-size:10px;line-height:1;color:#999999;letter-spacing:0.8px"
                                                    >
                                                      FORMAT
                                                    </p>
                                                    <p
                                                      style="margin:0;padding:0;font-family:&#x27;Archivo&#x27;,Arial,Helvetica,sans-serif;font-weight:700;font-size:13px;line-height:1;color:#ffffff"
                                                    >
                                                      LIVE  ON YOUTUBE
                                                    </p>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                                <tr style="margin:0;padding:0">
                                  <td
                                    class="px-24"
                                    data-id="__react-email-column"
                                    style="margin:0;padding:34px 24px 0 24px"
                                  >
                                    <p
                                      style="margin:0;padding:0;font-family:&#x27;Archivo&#x27;,Arial,Helvetica,sans-serif;font-size:17px;line-height:1.55;color:#e0e0e0"
                                    >
                                      Arjun,
                                    </p>
                                    <p
                                      style="margin:26px 0 0 0;padding:0;font-family:&#x27;Archivo&#x27;,Arial,Helvetica,sans-serif;font-size:17px;line-height:1.55;color:#e0e0e0"
                                    >
                                      I’m glad you made the conscious decision towards registering for this free trading
                                      workshop by <strong>Arjun IFVG.</strong>
                                    </p>
                                    <p
                                      style="margin:26px 0 0 0;padding:0;font-family:&#x27;Archivo&#x27;,Arial,Helvetica,sans-serif;font-size:17px;line-height:1.55;color:#ffffff;font-weight:700"
                                    >
                                      The workshop date and time is set to be announced on my livestream in YouTube at 7
                                      PM, Monday.
                                    </p>
                                  </td>
                                </tr>
                                <tr style="margin:0;padding:0">
                                  <td
                                    class="px-24"
                                    data-id="__react-email-column"
                                    style="margin:0;padding:34px 24px 0 24px"
                                  >
                                    <p
                                      style="margin:0 0 12px 0;padding:0;font-family:&#x27;Archivo&#x27;,Arial,Helvetica,sans-serif;font-weight:600;font-size:14px;line-height:1;color:#999999;letter-spacing:1.68px;text-transform:uppercase"
                                    >
                                      What we’ll announce in the livestream
                                    </p>
                                    <table
                                      width="100%"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                      style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"
                                    >
                                      <tbody>
                                        <tr style="margin:0;padding:0">
                                          <td
                                            data-id="__react-email-column"
                                            style="margin:0;padding:0 24px 0 0;border-top:1px solid #1d1d1d;height:60px;width:30px;font-family:&#x27;JetBrains Mono&#x27;,&#x27;Courier New&#x27;,Courier,monospace;font-size:14px;line-height:1;color:#ff0000"
                                          >
                                            <p style="margin:0;padding:0">01</p>
                                          </td>
                                          <td
                                            data-id="__react-email-column"
                                            style="margin:0;padding:0;border-top:1px solid #1d1d1d;height:60px;font-family:&#x27;Archivo&#x27;,Arial,Helvetica,sans-serif;font-size:17px;line-height:1;color:#ffffff"
                                          >
                                            <p style="margin:0;padding:0">Date &amp; Time of the workshop</p>
                                          </td>
                                        </tr>
                                        <tr style="margin:0;padding:0">
                                          <td
                                            data-id="__react-email-column"
                                            style="margin:0;padding:0 24px 0 0;border-top:1px solid #1d1d1d;height:60px;width:30px;font-family:&#x27;JetBrains Mono&#x27;,&#x27;Courier New&#x27;,Courier,monospace;font-size:14px;line-height:1;color:#ff0000"
                                          >
                                            <p style="margin:0;padding:0">02</p>
                                          </td>
                                          <td
                                            data-id="__react-email-column"
                                            style="margin:0;padding:0;border-top:1px solid #1d1d1d;height:60px;font-family:&#x27;Archivo&#x27;,Arial,Helvetica,sans-serif;font-size:17px;line-height:1;color:#ffffff"
                                          >
                                            <p style="margin:0;padding:0">Agenda for the workshop</p>
                                          </td>
                                        </tr>
                                        <tr style="margin:0;padding:0">
                                          <td
                                            data-id="__react-email-column"
                                            style="margin:0;padding:0 24px 0 0;border-top:1px solid #1d1d1d;border-bottom:1px solid #1d1d1d;height:60px;width:30px;font-family:&#x27;JetBrains Mono&#x27;,&#x27;Courier New&#x27;,Courier,monospace;font-size:14px;line-height:1;color:#ff0000"
                                          >
                                            <p style="margin:0;padding:0">03</p>
                                          </td>
                                          <td
                                            data-id="__react-email-column"
                                            style="margin:0;padding:0;border-top:1px solid #1d1d1d;border-bottom:1px solid #1d1d1d;height:60px;font-family:&#x27;Archivo&#x27;,Arial,Helvetica,sans-serif;font-size:17px;line-height:1;color:#ffffff"
                                          >
                                            <p style="margin:0;padding:0">An overview of the workshop’s contents</p>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                                <tr style="margin:0;padding:0">
                                  <td
                                    class="px-24"
                                    data-id="__react-email-column"
                                    style="margin:0;padding:40px 24px 0 24px"
                                  >
                                    <table
                                      width="100%"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                      style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"
                                    >
                                      <tbody>
                                        <tr style="margin:0;padding:0">
                                          <td data-id="__react-email-column" style="margin:0;padding:0">
                                            <table
                                              width="100%"
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              role="presentation"
                                              style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"
                                            >
                                              <tbody>
                                                <tr style="margin:0;padding:0">
                                                  <td
                                                    data-id="__react-email-column"
                                                    style="margin:0;padding:0;width:544px;background-color:#121212;border-top:1.5px solid #ffffff;border-left:1.5px solid #ffffff;border-right:1.5px solid #ffffff;height:28px;font-size:1px;line-height:1px"
                                                  >
                                                    <p style="margin:0;padding:0"> </p>
                                                  </td>
                                                  <td
                                                    data-id="__react-email-column"
                                                    style="margin:0;padding:0;width:8px;font-size:1px;line-height:1px"
                                                  >
                                                    <p style="margin:0;padding:0"> </p>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                            <table
                                              width="100%"
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              role="presentation"
                                              style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"
                                            >
                                              <tbody>
                                                <tr style="margin:0;padding:0">
                                                  <td
                                                    data-id="__react-email-column"
                                                    style="margin:0;padding:0 32px;width:544px;background-color:#121212;border-left:1.5px solid #ffffff;border-right:1.5px solid #ffffff"
                                                  >
                                                    <table
                                                      width="100%"
                                                      border="0"
                                                      cellpadding="0"
                                                      cellspacing="0"
                                                      role="presentation"
                                                      style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"
                                                    >
                                                      <tbody>
                                                        <tr style="margin:0;padding:0">
                                                          <td
                                                            class="cta-stack-text"
                                                            align="left"
                                                            data-id="__react-email-column"
                                                            style="margin:0;padding:0"
                                                          >
                                                            <p
                                                              style="margin:0 0 10px 0;padding:0;font-family:&#x27;JetBrains Mono&#x27;,&#x27;Courier New&#x27;,Courier,monospace;font-size:11px;line-height:1;color:#ff0000;letter-spacing:1.1px;text-transform:uppercase"
                                                            >
                                                              Get Notified
                                                            </p>
                                                            <p
                                                              style="margin:0;padding:0;font-family:&#x27;Clash Display&#x27;,&#x27;Archivo&#x27;,Arial,Helvetica,sans-serif;font-weight:600;font-size:22px;line-height:1.2;color:#ffffff"
                                                            >
                                                              Subscribe to get notified<br />the moment I go live.
                                                            </p>
                                                          </td>
                                                          <td
                                                            class="cta-stack-btn"
                                                            align="right"
                                                            data-id="__react-email-column"
                                                            style="margin:0;padding:0 0 0 24px"
                                                          >
                                                            <p style="margin:0;padding:0">
                                                              <a
                                                                href="https://youtube.com/@arjun_ifvg"
                                                                rel="noopener noreferrer nofollow"
                                                                style="color:#ffffff;text-decoration-line:none;text-decoration:none;display:inline-block;background-color:#ff0000;font-family:&#x27;Archivo&#x27;,Arial,Helvetica,sans-serif;font-weight:700;font-size:14px;line-height:1;letter-spacing:1.12px;padding:18px 26px;text-transform:uppercase;white-space:nowrap"
                                                                target="_blank"
                                                                >SUBSCRIBE  →</a
                                                              >
                                                            </p>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                  <td
                                                    data-id="__react-email-column"
                                                    style="margin:0;padding:0;width:8px;background-color:#ff0000;font-size:1px;line-height:1px"
                                                  >
                                                    <p style="margin:0;padding:0"> </p>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                            <table
                                              width="100%"
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              role="presentation"
                                              style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"
                                            >
                                              <tbody>
                                                <tr style="margin:0;padding:0">
                                                  <td
                                                    data-id="__react-email-column"
                                                    style="margin:0;padding:0;width:544px;background-color:#121212;border-bottom:1.5px solid #ffffff;border-left:1.5px solid #ffffff;border-right:1.5px solid #ffffff;height:28px;font-size:1px;line-height:1px"
                                                  >
                                                    <p style="margin:0;padding:0"> </p>
                                                  </td>
                                                  <td
                                                    data-id="__react-email-column"
                                                    style="margin:0;padding:0;width:8px;background-color:#ff0000;font-size:1px;line-height:1px"
                                                  >
                                                    <p style="margin:0;padding:0"> </p>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                            <table
                                              width="100%"
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              role="presentation"
                                              style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0"
                                            >
                                              <tbody>
                                                <tr style="margin:0;padding:0">
                                                  <td
                                                    data-id="__react-email-column"
                                                    style="margin:0;padding:0;width:10px;font-size:1px;line-height:1px"
                                                  >
                                                    <p style="margin:0;padding:0"> </p>
                                                  </td>
                                                  <td
                                                    data-id="__react-email-column"
                                                    style="margin:0;padding:0;background-color:#ff0000;height:10px;font-size:1px;line-height:1px"
                                                  >
                                                    <p style="margin:0;padding:0"> </p>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                                <tr style="margin:0;padding:0">
                                  <td
                                    class="px-24"
                                    data-id="__react-email-column"
                                    style="margin:0;padding:40px 24px 0 24px"
                                  >
                                    <p
                                      style="margin:0;padding:0;font-family:&#x27;Archivo&#x27;,Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;color:#c7c7c7"
                                    >
                                      See you Monday.
                                    </p>
                                    <p
                                      style="margin:24px 0 0 0;padding:0;font-family:&#x27;Archivo&#x27;,Arial,Helvetica,sans-serif;font-weight:700;font-size:16px;line-height:1.5;color:#ffffff"
                                    >
                                      — Arjun
                                    </p>
                                  </td>
                                </tr>
                                <tr style="margin:0;padding:0">
                                  <td data-id="__react-email-column" style="margin:0;padding:40px 0 0 0">
                                    <table
                                      width="100%"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                      style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0;border-top:1px solid #1d1d1d"
                                    >
                                      <tbody>
                                        <tr style="margin:0;padding:0">
                                          <td
                                            align="left"
                                            data-id="__react-email-column"
                                            style="margin:0;padding:18px 24px;font-family:&#x27;JetBrains Mono&#x27;,&#x27;Courier New&#x27;,Courier,monospace;font-size:10px;line-height:1;color:#999999;letter-spacing:1px;text-transform:uppercase"
                                          >
                                            <p style="margin:0;padding:0">© IFVG.IN · 2026</p>
                                          </td>
                                          <td
                                            align="right"
                                            data-id="__react-email-column"
                                            style="margin:0;padding:18px 24px"
                                          >
                                            <p style="margin:0;padding:0">
                                              <br />
                                            </p>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p style="margin:0;padding:0"><br /></p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <!--/$-->
  </body>
</html>
    `;

    const emailRes = await fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [email],
        subject: "Workshop Update - Date and Time Announcement Livestream",
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
