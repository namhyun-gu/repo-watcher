import { config } from "dotenv";
import moment from "moment";

import { GithubService } from "./services";
import { Notification, Repository, Commit } from "./interfaces";
import { MailNotification } from "./notification/mail";
import Utils from "./utils";

config();

const {
  GIST_ID: gistId,
  SMTP_USER: smtpUser,
  SMTP_PW: smtpPassword,
} = process.env;

async function main() {
  const github = new GithubService();
  const watcher = new RepoWatcher(github);

  const gist = await github.getGist(gistId!);
  const config = Utils.loadConfig(gist?.content!);

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
        repo.commits = commits?.map((it) => {
          const data = it.commit;
          const author = data.author;
          const committer = data.committer;

          return <Commit>{
            author,
            committer,
            message: data.message,
            url: it.html_url,
          };
        });
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
