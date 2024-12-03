import { workspace } from 'vscode';

export function getRemoteStyleSheetsURLs(): string[] {
  return (
    workspace.getConfiguration('cssClassNames').get<string[]>('remote') ?? []
  );
}
