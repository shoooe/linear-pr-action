import { isEmpty } from "lodash";
import * as core from "@actions/core";

export const getRequiredInput = (key: string) => {
  const inputOrEmptyString = core.getInput(key);
  if (isEmpty(inputOrEmptyString)) {
    core.setFailed(`Missing required ${key} input`);
  }
  return inputOrEmptyString;
};

export const getOptionalInput = (key: string, defaultValue: string) => {
  const inputOrEmptyString = core.getInput(key);
  return !isEmpty(inputOrEmptyString) ? inputOrEmptyString : defaultValue;
};
