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
exports.getInputs = void 0;
const core = __importStar(require("@actions/core"));
const lodash_1 = require("lodash");
const getRequiredInput = (key) => {
    const inputOrEmptyString = core.getInput(key);
    if ((0, lodash_1.isEmpty)(inputOrEmptyString)) {
        core.setFailed(`Missing required ${key} input`);
    }
    return inputOrEmptyString;
};
const getOptionalInput = (key, defaultValue) => {
    const inputOrEmptyString = core.getInput(key);
    return !(0, lodash_1.isEmpty)(inputOrEmptyString) ? inputOrEmptyString : defaultValue;
};
const getInputs = () => {
    const inputs = {
        linearApiKey: getRequiredInput("linear-api-key"),
        githubToken: getRequiredInput("github-token"),
        placeholder: getOptionalInput("placeholder"),
    };
    // Mask these secrets.
    core.setSecret("linear-api-key");
    core.setSecret("github-token");
    return inputs;
};
exports.getInputs = getInputs;
//# sourceMappingURL=inputs.js.map