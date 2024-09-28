import * as core from "@actions/core";
import * as githubSdk from "@actions/github";
import { LinearClient } from "@linear/sdk";
import { getRequiredInput } from "./inputs";

export const getContext = () => {
  const linearApiKey = getRequiredInput("linear-api-key");
  const githubToken = getRequiredInput("github-token");

  // Mask these secrets.
  core.setSecret("linear-api-key");
  core.setSecret("github-token");

  const linear = new LinearClient({
    apiKey: linearApiKey,
  });
  const github = githubSdk.getOctokit(githubToken);

  return {
    linear,
    github,
  };
};

export type Context = ReturnType<typeof getContext>;
