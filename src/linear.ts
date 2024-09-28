import { Context } from "./context";
import { PRInfo } from "./github";

export type IssueInfo = {
  title: string;
  parentTitle: string | null;
  projectName: string | null;
  labels: string[];
};

export const getReferencedLinearIssue = async (
  { linear }: Context,
  pr: PRInfo
): Promise<IssueInfo | undefined> => {
  const issue = await linear.issueVcsBranchSearch(pr.branch);
  if (!issue) return undefined;

  const parent = await issue.parent;
  const project = await issue.project;
  const labels = await issue.labels();
  return {
    title: issue.title,
    parentTitle: parent?.title ?? null,
    projectName: project?.name ?? null,
    labels: labels.nodes.map((label) => label.name),
  };
};
