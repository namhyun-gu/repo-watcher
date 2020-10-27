import { Octokit } from "@octokit/rest";
import moment from "moment";

import { Commit, GithubService, Gist, GistFile } from "./interfaces";

export class GithubServiceImpl implements GithubService {
  private octokit = new Octokit();

  async getGist(gistId: string): Promise<Gist> {
    const gist = await this.octokit.gists.get({
      gist_id: gistId,
    });

    return <Gist>{
      files: Object.keys(gist.data.files).map(
        (filename) =>
          <GistFile>{
            filename,
            content: gist.data.files[filename].content,
          }
      ),
    };
  }

  async listCommits(owner: string, repo: string): Promise<Commit[]> {
    const yesterdayDate = moment()
      .subtract(1, "days")
      .minutes(0)
      .seconds(0)
      .toISOString();

    const commits = await this.octokit.repos.listCommits({
      owner,
      repo,
      since: yesterdayDate,
    });

    return commits.data.map((it) => {
      const commit = it.commit;
      const author = commit.author;
      const committer = commit.committer;

      return <Commit>{
        author,
        committer,
        message: commit.message,
        url: it.html_url,
      };
    });
  }
}
