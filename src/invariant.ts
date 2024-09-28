import * as core from "@actions/core";

export function invariant(
  condition: boolean,
  message: string
): asserts condition {
  if (!condition) {
    core.setFailed(`Invariant failed: ${message}`);
  }
}
