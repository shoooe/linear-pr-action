"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTitle = exports.getConventionalCommitPrefix = void 0;
/**
 * @see https://www.conventionalcommits.org/en/v1.0.0/
 */
const getConventionalCommitPrefix = (issue) => {
    const isBug = issue.labels.some((label) => /bug/i.test(label));
    if (isBug)
        return "fix: ";
    const isChore = issue.labels.some((label) => /chore/i.test(label));
    if (isChore)
        return "chore: ";
    const isFeature = issue.labels.some((label) => /feature/i.test(label));
    if (isFeature)
        return "feat: ";
    return null;
};
exports.getConventionalCommitPrefix = getConventionalCommitPrefix;
const generateTitle = ({ includeParent, includePrefix, includeProject, }, issue) => {
    let title = "";
    const prefix = (0, exports.getConventionalCommitPrefix)(issue);
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
exports.generateTitle = generateTitle;
//# sourceMappingURL=algorithm.js.map