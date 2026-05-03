require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@libsql/client');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// ─── Database Setup (Turso) ───────────────────────────────────
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// ─── Auto-create tables on first run ─────────────────────────
async function initDB() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      address TEXT NOT NULL,
      session_type TEXT NOT NULL,
      preferred_datetime TEXT,
      wellness_goal TEXT,
      status TEXT DEFAULT 'New',
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS teacher_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      experience TEXT NOT NULL,
      specialization TEXT NOT NULL,
      bio TEXT,
      status TEXT DEFAULT 'New',
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT,
      preferred_datetime TEXT,
      wellness_goal TEXT,
      status TEXT DEFAULT 'New',
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      summary TEXT,
      content TEXT NOT NULL,
      image_url TEXT,
      author TEXT DEFAULT 'Admin',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);
  console.log('✅ Database tables ready');
}

const brevo = require('sib-api-v3-sdk');

// ─── Email Transporter ────────────────────────────────────────
const defaultClient = brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new brevo.TransactionalEmailsApi();

function generateInquiryEmail(data, id, host) {
  const baseUrl = host ? `https://${host}` : `http://localhost:${process.env.PORT || 3000}`;
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Georgia, serif; background: #f8f4ee; margin: 0; padding: 0; }
    .wrapper { max-width: 640px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 40px 30px; text-align: center; }
    .header img { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; margin-bottom: 16px; }
    .header h1 { color: #D4AF37; font-size: 22px; margin: 0 0 6px; letter-spacing: 2px; text-transform: uppercase; }
    .header p { color: rgba(255,255,255,0.6); font-size: 13px; margin: 0; font-style: italic; }
    .badge { display: inline-block; background: #D4AF37; color: #111; padding: 4px 16px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-top: 14px; }
    .body { padding: 40px; }
    .alert { background: #fff8e7; border-left: 4px solid #D4AF37; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 30px; }
    .alert h2 { color: #1a1a1a; font-size: 18px; margin: 0 0 6px; }
    .alert p { color: #555; font-size: 13px; margin: 0; }
    .ref { color: #D4AF37; font-weight: 700; }
    .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #999; margin: 24px 0 12px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 10px 0; vertical-align: top; font-size: 14px; border-bottom: 1px solid #f0f0f0; }
    td:first-child { color: #888; width: 140px; font-size: 13px; }
    td:last-child { color: #1a1a1a; font-weight: 500; }
    .highlight-row td { background: #fafafa; padding: 12px 8px; }
    .session-badge { display: inline-block; background: linear-gradient(135deg, #D4AF37, #c9a227); color: #111; padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; }
    .footer { background: #1a1a1a; padding: 30px 40px; text-align: center; }
    .footer p { color: rgba(255,255,255,0.4); font-size: 12px; margin: 0 0 6px; }
    .footer a { color: #D4AF37; text-decoration: none; }
    .action-btn { display: inline-block; background: #D4AF37; color: #111; padding: 12px 28px; border-radius: 6px; font-weight: 700; font-size: 14px; text-decoration: none; letter-spacing: 0.5px; margin-top: 24px; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>Pure Lifestyle Yoga</h1>
    <p>your path to pure bliss</p>
    <div class="badge">🌿 New Discovery Session Inquiry</div>
  </div>
  <div class="body">
    <div class="alert">
      <h2>New Booking Inquiry Received</h2>
      <p>A new client has requested a Discovery Session. Reference: <span class="ref">#PLY-${String(id).padStart(4, '0')}</span></p>
    </div>

    <div class="section-title">Client Information</div>
    <table>
      <tr><td>Full Name</td><td>${data.name}</td></tr>
      <tr><td>Phone</td><td>${data.phone}</td></tr>
      <tr><td>Email</td><td>${data.email}</td></tr>
      <tr><td>Address</td><td>${data.address}</td></tr>
    </table>

    <div class="section-title">Session Details</div>
    <table>
      <tr class="highlight-row">
        <td>Session Type</td>
        <td><span class="session-badge">${data.session_type}</span></td>
      </tr>
      <tr><td>Preferred Time</td><td>${data.preferred_datetime || 'Not specified'}</td></tr>
      <tr><td>Wellness Goal</td><td>${data.wellness_goal || 'Not specified'}</td></tr>
    </table>

    <div class="section-title">Inquiry Meta</div>
    <table>
      <tr><td>Reference ID</td><td class="ref">#PLY-${String(id).padStart(4, '0')}</td></tr>
      <tr><td>Received At</td><td>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td></tr>
      <tr><td>Status</td><td>New — Awaiting Review</td></tr>
    </table>

    <div style="text-align:center;">
      <a href="${baseUrl}/admin" class="action-btn">View in Admin Dashboard →</a>
    </div>
  </div>
  <div class="footer">
    <p>Pure Lifestyle Yoga Pvt. Ltd. | Gurugram & Delhi NCR</p>
    <p><a href="mailto:purelifestyleyogaofficial@gmail.com">purelifestyleyogaofficial@gmail.com</a> | <a href="tel:+919310379955">+91 93103 79955</a></p>
    <p style="margin-top:12px;">This email was automatically generated by the Pure Lifestyle Yoga inquiry system.</p>
  </div>
</div>
</body>
</html>
  `;
}

function generateClientEmail(data, id) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Georgia, serif; background: #f8f4ee; margin: 0; padding: 0; }
    .wrapper { max-width: 640px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 40px 30px; text-align: center; }
    .header h1 { color: #D4AF37; font-size: 22px; margin: 0 0 6px; letter-spacing: 2px; text-transform: uppercase; }
    .header p { color: rgba(255,255,255,0.6); font-size: 13px; margin: 0; font-style: italic; }
    .body { padding: 40px; }
    .hero-msg { text-align: center; padding: 20px 0 30px; }
    .hero-msg h2 { font-size: 26px; color: #1a1a1a; margin: 0 0 10px; }
    .hero-msg p { color: #666; font-size: 15px; line-height: 1.7; }
    .gold-line { width: 60px; height: 2px; background: #D4AF37; margin: 16px auto; }
    .ref-box { background: linear-gradient(135deg, #1a1a1a, #2d2d2d); border-radius: 12px; padding: 20px 28px; text-align: center; margin: 24px 0; }
    .ref-box p { color: rgba(255,255,255,0.6); font-size: 12px; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 6px; }
    .ref-box h3 { color: #D4AF37; font-size: 24px; margin: 0; letter-spacing: 2px; }
    .summary-box { background: #fafafa; border: 1px solid #eee; border-radius: 12px; padding: 24px; margin: 24px 0; }
    .summary-box h4 { font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #999; margin: 0 0 16px; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 8px 0; font-size: 14px; border-bottom: 1px solid #f0f0f0; }
    td:first-child { color: #888; width: 130px; }
    td:last-child { color: #1a1a1a; font-weight: 500; }
    .what-next { margin: 30px 0; }
    .step { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 16px; }
    .step-num { width: 32px; height: 32px; min-width: 32px; background: #D4AF37; color: #111; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; }
    .step-text h5 { margin: 0 0 4px; font-size: 14px; color: #1a1a1a; }
    .step-text p { margin: 0; font-size: 13px; color: #777; }
    .cta-box { background: linear-gradient(135deg, #D4AF37, #c9a227); border-radius: 12px; padding: 28px; text-align: center; margin: 30px 0; }
    .cta-box h3 { color: #111; margin: 0 0 8px; font-size: 18px; }
    .cta-box p { color: rgba(0,0,0,0.6); font-size: 13px; margin: 0 0 18px; }
    .cta-btn { display: inline-block; background: #111; color: #D4AF37; padding: 12px 28px; border-radius: 6px; font-weight: 700; font-size: 14px; text-decoration: none; }
    .footer { background: #1a1a1a; padding: 30px 40px; text-align: center; }
    .footer p { color: rgba(255,255,255,0.4); font-size: 12px; margin: 0 0 6px; }
    .footer a { color: #D4AF37; text-decoration: none; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>Pure Lifestyle Yoga</h1>
    <p>your path to pure bliss</p>
  </div>
  <div class="body">
    <div class="hero-msg">
      <h2>Your Journey Begins, ${data.name.split(' ')[0]}. 🌿</h2>
      <div class="gold-line"></div>
      <p>Thank you for requesting a Discovery Session with Pure Lifestyle Yoga. We've received your inquiry and our team will reach out within 24 hours to confirm your appointment.</p>
    </div>

    <div class="ref-box">
      <p>Your Reference Number</p>
      <h3>#PLY-${String(id).padStart(4, '0')}</h3>
    </div>

    <div class="summary-box">
      <h4>Your Inquiry Summary</h4>
      <table>
        <tr><td>Session Type</td><td>${data.session_type}</td></tr>
        <tr><td>Preferred Time</td><td>${data.preferred_datetime || 'To be confirmed'}</td></tr>
        <tr><td>Address</td><td>${data.address}</td></tr>
        <tr><td>Wellness Goal</td><td>${data.wellness_goal || 'To be discussed'}</td></tr>
      </table>
    </div>

    <div class="what-next">
      <h4 style="font-size:12px; text-transform:uppercase; letter-spacing:2px; color:#999; margin:0 0 16px;">What Happens Next</h4>
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-text"><h5>Personal Review</h5><p>Master Samresh's team reviews your profile and goals personally.</p></div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-text"><h5>Confirmation Call</h5><p>We'll call you within 24 hours to confirm your Discovery Session.</p></div>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <div class="step-text"><h5>Your First Session</h5><p>Experience a private wellness assessment — completely personalized for you.</p></div>
      </div>
    </div>

    <div class="cta-box">
      <h3>Need Immediate Assistance?</h3>
      <p>WhatsApp us and we'll respond within minutes.</p>
      <a href="https://wa.me/919310379955" class="cta-btn">WhatsApp: +91 93103 79955</a>
    </div>
  </div>
  <div class="footer">
    <p>Pure Lifestyle Yoga Pvt. Ltd. | Gurugram & Delhi NCR</p>
    <p><a href="mailto:purelifestyleyogaofficial@gmail.com">purelifestyleyogaofficial@gmail.com</a> | <a href="tel:+919310379955">+91 93103 79955</a></p>
  </div>
</div>
</body>
</html>
  `;
}

function generateTeacherInquiryEmail(data, id) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Georgia, serif; background: #f8f4ee; margin: 0; padding: 0; }
    .wrapper { max-width: 640px; margin: 0 auto; background: #ffffff; }
    .header { background: linear-gradient(135deg, #111 0%, #333 100%); padding: 40px; text-align: center; }
    .header h1 { color: #D4AF37; font-size: 22px; margin: 0; letter-spacing: 2px; text-transform: uppercase; }
    .badge { display: inline-block; background: #D4AF37; color: #111; padding: 4px 16px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-top: 14px; }
    .body { padding: 40px; }
    .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #999; margin: 24px 0 12px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 10px 0; vertical-align: top; font-size: 14px; border-bottom: 1px solid #f0f0f0; }
    td:first-child { color: #888; width: 140px; }
    td:last-child { color: #1a1a1a; font-weight: 500; }
    .footer { background: #1a1a1a; padding: 30px 40px; text-align: center; color: rgba(255,255,255,0.4); font-size: 12px; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header"><h1>Pure Lifestyle Yoga</h1><div class="badge">🌸 New Teacher Application</div></div>
  <div class="body">
    <div class="section-title">Applicant Details</div>
    <table>
      <tr><td>Name</td><td>${data.name}</td></tr>
      <tr><td>Phone</td><td>${data.phone}</td></tr>
      <tr><td>Email</td><td>${data.email}</td></tr>
    </table>
    <div class="section-title">Professional Background</div>
    <table>
      <tr><td>Experience</td><td>${data.experience}</td></tr>
      <tr><td>Specialization</td><td>${data.specialization}</td></tr>
      <tr><td>About/Bio</td><td>${data.bio || 'N/A'}</td></tr>
    </table>
    <div class="section-title">Meta</div>
    <table>
      <tr><td>Ref ID</td><td>#PLY-TCH-${String(id).padStart(4, '0')}</td></tr>
      <tr><td>Applied At</td><td>${new Date().toLocaleString()}</td></tr>
    </table>
  </div>
  <div class="footer">Pure Lifestyle Yoga Pvt. Ltd. | Your Path to Pure Bliss</div>
</div>
</body>
</html>`;
}

function generateTeacherConfirmationEmail(data, id) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Georgia, serif; background: #f8f4ee; margin: 0; padding: 0; }
    .wrapper { max-width: 640px; margin: 0 auto; background: #ffffff; }
    .header { background: #1a1a1a; padding: 40px; text-align: center; }
    .header h1 { color: #D4AF37; font-size: 20px; margin: 0; text-transform: uppercase; letter-spacing: 2px; }
    .body { padding: 40px; text-align: center; }
    .gold-line { width: 50px; height: 2px; background: #D4AF37; margin: 20px auto; }
    h2 { font-size: 24px; color: #111; margin-bottom: 10px; }
    p { color: #666; font-size: 15px; line-height: 1.6; }
    .ref { font-weight: 700; color: #D4AF37; }
    .footer { background: #1a1a1a; padding: 30px; text-align: center; color: rgba(255,255,255,0.4); font-size: 11px; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header"><h1>Pure Lifestyle Yoga</h1></div>
  <div class="body">
    <h2>Application Received 🌸</h2>
    <div class="gold-line"></div>
    <p>Namaste ${data.name.split(' ')[0]},</p>
    <p>Thank you for your interest in joining the Pure Lifestyle Yoga teaching team. We have received your application (Ref: <span class="ref">#PLY-TCH-${String(id).padStart(4, '0')}</span>).</p>
    <p>Our recruitment team reviews every profile with great care. If your expertise aligns with our premium standards, we will contact you within 5-7 business days for an initial conversation.</p>
    <p>Until then, keep sharing the light of yoga.</p>
  </div>
  <div class="footer">© 2024 Pure Lifestyle Yoga Pvt. Ltd. | Careers</div>
</div>
</body>
</html>`;
}

function generateContactInquiryEmail(data, id) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Georgia, serif; background: #f8f4ee; margin: 0; padding: 0; }
    .wrapper { max-width: 640px; margin: 0 auto; background: #ffffff; }
    .header { background: #1a1a1a; padding: 40px; text-align: center; }
    .header h1 { color: #D4AF37; font-size: 22px; margin: 0; letter-spacing: 2px; text-transform: uppercase; }
    .badge { display: inline-block; background: #D4AF37; color: #111; padding: 4px 16px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-top: 14px; }
    .body { padding: 40px; }
    .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #999; margin: 24px 0 12px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 10px 0; vertical-align: top; font-size: 14px; border-bottom: 1px solid #f0f0f0; }
    td:first-child { color: #888; width: 140px; }
    td:last-child { color: #1a1a1a; font-weight: 500; }
    .footer { background: #1a1a1a; padding: 30px 40px; text-align: center; color: rgba(255,255,255,0.4); font-size: 12px; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header"><h1>Pure Lifestyle Yoga</h1><div class="badge">✉️ New Contact Message</div></div>
  <div class="body">
    <div class="section-title">Sender Details</div>
    <table>
      <tr><td>Name</td><td>${data.name}</td></tr>
      <tr><td>Phone</td><td>${data.phone}</td></tr>
      <tr><td>Email</td><td>${data.email}</td></tr>
    </table>
    <div class="section-title">Message Details</div>
    <table>
      <tr><td>Subject</td><td>${data.subject || 'General Enquiry'}</td></tr>
      <tr><td>Message</td><td>${data.message || '—'}</td></tr>
      <tr><td>Preferred Time</td><td>${data.preferred_datetime || '—'}</td></tr>
      <tr><td>Goal</td><td>${data.wellness_goal || '—'}</td></tr>
    </table>
    <div class="section-title">Meta</div>
    <table>
      <tr><td>Ref ID</td><td>#PLY-MSG-${String(id).padStart(4, '0')}</td></tr>
      <tr><td>Received At</td><td>${new Date().toLocaleString()}</td></tr>
    </table>
  </div>
  <div class="footer">Pure Lifestyle Yoga Pvt. Ltd. | Customer Support</div>
</div>
</body>
</html>`;
}

function generateContactConfirmationEmail(data, id) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Georgia, serif; background: #f8f4ee; margin: 0; padding: 0; }
    .wrapper { max-width: 640px; margin: 0 auto; background: #ffffff; }
    .header { background: #1a1a1a; padding: 40px; text-align: center; }
    .header h1 { color: #D4AF37; font-size: 20px; margin: 0; text-transform: uppercase; letter-spacing: 2px; }
    .body { padding: 40px; text-align: center; }
    .gold-line { width: 50px; height: 2px; background: #D4AF37; margin: 20px auto; }
    h2 { font-size: 24px; color: #111; margin-bottom: 10px; }
    p { color: #666; font-size: 15px; line-height: 1.6; }
    .ref { font-weight: 700; color: #D4AF37; }
    .footer { background: #1a1a1a; padding: 30px; text-align: center; color: rgba(255,255,255,0.4); font-size: 11px; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header"><h1>Pure Lifestyle Yoga</h1></div>
  <div class="body">
    <h2>Message Received ✉️</h2>
    <div class="gold-line"></div>
    <p>Namaste ${data.name.split(' ')[0]},</p>
    <p>Thank you for reaching out to Pure Lifestyle Yoga. We have received your message (Ref: <span class="ref">#PLY-MSG-${String(id).padStart(4, '0')}</span>).</p>
    <p>Our team will review your enquiry and get back to you within 24 hours.</p>
    <p>We look forward to connecting with you soon.</p>
  </div>
  <div class="footer">© 2024 Pure Lifestyle Yoga Pvt. Ltd.</div>
</div>
</body>
</html>`;
}

// ─── API Routes ───────────────────────────────────────────────

// Public: Get all blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const result = await db.execute('SELECT id, title, summary, image_url, author, created_at FROM blogs ORDER BY created_at DESC');
    res.json({ success: true, blogs: result.rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Public: Get single blog
app.get('/api/blogs/:id', async (req, res) => {
  try {
    const result = await db.execute({ sql: 'SELECT * FROM blogs WHERE id = ?', args: [req.params.id] });
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, blog: result.rows[0] });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Admin: Get all blogs (with content)
app.get('/api/admin/blogs', adminAuth, async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM blogs ORDER BY created_at DESC');
    res.json({ success: true, blogs: result.rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Admin: Create blog
app.post('/api/admin/blogs', adminAuth, async (req, res) => {
  const { title, summary, content, image_url, author } = req.body;
  if (!title || !content) return res.status(400).json({ success: false, message: 'Title and content required.' });
  try {
    const result = await db.execute({
      sql: 'INSERT INTO blogs (title, summary, content, image_url, author) VALUES (?, ?, ?, ?, ?)',
      args: [title, summary || '', content, image_url || '', author || 'Admin']
    });
    res.json({ success: true, id: Number(result.lastInsertRowid) });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Admin: Update blog
app.patch('/api/admin/blogs/:id', adminAuth, async (req, res) => {
  const { title, summary, content, image_url, author } = req.body;
  try {
    await db.execute({
      sql: `UPDATE blogs SET title = COALESCE(?, title), summary = COALESCE(?, summary), content = COALESCE(?, content), image_url = COALESCE(?, image_url), author = COALESCE(?, author), updated_at = datetime('now') WHERE id = ?`,
      args: [title, summary, content, image_url, author, req.params.id]
    });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Admin: Delete blog
app.delete('/api/admin/blogs/:id', adminAuth, async (req, res) => {
  try {
    await db.execute({ sql: 'DELETE FROM blogs WHERE id = ?', args: [req.params.id] });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Submit booking inquiry
app.post('/api/inquiries', async (req, res) => {
  const { name, phone, email, address, session, preferred_datetime, goal } = req.body;

  if (!name || !phone || !email || !address || !session) {
    return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
  }

  try {
    const result = await db.execute({
      sql: 'INSERT INTO inquiries (name, phone, email, address, session_type, preferred_datetime, wellness_goal) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: [name, phone, email, address, session, preferred_datetime || '', goal || '']
    });
    const id = Number(result.lastInsertRowid);

    // Send emails (non-blocking)
    const mailData = { name, phone, email, address, session_type: session, preferred_datetime, wellness_goal: goal };

    const sender = {
      name: process.env.BREVO_SENDER_NAME,
      email: process.env.BREVO_SENDER_EMAIL
    }

    const sendAdminEmail = new brevo.SendSmtpEmail();
    sendAdminEmail.subject = `🌿 New Discovery Session Inquiry #PLY-${String(id).padStart(4, '0')} — ${name}`;
    sendAdminEmail.htmlContent = generateInquiryEmail(mailData, id, req.get('host'));
    sendAdminEmail.sender = sender;
    sendAdminEmail.to = [{ email: process.env.ADMIN_EMAIL }];

    apiInstance.sendTransacEmail(sendAdminEmail).then(
      function (data) {
        console.log('Admin email sent successfully.');
      },
      function (error) {
        console.error('Admin email error:', error);
      }
    );

    const sendClientEmail = new brevo.SendSmtpEmail();
    sendClientEmail.subject = `Your Discovery Session Inquiry Received — Ref #PLY-${String(id).padStart(4, '0')}`;
    sendClientEmail.htmlContent = generateClientEmail(mailData, id);
    sendClientEmail.sender = sender;
    sendClientEmail.to = [{ email: email }];

    apiInstance.sendTransacEmail(sendClientEmail).then(
      function (data) {
        console.log('Client email sent successfully.');
      },
      function (error) {
        console.error('Client email error:', error);
      }
    );

    res.json({ success: true, id, ref: `PLY-${String(id).padStart(4, '0')}` });
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// Submit teacher application
app.post('/api/teacher-applications', async (req, res) => {
  const { name, phone, email, experience, specialization, bio } = req.body;

  if (!name || !phone || !email || !experience || !specialization) {
    return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
  }

  try {
    const result = await db.execute({
      sql: 'INSERT INTO teacher_applications (name, phone, email, experience, specialization, bio) VALUES (?, ?, ?, ?, ?, ?)',
      args: [name, phone, email, experience, specialization, bio || '']
    });
    const id = Number(result.lastInsertRowid);

    const mailData = { name, phone, email, experience, specialization, bio };
    const sender = { name: process.env.BREVO_SENDER_NAME, email: process.env.BREVO_SENDER_EMAIL };

    // Admin Notification
    const sendAdminEmail = new brevo.SendSmtpEmail();
    sendAdminEmail.subject = `🌸 New Teacher Application #PLY-TCH-${String(id).padStart(4, '0')} — ${name}`;
    sendAdminEmail.htmlContent = generateTeacherInquiryEmail(mailData, id);
    sendAdminEmail.sender = sender;
    sendAdminEmail.to = [{ email: process.env.ADMIN_EMAIL }];
    apiInstance.sendTransacEmail(sendAdminEmail).catch(e => console.error('Teacher Admin Email Error:', e));

    // Client Confirmation
    const sendClientEmail = new brevo.SendSmtpEmail();
    sendClientEmail.subject = `Application Received — Pure Lifestyle Yoga Teaching Team`;
    sendClientEmail.htmlContent = generateTeacherConfirmationEmail(mailData, id);
    sendClientEmail.sender = sender;
    sendClientEmail.to = [{ email: email }];
    apiInstance.sendTransacEmail(sendClientEmail).catch(e => console.error('Teacher Client Email Error:', e));

    res.json({ success: true, id, ref: `PLY-TCH-${String(id).padStart(4, '0')}` });
  } catch (err) {
    console.error('Teacher App DB error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// Submit contact form
app.post('/api/contacts', async (req, res) => {
  const { name, phone, email, subject, message, preferred_datetime, goal } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
  }

  try {
    const result = await db.execute({
      sql: 'INSERT INTO contacts (name, phone, email, subject, message, preferred_datetime, wellness_goal) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: [name, phone, email, subject || '', message || '', preferred_datetime || '', goal || '']
    });
    const id = Number(result.lastInsertRowid);

    const mailData = { name, phone, email, subject, message, preferred_datetime, wellness_goal: goal };
    const sender = { name: process.env.BREVO_SENDER_NAME, email: process.env.BREVO_SENDER_EMAIL };

    // Admin Notification
    const sendAdminEmail = new brevo.SendSmtpEmail();
    sendAdminEmail.subject = `✉️ New Contact Message #PLY-MSG-${String(id).padStart(4, '0')} — ${name}`;
    sendAdminEmail.htmlContent = generateContactInquiryEmail(mailData, id);
    sendAdminEmail.sender = sender;
    sendAdminEmail.to = [{ email: process.env.ADMIN_EMAIL }];
    apiInstance.sendTransacEmail(sendAdminEmail).catch(e => console.error('Contact Admin Email Error:', e));

    // Client Confirmation
    const sendClientEmail = new brevo.SendSmtpEmail();
    sendClientEmail.subject = `Message Received — Pure Lifestyle Yoga`;
    sendClientEmail.htmlContent = generateContactConfirmationEmail(mailData, id);
    sendClientEmail.sender = sender;
    sendClientEmail.to = [{ email: email }];
    apiInstance.sendTransacEmail(sendClientEmail).catch(e => console.error('Contact Client Email Error:', e));

    res.json({ success: true, id, ref: `PLY-MSG-${String(id).padStart(4, '0')}` });
  } catch (err) {
    console.error('Contact DB error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// Admin: Simple auth check
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    res.json({ success: true, token: Buffer.from(`${username}:${password}`).toString('base64') });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }
});

// Admin: Get all inquiries
app.get('/api/admin/inquiries', adminAuth, async (req, res) => {
  const { status, search, sort = 'created_at', order = 'desc' } = req.query;
  let query = 'SELECT * FROM inquiries WHERE 1=1';
  const args = [];

  if (status && status !== 'all') {
    query += ' AND status = ?';
    args.push(status);
  }
  if (search) {
    query += ' AND (name LIKE ? OR phone LIKE ? OR email LIKE ? OR address LIKE ?)';
    const s = `%${search}%`;
    args.push(s, s, s, s);
  }

  const validSort = ['created_at', 'name', 'status', 'session_type'];
  const sortCol = validSort.includes(sort) ? sort : 'created_at';
  query += ` ORDER BY ${sortCol} ${order === 'asc' ? 'ASC' : 'DESC'}`;

  try {
    const [rowsResult, statsResult] = await Promise.all([
      db.execute({ sql: query, args }),
      db.execute(`SELECT COUNT(*) as total, SUM(CASE WHEN status='New' THEN 1 ELSE 0 END) as newCount, SUM(CASE WHEN status='Contacted' THEN 1 ELSE 0 END) as contacted, SUM(CASE WHEN status='Converted' THEN 1 ELSE 0 END) as converted, SUM(CASE WHEN status='Not Interested' THEN 1 ELSE 0 END) as notInterested FROM inquiries`)
    ]);
    res.json({ success: true, inquiries: rowsResult.rows, stats: statsResult.rows[0] });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Admin: Get single inquiry
app.get('/api/admin/inquiries/:id', adminAuth, async (req, res) => {
  try {
    const result = await db.execute({ sql: 'SELECT * FROM inquiries WHERE id = ?', args: [req.params.id] });
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, inquiry: result.rows[0] });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Admin: Update inquiry status / notes
app.patch('/api/admin/inquiries/:id', adminAuth, async (req, res) => {
  const { status, notes } = req.body;
  const allowed = ['New', 'Contacted', 'Converted', 'Not Interested', 'Pending'];
  if (status && !allowed.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status.' });
  }
  try {
    await db.execute({
      sql: `UPDATE inquiries SET status = COALESCE(?, status), notes = COALESCE(?, notes), updated_at = datetime('now') WHERE id = ?`,
      args: [status || null, notes !== undefined ? notes : null, req.params.id]
    });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Admin: Delete inquiry
app.delete('/api/admin/inquiries/:id', adminAuth, async (req, res) => {
  try {
    await db.execute({ sql: 'DELETE FROM inquiries WHERE id = ?', args: [req.params.id] });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Admin: Export CSV
app.get('/api/admin/export', adminAuth, async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM inquiries ORDER BY created_at DESC');
    const rows = result.rows;
    const header = 'ID,Name,Phone,Email,Address,Session Type,Preferred Date/Time,Wellness Goal,Status,Notes,Created At\n';
    const csv = header + rows.map(r =>
      [r.id, r.name, r.phone, r.email, `"${r.address}"`, r.session_type, r.preferred_datetime, r.wellness_goal, r.status, `"${r.notes}"`, r.created_at].join(',')
    ).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=PLY_Inquiries.csv');
    res.send(csv);
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Admin: Get all teacher applications
app.get('/api/admin/teachers', adminAuth, async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM teacher_applications ORDER BY created_at DESC');
    res.json({ success: true, applications: result.rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Admin: Update teacher application status
app.patch('/api/admin/teachers/:id', adminAuth, async (req, res) => {
  const { status, notes } = req.body;
  try {
    await db.execute({
      sql: `UPDATE teacher_applications SET status = COALESCE(?, status), notes = COALESCE(?, notes), updated_at = datetime('now') WHERE id = ?`,
      args: [status || null, notes !== undefined ? notes : null, req.params.id]
    });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Admin: Delete teacher application
app.delete('/api/admin/teachers/:id', adminAuth, async (req, res) => {
  try {
    await db.execute({ sql: 'DELETE FROM teacher_applications WHERE id = ?', args: [req.params.id] });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Admin: Get all contact messages
app.get('/api/admin/contacts', adminAuth, async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json({ success: true, contacts: result.rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Admin: Update contact message status
app.patch('/api/admin/contacts/:id', adminAuth, async (req, res) => {
  const { status, notes } = req.body;
  try {
    await db.execute({
      sql: `UPDATE contacts SET status = COALESCE(?, status), notes = COALESCE(?, notes), updated_at = datetime('now') WHERE id = ?`,
      args: [status || null, notes !== undefined ? notes : null, req.params.id]
    });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Admin: Delete contact message
app.delete('/api/admin/contacts/:id', adminAuth, async (req, res) => {
  try {
    await db.execute({ sql: 'DELETE FROM contacts WHERE id = ?', args: [req.params.id] });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ─── Auth Middleware ──────────────────────────────────────────
function adminAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ success: false, message: 'Unauthorized' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [u, p] = decoded.split(':');
    if (u === process.env.ADMIN_USER && p === process.env.ADMIN_PASS) return next();
    res.status(401).json({ success: false, message: 'Unauthorized' });
  } catch {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
}

// ─── Serve Admin Dashboard ────────────────────────────────────
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// Export the app for Vercel Serverless Functions
module.exports = app;

// Start server (only if running locally)
if (require.main === module) {
  async function start() {
    try {
      await initDB();
      app.listen(PORT, () => {
        console.log(`\n🌿 Pure Lifestyle Yoga Server running at http://localhost:${PORT}`);
        console.log(`📊 Admin Dashboard: http://localhost:${PORT}/admin`);
        console.log(`📋 API: http://localhost:${PORT}/api/inquiries\n`);
      });
    } catch (err) {
      console.error('❌ Failed to connect to database:', err.message);
      process.exit(1);
    }
  }
  start();
} else {
  // If imported by Vercel, run initDB asynchronously
  initDB().catch(console.error);
}
