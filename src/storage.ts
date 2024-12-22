import fs from 'fs';
import { Uri, workspace } from 'vscode';

const ENCODING = 'utf-8';

const workspaceFolderPath = workspace.workspaceFolders?.[0]?.uri.fsPath;
const storageFilePath = Uri.file(
  `${workspaceFolderPath}/.vscode/css-classes.json`
);

export function readStoredClassNames(): Record<string, string[]> {
  if (!fs.existsSync(storageFilePath.fsPath)) {
    writeNewStorageFile();
    return {};
  }

  const fileContent = fs.readFileSync(storageFilePath.fsPath, ENCODING);
  return JSON.parse(fileContent.toString());
}

export function storeClassNames(cssClassNamesMap: Record<string, string[]>) {
  fs.writeFileSync(
    storageFilePath.fsPath,
    JSON.stringify(cssClassNamesMap),
    ENCODING
  );
}

export function clearStorage() {
  writeNewStorageFile();
}

function writeNewStorageFile() {
  fs.writeFileSync(storageFilePath.fsPath, JSON.stringify({}), ENCODING);
}
