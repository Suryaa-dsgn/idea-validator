import nodemailer from 'nodemailer';
import { logger } from './logger';

/**
 * Email service using Nodemailer
 * Provides methods to send emails using configured transport
 */
class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Verify connection configuration
    this.transporter.verify((error) => {
      if (error) {
        logger.error('Email service error:', error);
      } else {
        logger.info('Email service ready to send messages');
      }
    });
  }

  /**
   * Send an email
   * @param to Recipient email address
   * @param subject Email subject
   * @param html HTML content of the email
   * @param text Plain text version (optional)
   * @returns Promise resolving to send info
   */
  async sendEmail(
    to: string,
    subject: string,
    html: string,
    text?: string
  ): Promise<nodemailer.SentMessageInfo> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@ideavalidator.com',
        to,
        subject,
        text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML if text not provided
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error('Failed to send email:', error);
      throw error;
    }
  }

  /**
   * Send a welcome email to a new user
   * @param name User's name
   * @param email User's email
   */
  async sendWelcomeEmail(name: string, email: string): Promise<void> {
    const subject = 'Welcome to IdeaValidator!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Welcome to IdeaValidator, ${name}!</h2>
        <p>Thank you for joining our platform. We're excited to help you validate your startup ideas with AI-powered insights.</p>
        <p>Here's what you can do now:</p>
        <ul>
          <li>Enter your startup idea for instant validation</li>
          <li>Get detailed market analysis and feedback</li>
          <li>Refine your concept based on our recommendations</li>
        </ul>
        <p>If you have any questions, simply reply to this email.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 14px; color: #666;">The IdeaValidator Team</p>
        </div>
      </div>
    `;

    await this.sendEmail(email, subject, html);
  }

  /**
   * Send a password reset email
   * @param email User's email
   * @param resetToken Password reset token
   * @param resetUrl URL for password reset
   */
  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    resetUrl: string
  ): Promise<void> {
    const subject = 'Password Reset Request';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Reset Your Password</h2>
        <p>You requested a password reset. Please click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}?token=${resetToken}" 
             style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
        <p>This link will expire in 1 hour for security reasons.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 14px; color: #666;">The IdeaValidator Team</p>
        </div>
      </div>
    `;

    await this.sendEmail(email, subject, html);
  }

  /**
   * Send an idea validation report email
   * @param email User's email
   * @param ideaTitle Title of the validated idea
   * @param score Validation score
   * @param reportUrl URL to view the full report
   */
  async sendValidationReportEmail(
    email: string,
    ideaTitle: string,
    score: number,
    reportUrl: string
  ): Promise<void> {
    const subject = `Your Idea Validation Report: ${ideaTitle}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Your Idea Validation Report</h2>
        <p>We've analyzed your idea: <strong>${ideaTitle}</strong></p>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Validation Score: ${score}%</h3>
          <p>This score represents the overall viability of your idea based on our AI analysis.</p>
        </div>
        <p>To view your complete report with detailed insights and recommendations, click the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${reportUrl}" 
             style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Full Report
          </a>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 14px; color: #666;">The IdeaValidator Team</p>
        </div>
      </div>
    `;

    await this.sendEmail(email, subject, html);
  }
}

// Export a singleton instance
export const emailService = new EmailService(); 