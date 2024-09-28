"use strict";
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
exports.getReferencedLinearIssue = void 0;
const getReferencedLinearIssue = (_a, pr_1) => __awaiter(void 0, [_a, pr_1], void 0, function* ({ linear }, pr) {
    var _b, _c;
    const issue = yield linear.issueVcsBranchSearch(pr.branch);
    if (!issue)
        return undefined;
    const parent = yield issue.parent;
    const project = yield issue.project;
    const labels = yield issue.labels();
    return {
        title: issue.title,
        parentTitle: (_b = parent === null || parent === void 0 ? void 0 : parent.title) !== null && _b !== void 0 ? _b : null,
        projectName: (_c = project === null || project === void 0 ? void 0 : project.name) !== null && _c !== void 0 ? _c : null,
        labels: labels.nodes.map((label) => label.name),
    };
});
exports.getReferencedLinearIssue = getReferencedLinearIssue;
//# sourceMappingURL=linear.js.map