import * as core from '@actions/core';
import * as github from '@actions/github'
import { LinearClient } from '@linear/sdk'
import { isNil } from "lodash";

const PR_TITLE_UPDATE_KEYWORD = "x";

type PullRequest = {
    number: number;
    title: string;
    head: {
        ref: string;
        repo: {
            name: string;
            owner: {
                login: string;
            }
        } | null,
    },
}

export const getIssueIdFromBranchName = (branchName: string): string | null => {
    const match = branchName.match(/^feature\/([a-z]+\-\d+)\-/);
    if (isNil(match)) return null;
    const branchStoryId = match[1];
    return branchStoryId.toUpperCase();
}

const getTitleFromStoryId = async (linearClient: LinearClient, issueId: string) => {
    const issue = await linearClient.issue(issueId);
    return issue.title;
}

const updatePrTitle = async (linearClient, octokit, pullRequest: PullRequest) => {
    if (pullRequest.title != PR_TITLE_UPDATE_KEYWORD) {
        core.info(
            `PR title isn't set to keyword '${PR_TITLE_UPDATE_KEYWORD}'.`
        );
        return;
    }

    if (isNil(pullRequest.head.repo)) {
        // `.head.repo` can be null.
        // Reference: https://github.com/octokit/rest.js/issues/31#issue-860734069
        core.info(`PR is sourced from an "unknown repository".`);
        return;
    }

    const issueId = getIssueIdFromBranchName(pullRequest.head.ref);
    if (isNil(issueId)) {
        core.info("PR isn't linked to any Linear issue.");
        return;
    }

    const data = {
        repo: pullRequest.head.repo.name,
        owner: pullRequest.head.repo.owner.login,
        pull_number: pullRequest.number,
        title: await getTitleFromStoryId(linearClient, issueId),
    };
    await octokit.rest.pulls.update(data);
}

async function run() {
    try {
        const linearApiKey = core.getInput("linearApiKey");
        const ghToken = core.getInput("ghToken");

        const linearClient = new LinearClient({
            apiKey: linearApiKey
        })
        const octokit = github.getOctokit(ghToken);

        const { number: prNumber, repository } = github.context.payload;
        if (isNil(repository)) return;
        const { data: pullRequest } = await octokit.rest.pulls.get({
            repo: repository.name,
            owner: repository.owner.login,
            pull_number: prNumber,
        });

        core.setSecret("linearApiKey");
        core.setSecret("ghToken");

        await updatePrTitle(linearClient, octokit, pullRequest);
    } catch (error: any) {
        core.setFailed(error.message);
    }
}

if (process.env.GITHUB_ACTIONS) {
    run();
}