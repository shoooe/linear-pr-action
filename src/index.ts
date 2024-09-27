import * as core from "@actions/core";
import * as github from "@actions/github";
import { Issue, LinearClient } from "@linear/sdk";
import { isNil } from "lodash";
import { getInputs } from "./inputs";

const PR_TITLE_UPDATE_KEYWORD = "x";

type PullRequest = {
  number: number;
  title: string;
  body: string | null;
  head: {
    ref: string;
    repo: {
      name: string;
      owner: {
        login: string;
      };
    } | null;
  };
};

export const getLinearIssueIds = (pullRequest: PullRequest) => {
  const issueIds: string[] = [];

  // From the branch name
  const branchName = pullRequest.head.ref;
  let match = branchName.match(/^([a-z]+\-\d+)\-/);
  if (!isNil(match)) issueIds.push(match[1].toUpperCase());

  // From the PR body
  const body = pullRequest.body ?? "";
  const regexp = /Fixes ([a-z]+\-\d+)|Resolves ([a-z]+\-\d+)/gi;
  const matches = [...body.matchAll(regexp)];

  matches.forEach((match) => {
    const captureMatch = match[1] || match[2];
    issueIds.push(captureMatch.toUpperCase());
  });

  return issueIds;
};

/**
 * @see https://www.conventionalcommits.org/en/v1.0.0/
 */
const getConventionalCommitPrefix = async (issue: Issue) => {
  const labels = await issue.labels();

  const isBug = labels.nodes.some((label) => /bug/i.test(label.name));
  if (isBug) return "fix: ";

  const isChore = labels.nodes.some((label) => /chore/i.test(label.name));
  if (isChore) return "chore: ";

  const isFeature = labels.nodes.some((label) => /feature/i.test(label.name));
  if (isFeature) return "feat: ";

  return null;
};

const getTitleFromIssueId = async (
  linearClient: LinearClient,
  pullRequest: PullRequest,
  issueId: string
) => {
  if (pullRequest.title != PR_TITLE_UPDATE_KEYWORD) {
    core.info(`PR title isn't set to keyword '${PR_TITLE_UPDATE_KEYWORD}'.`);
    return pullRequest.title;
  }

  core.info(`Calculating title from issue ${issueId}`);
  const issue = await linearClient.issue(issueId);
  core.info(`Fetched issue ${issue.title}`);
  const parentIssue = await issue.parent;
  if (!isNil(parentIssue))
    core.info(`Fetched parent issue ${parentIssue.title}`);
  const project = await issue.project;
  if (!isNil(project)) core.info(`Fetched project ${project.name}`);
  let prefix = await getConventionalCommitPrefix(issue);
  if (!isNil(parentIssue) && isNil(prefix))
    prefix = await getConventionalCommitPrefix(parentIssue);

  let title = prefix ?? "";
  title += project ? `${project.name} | ` : "";
  title += issue.title;
  title += parentIssue ? ` < ${parentIssue.title}` : "";

  return title;
};

export const getBodyWithIssues = async (
  linearClient: LinearClient,
  pullRequest: PullRequest,
  issueIds: string[]
) => {
  let body = isNil(pullRequest.body) ? "" : pullRequest.body;
  let previousIssueUrl: string | null = null;

  core.info(`Calculating body from issues: ${issueIds.join(", ")}`);

  for (const issueId of issueIds) {
    const issue = await linearClient.issue(issueId);

    if (!body.includes(issue.url)) {
      const markdownUrl = `Linear: [${issue.title}](${issue.url})`;

      if (!isNil(previousIssueUrl)) {
        body = body.replace(
          `](${previousIssueUrl})`,
          `](${previousIssueUrl})\n${markdownUrl}`
        );
      } else {
        body = `${markdownUrl}\n${body}`;
      }
    }

    // once we add a link, remove the manual "fixes ENG-123", if any, to avoid duplication.
    const issueIdRegex = new RegExp(`(fixes|resolves) ${issueId}\n`, "i");

    if (issueIdRegex.test(body)) {
      body = body.replace(issueIdRegex, "");
    }

    previousIssueUrl = issue.url;
  }

  return body;
};

const updatePrTitleAndBody = async (
  linearClient: LinearClient,
  octokit,
  pullRequest: PullRequest
) => {
  if (isNil(pullRequest.head.repo)) {
    // `.head.repo` can be null.
    // Reference: https://github.com/octokit/rest.js/issues/31#issue-860734069
    core.info(`PR is sourced from an "unknown repository".`);
    return;
  }

  const issueIds = getLinearIssueIds(pullRequest);

  if (!issueIds.length) {
    core.info("PR isn't linked to any Linear issues.");
    return;
  }
  core.info(`PR linked to Linear issues: ${issueIds.join(", ")}.`);

  const title = await getTitleFromIssueId(
    linearClient,
    pullRequest,
    issueIds[0]
  );
  core.info(`Inferred title: ${title}`);
  const body = await getBodyWithIssues(linearClient, pullRequest, issueIds);
  core.info(`Inferred body: ${body}`);
  const data = {
    repo: pullRequest.head.repo.name,
    owner: pullRequest.head.repo.owner.login,
    pull_number: pullRequest.number,
    title,
    body,
  };

  await octokit.rest.pulls.update(data);
};

async function run() {
  try {
    const inputs = getInputs();
    const linearClient = new LinearClient({
      apiKey: inputs.linearApiKey,
    });
    const octokit = github.getOctokit(inputs.githubToken);

    const { number: prNumber, repository } = github.context.payload;
    if (isNil(repository)) return;
    const { data: pullRequest } = await octokit.rest.pulls.get({
      repo: repository.name,
      owner: repository.owner.login,
      pull_number: prNumber,
    });

    await updatePrTitleAndBody(linearClient, octokit, pullRequest);
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

if (process.env.GITHUB_ACTIONS) {
  run();
}
