export interface RegexGroupResult {
  index: number;
  value: string | null;
  participated: boolean;
}

export interface NamedRegexGroupResult {
  name: string;
  value: string | null;
  participated: boolean;
}

export interface RegexMatchResult {
  order: number;
  value: string;
  start: number;
  end: number;
  line: number;
  column: number;
  groups: RegexGroupResult[];
  namedGroups: NamedRegexGroupResult[];
  indices: unknown;
}

export interface MatchWorkerResult {
  matches: RegexMatchResult[];
  truncated: boolean;
  zeroWidth: boolean;
}

export interface FileLineResult {
  lineNumber: number;
  content: string;
  groups: (string | null)[];
  namedGroups: Record<string, string | null>;
}

export interface FileFilterWorkerResult {
  matching: FileLineResult[];
  nonmatching: FileLineResult[];
  totalLines: number;
  truncated: boolean;
}
