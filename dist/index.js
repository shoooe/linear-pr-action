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
const core = __importStar(require("@actions/core"));
const context_1 = require("./context");
const github_1 = require("./github");
const linear_1 = require("./linear");
const algorithm_1 = require("./algorithm");
const settings_1 = require("./settings");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const context = (0, context_1.getContext)();
            const settings = (0, settings_1.getSettings)();
            const pr = yield (0, github_1.getPR)(context);
            if (pr.title !== settings.placeholder) {
                core.info(`Stopping. Title is not set to placeholder '${settings.placeholder}'.`);
                return;
            }
            const issue = yield (0, linear_1.getReferencedLinearIssue)(context, pr);
            if (!issue) {
                core.info("No issue found for this PR. Double check the branch name.");
                return;
            }
            const title = (0, algorithm_1.generateTitle)(settings, issue);
            yield (0, github_1.updatePRTitle)(context, pr, title);
        }
        catch (error) {
            core.setFailed(`Unexpected error: ${error.message}`);
        }
    });
}
if (process.env.GITHUB_ACTIONS) {
    run();
}
//# sourceMappingURL=index.js.map