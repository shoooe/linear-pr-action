"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIssueIdFromBranchName = void 0;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const sdk_1 = require("@linear/sdk");
const lodash_1 = require("lodash");
const PR_TITLE_UPDATE_KEYWORD = "x";
const getIssueIdFromBranchName = (branchName) => {
    const match = branchName.match(/^feature\/([a-z]+\-\d+)\-/);
    if ((0, lodash_1.isNil)(match))
        return null;
    const branchStoryId = match[1];
    return branchStoryId.toUpperCase();
};
exports.getIssueIdFromBranchName = getIssueIdFromBranchName;
const getTitleFromStoryId = (linearClient, issueId) => __awaiter(void 0, void 0, void 0, function* () {
    const issue = yield linearClient.issue(issueId);
    return issue.title;
});
const updatePrTitle = (linearClient, octokit, pullRequest) => __awaiter(void 0, void 0, void 0, function* () {
    if (pullRequest.title != PR_TITLE_UPDATE_KEYWORD) {
        core.info(`PR title isn't set to keyword '${PR_TITLE_UPDATE_KEYWORD}'.`);
        return;
    }
    if ((0, lodash_1.isNil)(pullRequest.head.repo)) {
        // `.head.repo` can be null.
        // Reference: https://github.com/octokit/rest.js/issues/31#issue-860734069
        core.info(`PR is sourced from an "unknown repository".`);
        return;
    }
    const issueId = (0, exports.getIssueIdFromBranchName)(pullRequest.head.ref);
    if ((0, lodash_1.isNil)(issueId)) {
        core.info("PR isn't linked to any Linear issue.");
        return;
    }
    const data = {
        repo: pullRequest.head.repo.name,
        owner: pullRequest.head.repo.owner.login,
        pull_number: pullRequest.number,
        title: yield getTitleFromStoryId(linearClient, issueId),
    };
    yield octokit.rest.pulls.update(data);
});
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const linearApiKey = core.getInput("linearApiKey");
            const ghToken = core.getInput("ghToken");
            const linearClient = new sdk_1.LinearClient({
                apiKey: linearApiKey
            });
            const octokit = github.getOctokit(ghToken);
            const { number: prNumber, repository } = github.context.payload;
            if ((0, lodash_1.isNil)(repository))
                return;
            const { data: pullRequest } = yield octokit.rest.pulls.get({
                repo: repository.name,
                owner: repository.owner.login,
                pull_number: prNumber,
            });
            core.setSecret("linearApiKey");
            core.setSecret("ghToken");
            yield updatePrTitle(linearClient, octokit, pullRequest);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
if (process.env.GITHUB_ACTIONS) {
    run();
}
//# sourceMappingURL=index.js.map