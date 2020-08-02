import yaml from "js-yaml";

import { Repository } from "./interfaces";
import locale from "./locale";

export default class Utils {
  static loadConfig(content: string) {
    return yaml.load(content);
  }

  static toRepository(target: string): Repository | undefined {
    const [owner, name] = target.split("/");
    if (owner && name) {
      return <Repository>{
        owner,
        name,
      };
    }
    return undefined;
  }

  static toHtml(lang: string, repo: Repository): string {
    const html: string[] = [];
    html.push(
      `<p>- <a href="https://github.com/${repo.owner}/${repo.name}">${repo.owner}/${repo.name} (${repo.commits?.length})</a></p>`
    );
    if (repo.commits && repo.commits.length) {
      html.push("<ul>");
      for (const commit of repo.commits) {
        html.push(
          "<li>",
          `<p><a href="${commit.url}">${commit.message}</a></p>`,
          `<p>${commit.author.name}</p>`,
          "</li>"
        );
      }
      html.push("</ul>");
    } else {
      html.push(`<p>${locale(lang).msg_no_commits}</p>`);
    }
    return html.join("");
  }
}
