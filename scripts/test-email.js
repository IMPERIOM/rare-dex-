const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

// 1. Manually parse .env.local to preserve exact quotes & characters
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) return;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  });
}

const host = process.env.SMTP_HOST || "mail.raredexcards.com";
const port = parseInt(process.env.SMTP_PORT || "465", 10);
const secure = process.env.SMTP_SECURE === "true";
const user = process.env.SMTP_USER || "info@raredexcards.com";
const pass = process.env.SMTP_PASS || "";
const to = process.env.ADMIN_EMAIL || user;

console.log("=========================================");
console.log("      EMAIL DIAGNOSTIC & TEST SCRIPT     ");
console.log("=========================================");
console.log(`SMTP Host:     ${host}`);
console.log(`SMTP Port:     ${port}`);
console.log(`SSL/Secure:    ${secure}`);
console.log(`SMTP User:     ${user}`);
console.log(`SMTP Pass Len: ${pass.length} chars`);
console.log(`Recipient:     ${to}`);
console.log("-----------------------------------------\n");

async function runTest(testPort, testSecure, label) {
  console.log(`[Testing Config ${label}] Port: ${testPort}, Secure: ${testSecure}...`);
  const transporter = nodemailer.createTransport({
    host,
    port: testPort,
    secure: testSecure,
    auth: { user, pass },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    await transporter.verify();
    console.log(`✅ [SUCCESS] Credentials verified on Port ${testPort}!`);
    console.log(`Sending test email to ${to}...`);
    const info = await transporter.sendMail({
      from: `"RareDexCards Test" <${user}>`,
      to,
      subject: "Test Email — RareDexCards Setup",
      text: "If you are reading this email, your cPanel SMTP email configuration is working perfectly!",
      html: "<h3>Email Test Successful!</h3><p>Your cPanel SMTP settings are working correctly.</p>"
    });
    console.log(`🎉 EMAIL SENT SUCCESSFULLY! MessageId: ${info.messageId}\n`);
    return true;
  } catch (err) {
    console.error(`❌ [FAILED] Port ${testPort} (${label}):`, err.message, "\n");
    return false;
  }
}

async function main() {
  // Test current env config first
  const ok1 = await runTest(port, secure, "Current .env.local setting");
  if (!ok1) {
    // Fallback test: Try Port 587 with STARTTLS (common for cPanel)
    console.log("Attempting fallback test on Port 587 (TLS/STARTTLS)...");
    await runTest(587, false, "Port 587 TLS");
  }
}

main();
