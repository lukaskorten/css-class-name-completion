import axios from 'axios';
import { window } from 'vscode';
import { extractClassNames } from './extract-class-names';
import { getRemoteStyleSheetsURLs } from './settings';
import { readStoredClassNames, storeClassNames } from './storage';

async function downloadStyles(url: string): Promise<string> {
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

export async function loadClassNames(): Promise<string[]> {
  const urls = getRemoteStyleSheetsURLs();
  if (!urls.length) return [];

  const storedClassNames = readStoredClassNames();

  const allClassNames = await Promise.all(
    urls.map(async (url) => {
      let classNames: string[];

      if (storedClassNames[url]) {
        classNames = storedClassNames[url];
      } else {
        const styles = await downloadStyles(url);
        classNames = extractClassNames(styles);
        storedClassNames[url] = classNames;
      }

      return classNames;
    })
  );

  storeClassNames(storedClassNames);

  return allClassNames.flat();
}
