import { isNil, pull } from "lodash";
import * as githubSdk from "@actions/github";
import { Context } from "./context";
import { invariant } from "./invariant";

export type PRInfo = {
  branch: string;
  title: string;
  repo: string;
  owner: string;
  number: number;
};

export const getPR = async ({ github }: Context) => {
  const { number: prNumber, repository } = githubSdk.context.payload;
  invariant(!!repository, "Repository not set");

  const { data: pullRequest } = await github.rest.pulls.get({
    repo: repository.name,
    owner: repository.owner.login,
    pull_number: prNumber,
  });
  // `.head.repo` can be null.
  // Reference: https://github.com/octokit/rest.js/issues/31#issue-860734069
  invariant(
    !!pullRequest.head.repo,
    `PR is sourced from an "unknown repository"`
  );

  return {
    branch: pullRequest.head.ref,
    title: pullRequest.title,
    repo: pullRequest.head.repo.name,
    owner: pullRequest.head.repo.owner.login,
    number: pullRequest.number,
  };
};

export const updatePRTitle = async (
  { github }: Context,
  pr: PRInfo,
  title: string
) => {
  await github.rest.pulls.update({
    repo: pr.repo,
    owner: pr.owner,
    pull_number: pr.number,
    title,
  });
};
