import * as core from "@actions/core";
import { isEmpty } from "lodash";

const getRequiredInput = (key: string) => {
  const inputOrEmptyString = core.getInput(key);
  if (isEmpty(inputOrEmptyString)) {
    core.setFailed(`Missing required ${key} input`);
  }
  return inputOrEmptyString;
};

const getOptionalInput = (key: string, defaultValue?: string) => {
  const inputOrEmptyString = core.getInput(key);
  return !isEmpty(inputOrEmptyString) ? inputOrEmptyString : defaultValue;
};

export const getInputs = () => {
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
