import { generateTitle, getConventionalCommitPrefix } from "./algorithm";
import { Settings } from "./settings";
import { IssueInfo } from "./linear";

describe("getConventionalCommitPrefix", () => {
  it("should infer no prefix when there are no labels", () => {
    const prefix = getConventionalCommitPrefix({
      labels: [],
    });
    expect(prefix).toBeNull();
  });

  it("should infer no prefix when there are no relevant labels", () => {
    const prefix = getConventionalCommitPrefix({
      labels: ["some", "unrelated", "labels"],
    });
    expect(prefix).toBeNull();
  });

  it("should infer 'fix' when labels include bugs", () => {
    const prefix = getConventionalCommitPrefix({
      labels: ["some", "bug", "label"],
    });
    expect(prefix).toBe("fix: ");
  });

  it("should infer 'chore' when labels include chore", () => {
    const prefix = getConventionalCommitPrefix({
      labels: ["some", "chore", "label"],
    });
    expect(prefix).toBe("chore: ");
  });

  it("should infer 'feat' when labels include feature", () => {
    const prefix = getConventionalCommitPrefix({
      labels: ["some", "feature", "label"],
    });
    expect(prefix).toBe("feat: ");
  });

  it("should prioritize bugs over chores and features", () => {
    const prefix = getConventionalCommitPrefix({
      labels: ["feature", "chore", "bug"],
    });
    expect(prefix).toBe("fix: ");
  });

  it("should prioritize chore and features", () => {
    const prefix = getConventionalCommitPrefix({
      labels: ["feature", "chore"],
    });
    expect(prefix).toBe("chore: ");
  });
});

describe("generateTitle", () => {
  test("it should work with just the title", () => {
    const settings  = {
      includeParent: true,
      includePrefix: true,
      includeProject: true,
    } satisfies Partial<Settings>;
    const issue: IssueInfo = {
      title: "Some title",
      parentTitle: null,
      projectName: null,
      labels: [],
    };
    const title = generateTitle(settings, issue);
    expect(title).toEqual("Some title");
  });

  test("it should infer the conventional commit prefix", () => {
    const settings = {
      includeParent: true,
      includePrefix: true,
      includeProject: true,
    } satisfies Partial<Settings>;
    const issue: IssueInfo = {
      title: "Some title",
      parentTitle: null,
      projectName: null,
      labels: ["some", "other", "bug", "labels"],
    };
    const title = generateTitle(settings, issue);
    expect(title).toEqual("fix: Some title");
  });

  test("it should include the project name when specified", () => {
    const settings = {
      includeParent: true,
      includePrefix: true,
      includeProject: true,
    } satisfies Partial<Settings>;
    const issue: IssueInfo = {
      title: "Some title",
      parentTitle: null,
      projectName: "Project name",
      labels: [],
    };
    const title = generateTitle(settings, issue);
    expect(title).toEqual("Project name | Some title");
  });

  test("it should include the parent name when specified", () => {
    const settings = {
      includeParent: true,
      includePrefix: true,
      includeProject: true,
    } satisfies Partial<Settings>;
    const issue: IssueInfo = {
      title: "Some title",
      parentTitle: "Parent name",
      projectName: null,
      labels: [],
    };
    const title = generateTitle(settings, issue);
    expect(title).toEqual("Parent name • Some title");
  });

  test("it should include everything, everywhere, all at once", () => {
    const settings = {
      includeParent: true,
      includePrefix: true,
      includeProject: true,
    } satisfies Partial<Settings>;
    const issue: IssueInfo = {
      title: "Some title",
      parentTitle: "Parent name",
      projectName: "Project name",
      labels: ["chore", "label"],
    };
    const title = generateTitle(settings, issue);
    expect(title).toEqual("chore: Project name | Parent name • Some title");
  });

  test("it should remove the prefix when specified", () => {
    const settings = {
      includeParent: true,
      includePrefix: false,
      includeProject: true,
    } satisfies Partial<Settings>;
    const issue: IssueInfo = {
      title: "Some title",
      parentTitle: "Parent name",
      projectName: "Project name",
      labels: ["chore", "label"],
    };
    const title = generateTitle(settings, issue);
    expect(title).toEqual("Project name | Parent name • Some title");
  });

  test("it should remove the project name when specified", () => {
    const settings = {
      includeParent: true,
      includePrefix: true,
      includeProject: false,
    } satisfies Partial<Settings>;
    const issue: IssueInfo = {
      title: "Some title",
      parentTitle: "Parent name",
      projectName: "Project name",
      labels: ["chore", "label"],
    };
    const title = generateTitle(settings, issue);
    expect(title).toEqual("chore: Parent name • Some title");
  })

  test("it should remove the parent name when specified", () => {
    const settings = {
      includeParent: false,
      includePrefix: true,
      includeProject: true,
    } satisfies Partial<Settings>;
    const issue: IssueInfo = {
      title: "Some title",
      parentTitle: "Parent name",
      projectName: "Project name",
      labels: ["chore", "label"],
    };
    const title = generateTitle(settings, issue);
    expect(title).toEqual("chore: Project name | Some title");
  });
});
