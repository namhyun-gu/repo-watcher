import { Octokit } from "@octokit/rest";
import moment from "moment";

export class GithubService {
  private octokit = new Octokit();

  async getGist(gistId: string) {
    try {
      if (gistId) {
        const gist = await this.octokit.gists.get({
          gist_id: gistId,
        });

        const filename = Object.keys(gist.data.files)[0];
        return gist.data.files[filename];
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Unable to get gist\n${error}`);
      return null;
    }
  }

  async listCommits(owner: string, repo: string) {
    try {
      const commits = await this.octokit.repos.listCommits({
        owner,
        repo,
        since: moment().subtract(1, "days").toISOString(),
      });
      return commits.data;
    } catch (error) {
      console.error(`Unable to get commits\n${error}`);
      return null;
    }
  }
}
