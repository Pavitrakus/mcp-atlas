export type Transport = "stdio" | "sse" | "streamable-http";

export type Permission = "read" | "write" | "mixed";

export type Risk = "low" | "medium" | "high";

export type ToolInput = {
  name: string;
  type: string;
  note?: string;
};

export type ToolRecord = {
  name: string;
  summary: string;
  inputs: ToolInput[];
  permission: Permission;
  risk: Risk;
};

export type InstallRecord =
  | {
      kind: "npm";
      packageName: string;
      versionObserved: string;
      args: string[];
      env: { key: string; required: boolean; note: string }[];
    }
  | {
      kind: "remote";
      url: string;
      headers: { key: string; note: string }[];
    }
  | {
      kind: "readme";
      note: string;
    };

export type ServerRecord = {
  slug: string;
  name: string;
  summary: string;
  gives: string;
  repository?: string;
  repositoryNote?: string;
  homepage?: string;
  maintainer: string;
  categories: string[];
  tags: string[];
  useCases: string[];
  transports: Transport[];
  hosting: "local" | "remote" | "either";
  auth: {
    required: boolean;
    kind: "none" | "api-key" | "oauth" | "connection-string" | "local-config";
    note: string;
  };
  install: InstallRecord;
  tools: ToolRecord[];
  toolsNote?: string;
  resources: { name: string; summary: string }[];
  prompts: { name: string; summary: string }[];
  warnings: string[];
  weird: boolean;
  official: boolean;
  publisher: "publisher" | "reference" | "community";
  related: string[];
  sourceUrls: string[];
};

export type CategoryRecord = {
  slug: string;
  name: string;
  latin: string;
  summary: string;
  specimen: SpecimenId;
};

export type SpecimenId =
  | "observatory"
  | "archive"
  | "loom"
  | "armature"
  | "herbarium"
  | "film"
  | "chart"
  | "terminal";

export type Observation = {
  stars: number;
  openIssues?: number;
  language: string | null;
  license: string | null;
  pushedAt: string;
  createdAt?: string;
  archived: boolean;
};

export type RegistryHit = {
  id: string;
  name: string;
  title: string;
  description: string;
  version?: string;
  repository?: string;
  homepage?: string;
  remoteUrl?: string;
  remoteType?: string;
  packageName?: string;
  updatedAt?: string;
  status?: string;
};

export type SearchFilters = {
  category?: string;
  transport?: Transport;
  credential?: "none" | "required";
  hosting?: "local" | "remote";
  language?: string;
  license?: string;
  weird?: boolean;
  official?: boolean;
  maintenance?: "recent" | "quiet" | "archived";
};

export type ClientId = "cursor" | "claude" | "vscode" | "claude-code" | "generic";

export type StackSuggestion = {
  categories: string[];
  note: string;
};
