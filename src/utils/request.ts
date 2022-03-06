import { Octokit } from "@octokit/core";

const octokit = new Octokit();

export function listTree() {
  return octokit.request(
    "https://git.ringcentral.com/api/v4/projects/23114/repository/tree?path=templates",
    {
      headers: {
        accept: "application/vnd.github.v3+json",
      },
    }
  );
}

export function getFile(path: string) {
  return octokit.request(
    `https://git.ringcentral.com/api/v4/projects/23114/repository/files/${path}/raw?ref=master`,
    {
      headers: {
        accept: "application/vnd.github.v3+json",
      },
    }
  );
}

export { octokit };
