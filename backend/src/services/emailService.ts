import { Resend } from "resend";
import { getVerificationEmailHtml, getPasswordResetEmailHtml } from "./emailTemplate.js";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendVerificationEmail(email: string, code: string, username: string) {
  const htmlContent = getVerificationEmailHtml(code, username);
  try {
    await resend.emails.send({
      from: "no-reply@cu-oncampus.ca",
      to: email,
      subject: "Verify Your Email - ONCampus",
      html: htmlContent,
    });
    console.log(`✅ Verification email sent to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send verification email:", error);
    throw new Error("Failed to send verification email.");
  }
}

export async function sendPasswordResetEmail(email: string, code: string, username: string) {
  const htmlContent = getPasswordResetEmailHtml(code, username);
  try {
    await resend.emails.send({
      from: "no-reply@cu-oncampus.ca",
      to: email,
      subject: "Reset Your Password - ONCampus",
      html: htmlContent,
    });
    console.log(`✅ Password reset email sent to ${email}`);
  } catch (error) {
    console.error("❌ Failed to send password reset email:", error);
    throw new Error("Failed to send password reset email.");
  }
}
