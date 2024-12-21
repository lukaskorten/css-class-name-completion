import fs from 'fs';
import { Uri, workspace } from 'vscode';

const ENCODING = 'utf-8';

const workspaceFolderPath = workspace.workspaceFolders?.[0]?.uri.fsPath;
const storageFilePath = Uri.file(
  `${workspaceFolderPath}/.vscode/css-classes.json`
);

export function readStorageFile(): Record<string, string[]> {
  if (!fs.existsSync(storageFilePath.fsPath)) {
    fs.writeFileSync(storageFilePath.fsPath, JSON.stringify({}), ENCODING);
    return {};
  }

  const fileContent = fs.readFileSync(storageFilePath.fsPath, ENCODING);
  return JSON.parse(fileContent.toString());
}

export function writeStorageFile(cssClassNamesMap: Record<string, string[]>) {
  fs.writeFileSync(
    storageFilePath.fsPath,
    JSON.stringify(cssClassNamesMap),
    ENCODING
  );
}
