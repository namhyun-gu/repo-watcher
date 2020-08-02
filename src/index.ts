import { config } from "dotenv";
import moment from "moment";

import { GithubServiceImpl } from "./services";
import { Notification, Repository, GithubService } from "./interfaces";
import { MailNotification } from "./notification/mail";
import Utils from "./utils";

config();

const {
  GIST_ID: gistId,
  SMTP_USER: smtpUser,
  SMTP_PW: smtpPassword,
} = process.env;

async function main() {
  const github = new GithubServiceImpl();
  const watcher = new RepoWatcher(github);

  const gist = await github.getGist(gistId!);
  const config = Utils.loadConfig(gist.files[0].content!);

  const lang = config.lang;
  moment.locale(lang);

  if (config.notification.mail) {
    const {
      smtpService,
      smtpHost,
      smtpPort,
      senderMail,
      receiverMail,
    } = config.notification.mail;

    const mailNotification = new MailNotification({
      configs: {
        lang: lang,
        smtpService: smtpService,
        smtpHost: smtpHost,
        smtpPort: parseInt(smtpPort),
        senderMail: senderMail,
        receiverMail: receiverMail,
      },
      envs: {
        smtpUser: smtpUser!,
        smtpPassword: smtpPassword!,
      },
    });

    watcher.registerNotification(mailNotification);
  }

  const repos: Repository[] = config.targets
    .map((target: string) => Utils.toRepository(target))
    .filter((repo: Repository | undefined) => repo);

  await watcher.fetchRepos(repos);
  await watcher.notify();
}

class RepoWatcher {
  private notifications: Notification<any>[] = [];
  private github: GithubService;
  private repos: Repository[];

  constructor(github: GithubService) {
    this.github = github;
    this.repos = [];
  }

  registerNotification(notification: Notification<any>) {
    this.notifications.push(notification);
  }

  async fetchRepos(repos: Repository[]) {
    await Promise.all(
      repos.map(async (repo) => {
        const commits = await this.github.listCommits(repo.owner, repo.name);
        repo.commits = commits;
      })
    );
    this.repos = repos;
  }

  async notify() {
    for (let notification of this.notifications) {
      await notification.notify(this.repos);
    }
  }
}

main().catch(console.error);
