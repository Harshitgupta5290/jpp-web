import { Resend } from 'resend'

const FROM = process.env.RESEND_FROM ?? 'JPP <noreply@jawaharprintingpress.com>'

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not set — skipping email send')
    return { success: false, reason: 'no_api_key' }
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      replyTo: replyTo ?? 'info@jawaharprintingpress.com',
    })

    if (error) {
      console.error('[Email] Send error:', error)
      return { success: false, error }
    }

    return { success: true, id: data?.id }
  } catch (err) {
    console.error('[Email] Unexpected error:', err)
    return { success: false, error: err }
  }
}
