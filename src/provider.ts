import {
  CancellationToken,
  CompletionContext,
  CompletionItem,
  CompletionItemKind,
  CompletionItemProvider,
  Position,
  TextDocument,
} from 'vscode';
import { downloadStyles } from './download';
import { extractClassNames } from './extract-class-names';
import { getRemoteStyleSheetsURLs } from './settings';

const cachedClassNames = new Map<string, string[]>();

function isClassAttribute(document: TextDocument, position: Position): boolean {
  const lineText = document.lineAt(position).text;
  const cursorIndex = position.character;
  const textBeforeCursor = lineText.substring(0, cursorIndex);

  return /class\s*=\s*["'][^"']*$/.test(textBeforeCursor);
}

export class CssClassProvider implements CompletionItemProvider {
  public async getClassNames(): Promise<string[]> {
    const urls = getRemoteStyleSheetsURLs();
    if (urls.length === 0) {
      return [];
    }

    return (
      await Promise.all(
        urls.map(async (url) => {
          if (cachedClassNames.has(url)) {
            return cachedClassNames.get(url) ?? [];
          }

          const styles = await downloadStyles(url);
          const extracted = extractClassNames(styles);
          cachedClassNames.set(url, extracted);
          return extracted;
        })
      )
    ).flat();
  }

  public async provideCompletionItems(
    document: TextDocument,
    position: Position,
    token: CancellationToken,
    context: CompletionContext
  ) {
    if (
      !isClassAttribute(document, position) ||
      token.isCancellationRequested
    ) {
      return;
    }

    const classNames = await this.getClassNames();
    return classNames.map((className) => {
      const item = new CompletionItem(className, CompletionItemKind.Class);
      item.detail = 'CSS-Class';
      item.commitCharacters = [' '];
      return item;
    });
  }
}
