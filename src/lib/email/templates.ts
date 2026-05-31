/** Email HTML templates for Resend */

export function orderConfirmationEmail(data: {
  customerName: string
  orderNumber: string
  items: { name: string; qty: number; total: number }[]
  total: number
  advance: number
  balance: number
  estimatedDelivery?: string
}) {
  const itemsHtml = data.items.map((item) =>
    `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #F1F5F9;font-size:14px;color:#0F172A;">${item.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #F1F5F9;font-size:14px;color:#64748B;text-align:center;">${item.qty.toLocaleString()}</td>
      <td style="padding:8px 0;border-bottom:1px solid #F1F5F9;font-size:14px;color:#0F172A;text-align:right;font-weight:600;">₹${item.total.toLocaleString()}</td>
    </tr>`
  ).join('')

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#2D6FFF,#1a4fd8);padding:32px 32px 24px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <div style="width:36px;height:36px;background:rgba(255,255,255,0.2);border-radius:8px;display:flex;align-items:center;justify-content:center;">
          <span style="color:white;font-size:18px;">🖨</span>
        </div>
        <div>
          <div style="color:white;font-size:18px;font-weight:700;">JPP</div>
          <div style="color:rgba(255,255,255,0.7);font-size:11px;text-transform:uppercase;letter-spacing:2px;">Est. 1972</div>
        </div>
      </div>
      <h1 style="color:white;font-size:24px;font-weight:700;margin:0;">Order Confirmed! 🎉</h1>
      <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:8px 0 0;">Hi ${data.customerName}, your order is confirmed and we're getting it ready.</p>
    </div>

    <!-- Order number -->
    <div style="background:#F0F9FF;border-bottom:1px solid #BAE6FD;padding:16px 32px;">
      <p style="margin:0;font-size:13px;color:#0369A1;">Order Number</p>
      <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#0F172A;font-family:monospace;">${data.orderNumber}</p>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <h2 style="font-size:16px;font-weight:600;color:#0F172A;margin:0 0 16px;">Order Summary</h2>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#F8FAFC;">
            <th style="padding:8px 0;font-size:12px;color:#64748B;text-align:left;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Item</th>
            <th style="padding:8px 0;font-size:12px;color:#64748B;text-align:center;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Qty</th>
            <th style="padding:8px 0;font-size:12px;color:#64748B;text-align:right;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <!-- Payment breakdown -->
      <div style="margin-top:24px;padding:16px;background:#F8FAFC;border-radius:12px;border:1px solid #E2E8F0;">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="font-size:14px;color:#64748B;">Total Amount</span>
          <span style="font-size:14px;font-weight:700;color:#0F172A;">₹${data.total.toLocaleString()}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="font-size:14px;color:#64748B;">Advance Paid (50%)</span>
          <span style="font-size:14px;font-weight:600;color:#10B981;">₹${data.advance.toLocaleString()} ✓</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding-top:8px;border-top:1px solid #E2E8F0;">
          <span style="font-size:14px;color:#64748B;">Balance on Delivery</span>
          <span style="font-size:14px;font-weight:600;color:#F5A500;">₹${data.balance.toLocaleString()}</span>
        </div>
      </div>

      ${data.estimatedDelivery ? `
      <div style="margin-top:20px;padding:12px 16px;background:#ECFDF5;border-radius:8px;border:1px solid #A7F3D0;">
        <p style="margin:0;font-size:13px;color:#065F46;"><strong>📦 Estimated Delivery:</strong> ${new Date(data.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>
      ` : ''}

      <div style="margin-top:24px;text-align:center;">
        <a href="https://jawaharprintingpress.com/track/${data.orderNumber}"
           style="display:inline-block;background:#2D6FFF;color:white;font-size:14px;font-weight:600;padding:12px 32px;border-radius:10px;text-decoration:none;">
          Track Your Order →
        </a>
      </div>

      <p style="margin-top:24px;font-size:13px;color:#64748B;text-align:center;">
        Questions? WhatsApp us at <a href="https://wa.me/919999999999" style="color:#2D6FFF;">+91 99999 99999</a><br>
        Mon–Sat, 9 AM – 7 PM IST
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:16px 32px;background:#F8FAFC;border-top:1px solid #E2E8F0;text-align:center;">
      <p style="margin:0;font-size:12px;color:#94A3B8;">© ${new Date().getFullYear()} Jawahar Printing Press, Rohtak, Haryana · Est. 1972</p>
    </div>
  </div>
</body>
</html>`
}

export function orderDispatchedEmail(data: {
  customerName: string
  orderNumber: string
  courierName?: string
  trackingNumber?: string
  estimatedDelivery?: string
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;">
    <div style="background:linear-gradient(135deg,#10B981,#059669);padding:32px;">
      <h1 style="color:white;font-size:24px;font-weight:700;margin:0;">Your order is on its way! 🚚</h1>
      <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:8px 0 0;">Hi ${data.customerName}, your print order has been dispatched.</p>
    </div>
    <div style="padding:32px;">
      <div style="padding:16px;background:#ECFDF5;border-radius:12px;border:1px solid #A7F3D0;margin-bottom:24px;">
        <p style="margin:0 0 8px;font-size:13px;color:#065F46;font-weight:600;">Order: <span style="font-family:monospace;">${data.orderNumber}</span></p>
        ${data.courierName ? `<p style="margin:0 0 4px;font-size:13px;color:#065F46;">Courier: ${data.courierName}</p>` : ''}
        ${data.trackingNumber ? `<p style="margin:0 0 4px;font-size:13px;color:#065F46;">Tracking: <strong>${data.trackingNumber}</strong></p>` : ''}
        ${data.estimatedDelivery ? `<p style="margin:0;font-size:13px;color:#065F46;">Expected by: <strong>${new Date(data.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</strong></p>` : ''}
      </div>
      <p style="font-size:13px;color:#64748B;">Need help? WhatsApp us at <a href="https://wa.me/919999999999" style="color:#2D6FFF;">+91 99999 99999</a></p>
    </div>
  </div>
</body>
</html>`
}

export function quoteEmail(data: {
  customerName: string
  orderNumber: string
  items: { name: string; qty: number; unitPrice: number; total: number }[]
  subtotal: number
  tax: number
  total: number
  validUntil: string
  notes?: string
}) {
  const itemsHtml = data.items.map((item) =>
    `<tr>
      <td style="padding:8px;font-size:13px;color:#0F172A;border-bottom:1px solid #F1F5F9;">${item.name}</td>
      <td style="padding:8px;font-size:13px;color:#64748B;text-align:center;border-bottom:1px solid #F1F5F9;">${item.qty.toLocaleString()}</td>
      <td style="padding:8px;font-size:13px;color:#64748B;text-align:center;border-bottom:1px solid #F1F5F9;">₹${item.unitPrice.toFixed(2)}</td>
      <td style="padding:8px;font-size:13px;font-weight:600;color:#0F172A;text-align:right;border-bottom:1px solid #F1F5F9;">₹${item.total.toLocaleString()}</td>
    </tr>`
  ).join('')

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;">
    <div style="background:linear-gradient(135deg,#F5A500,#e07b00);padding:32px;">
      <h1 style="color:white;font-size:22px;font-weight:700;margin:0;">Your Printing Quote 📄</h1>
      <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:8px 0 0;">Hi ${data.customerName}, here's your quote from Jawahar Printing Press.</p>
    </div>
    <div style="padding:32px;">
      <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:12px 16px;margin-bottom:24px;">
        <p style="margin:0;font-size:13px;color:#92400E;">Quote Reference: <strong style="font-family:monospace;">${data.orderNumber}</strong> · Valid until <strong>${new Date(data.validUntil).toLocaleDateString('en-IN')}</strong></p>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        <thead style="background:#F8FAFC;">
          <tr>
            <th style="padding:8px;font-size:11px;color:#64748B;text-align:left;">Item</th>
            <th style="padding:8px;font-size:11px;color:#64748B;text-align:center;">Qty</th>
            <th style="padding:8px;font-size:11px;color:#64748B;text-align:center;">Unit Price</th>
            <th style="padding:8px;font-size:11px;color:#64748B;text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <div style="margin-top:16px;text-align:right;">
        <p style="margin:4px 0;font-size:13px;color:#64748B;">Subtotal: ₹${data.subtotal.toLocaleString()}</p>
        <p style="margin:4px 0;font-size:13px;color:#64748B;">Tax: ₹${data.tax.toLocaleString()}</p>
        <p style="margin:8px 0 0;font-size:18px;font-weight:700;color:#0F172A;">Total: ₹${data.total.toLocaleString()}</p>
        <p style="margin:4px 0;font-size:13px;color:#10B981;">Advance required (50%): ₹${Math.ceil(data.total * 0.5).toLocaleString()}</p>
      </div>
      ${data.notes ? `<div style="margin-top:20px;padding:12px;background:#F8FAFC;border-radius:8px;border:1px solid #E2E8F0;"><p style="margin:0;font-size:13px;color:#64748B;">${data.notes}</p></div>` : ''}
      <div style="margin-top:24px;text-align:center;">
        <a href="https://wa.me/919999999999?text=${encodeURIComponent(`Hi! I want to confirm my quote ${data.orderNumber}`)}"
           style="display:inline-block;background:#25D366;color:white;font-size:14px;font-weight:600;padding:12px 32px;border-radius:10px;text-decoration:none;">
          Accept Quote on WhatsApp
        </a>
      </div>
    </div>
  </div>
</body>
</html>`
}
