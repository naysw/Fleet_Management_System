import { createTestAccount, createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export class Mail {
  constructor(
    private from: string,
    private to: string | string[],
    private subject: string,
    private text: string,
    private html: string,
  ) {
    //
  }

  /**
   * send email
   *
   * @returns Promise<SMTPTransport.SentMessageInfo>
   */
  async send(): Promise<SMTPTransport.SentMessageInfo> {
    const testAccount = await createTestAccount();

    const transporter = createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: this.from,
      to:
        typeof this.to === "string" && !Array.isArray(this.to)
          ? this.to
          : this.to.join(","),
      subject: this.subject,
      text: this.text,
      html: this.html,
    });

    console.log("Message sent: %s", info.messageId);
  }
}
