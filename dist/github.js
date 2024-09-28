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
exports.updatePRTitle = exports.getPR = void 0;
const githubSdk = __importStar(require("@actions/github"));
const invariant_1 = require("./invariant");
const getPR = (_a) => __awaiter(void 0, [_a], void 0, function* ({ github }) {
    const { number: prNumber, repository } = githubSdk.context.payload;
    (0, invariant_1.invariant)(!!repository, "Repository not set");
    const { data: pullRequest } = yield github.rest.pulls.get({
        repo: repository.name,
        owner: repository.owner.login,
        pull_number: prNumber,
    });
    // `.head.repo` can be null.
    // Reference: https://github.com/octokit/rest.js/issues/31#issue-860734069
    (0, invariant_1.invariant)(!!pullRequest.head.repo, `PR is sourced from an "unknown repository"`);
    return {
        branch: pullRequest.head.ref,
        title: pullRequest.title,
        repo: pullRequest.head.repo.name,
        owner: pullRequest.head.repo.owner.login,
        number: pullRequest.number,
    };
});
exports.getPR = getPR;
const updatePRTitle = (_a, pr_1, title_1) => __awaiter(void 0, [_a, pr_1, title_1], void 0, function* ({ github }, pr, title) {
    yield github.rest.pulls.update({
        repo: pr.repo,
        owner: pr.owner,
        pull_number: pr.number,
        title,
    });
});
exports.updatePRTitle = updatePRTitle;
//# sourceMappingURL=github.js.map