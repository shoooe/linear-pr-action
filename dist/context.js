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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContext = void 0;
const core = __importStar(require("@actions/core"));
const githubSdk = __importStar(require("@actions/github"));
const sdk_1 = require("@linear/sdk");
const inputs_1 = require("./inputs");
const getContext = () => {
    const linearApiKey = (0, inputs_1.getRequiredInput)("linear-api-key");
    const githubToken = (0, inputs_1.getRequiredInput)("github-token");
    // Mask these secrets.
    core.setSecret("linear-api-key");
    core.setSecret("github-token");
    const linear = new sdk_1.LinearClient({
        apiKey: linearApiKey,
    });
    const github = githubSdk.getOctokit(githubToken);
    return {
        linear,
        github,
    };
};
exports.getContext = getContext;
//# sourceMappingURL=context.js.map