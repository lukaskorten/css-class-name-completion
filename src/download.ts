import axios from 'axios';
import { window } from 'vscode';
import { extractClassNames } from './extract-class-names';
import { getRemoteStyleSheetsURLs } from './settings';
import { readStorageFile, writeStorageFile } from './storage';

export async function downloadStyles(url: string): Promise<string> {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    window.showErrorMessage(
      `Fetching Stylesheets from "${url}" failed, ${error}`
    );
    return '';
  }
}

export async function loadOrDownloadClassNames(): Promise<
  Record<string, string[]>
> {
  const urls = getRemoteStyleSheetsURLs();
  if (!urls.length) return {};

  const storage = readStorageFile();

  const classNamesByUrl = (
    await Promise.all(
      urls.map(async (url) => {
        let classNames: string[];

        if (storage[url]) {
          classNames = storage[url];
        } else {
          const styles = await downloadStyles(url);
          classNames = extractClassNames(styles);
        }

        return { [url]: classNames };
      })
    )
  ).reduce((previous, current) => ({ ...previous, ...current }), {});

  writeStorageFile(classNamesByUrl);

  return classNamesByUrl;
}
