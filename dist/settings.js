"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = void 0;
const inputs_1 = require("./inputs");
const getSettings = () => {
    const placeholder = (0, inputs_1.getOptionalInput)("placeholder", "x");
    const includePrefix = (0, inputs_1.getOptionalInput)("include-prefix", "true") === "true";
    const includeProject = (0, inputs_1.getOptionalInput)("include-project", "true") === "true";
    const includeParent = (0, inputs_1.getOptionalInput)("include-parent", "true") === "true";
    return {
        placeholder,
        includePrefix,
        includeParent,
        includeProject,
    };
};
exports.getSettings = getSettings;
//# sourceMappingURL=settings.js.map