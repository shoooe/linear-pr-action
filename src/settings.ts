import { getOptionalInput } from "./inputs";

export const getSettings = () => {
  const placeholder = getOptionalInput("placeholder", "x");
  const includePrefix = getOptionalInput("include-prefix", "true") === "true";
  const includeProject = getOptionalInput("include-project", "true") === "true";
  const includeParent = getOptionalInput("include-parent", "true") === "true";

  return {
    placeholder,
    includePrefix,
    includeParent,
    includeProject,
  };
};

export type Settings = ReturnType<typeof getSettings>;
