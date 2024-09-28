import { IssueInfo } from "./linear";
import { Settings } from "./settings";

/**
 * @see https://www.conventionalcommits.org/en/v1.0.0/
 */
export const getConventionalCommitPrefix = (
  issue: Pick<IssueInfo, "labels">
) => {
  const isBug = issue.labels.some((label) => /bug/i.test(label));
  if (isBug) return "fix: ";

  const isChore = issue.labels.some((label) => /chore/i.test(label));
  if (isChore) return "chore: ";

  const isFeature = issue.labels.some((label) => /feature/i.test(label));
  if (isFeature) return "feat: ";

  return null;
};

export const generateTitle = (
  {
    includeParent,
    includePrefix,
    includeProject,
  }: Pick<Settings, "includeParent" | "includePrefix" | "includeProject">,
  issue: IssueInfo
): string => {
  let title = "";

  const prefix = getConventionalCommitPrefix(issue);

  if (includePrefix && !!prefix) {
    title += prefix;
  }

  if (includeProject && issue.projectName) {
    title += `${issue.projectName} | `;
  }

  if (includeParent && issue.parentTitle) {
    title += `${issue.parentTitle} • `;
  }

  title += issue.title;
  return title;
};
