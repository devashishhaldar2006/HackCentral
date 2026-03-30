import nodemailer from "nodemailer";
import { ENV } from "./env.js";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `HackCentral <${ENV.EMAIL_USER}>`,
      to,
      subject,
      html, // use HTML instead of plain text
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email Error:", error);
    throw new Error("Email could not be sent");
  }
};



export const getEmailContent = (otp) => `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #6366f1; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 1px;">HackCentral</h1>
        </div>
        <div style="padding: 40px 30px; text-align: center;">
          <h2 style="color: #1f2937; margin-top: 0; font-size: 22px;">Password Reset Request</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">We received a request to reset your HackCentral password. Here is your One-Time Password (OTP):</p>
          <div style="margin: 30px 0; padding: 20px; background-color: #f3f4f6; border: 2px dashed #6366f1; border-radius: 12px; display: inline-block;">
            <span style="font-size: 36px; font-weight: 700; color: #6366f1; letter-spacing: 6px;">${otp}</span>
          </div>
          <p style="color: #ef4444; font-size: 15px; font-weight: 600; margin-top: 20px;">This OTP is valid for 5 minutes.</p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">If you did not request this password reset, please ignore this email or contact support if you have concerns.</p>
        </div>
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          &copy; ${new Date().getFullYear()} HackCentral. All rights reserved.
        </div>
      </div>
    `;
