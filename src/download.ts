import axios from 'axios';
import { window } from 'vscode';

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
