import * as core from "@actions/core";
import { getContext } from "./context";
import { getPR, updatePRTitle } from "./github";
import { getReferencedLinearIssue } from "./linear";
import { generateTitle } from "./algorithm";
import { getSettings } from "./settings";

async function run() {
  try {
    const context = getContext();
    const settings = getSettings();
    const pr = await getPR(context);

    if (pr.title !== settings.placeholder) {
      core.info(
        `Stopping. Title is not set to placeholder '${settings.placeholder}'.`
      );
      return;
    }

    const issue = await getReferencedLinearIssue(context, pr);

    if (!issue) {
      core.info("No issue found for this PR. Double check the branch name.");
      return;
    }

    const title = generateTitle(settings, issue);
    await updatePRTitle(context, pr, title);
  } catch (error: any) {
    core.setFailed(`Unexpected error: ${error.message}`);
  }
}

if (process.env.GITHUB_ACTIONS) {
  run();
}
