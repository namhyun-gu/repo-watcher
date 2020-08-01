import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import moment from "moment";

import { Notification, Repository, NotificationArgument } from "../interfaces";
import Utils from "../utils";
import locale from "../locale";

interface MailConfig {
  lang: string;
  smtpService: string | undefined;
  smtpHost: string;
  smtpPort: number;
  senderMail: string;
  receiverMail: string;
}

interface MailEnvironment {
  smtpUser: string;
  smtpPassword: string;
}

class MailNotificationArgument extends NotificationArgument<
  MailConfig,
  MailEnvironment
> {}

export class MailNotification extends Notification<MailNotificationArgument> {
  async notify(repos: Repository[]) {
    const { smtpUser, smtpPassword } = this.arg.envs;

    const {
      lang,
      smtpService,
      smtpHost,
      smtpPort,
      senderMail,
      receiverMail,
    } = this.arg.configs;

    const transporter = nodemailer.createTransport({
      service: smtpService,
      host: smtpHost,
      port: smtpPort,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    const subject = `${locale(lang).subject} (${moment().format("MMM Do")})`;
    const content = repos.map((repo) => Utils.toHtml(lang, repo)).join("");

    const options = <Mail.Options>{
      from: senderMail,
      to: receiverMail,
      subject: subject,
      html: content,
    };

    await transporter.sendMail(options);
  }
}
