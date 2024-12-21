import {
  CancellationToken,
  CompletionItem,
  CompletionItemKind,
  CompletionItemProvider,
  Position,
  TextDocument,
} from 'vscode';
import { loadOrDownloadClassNames } from './download';

export class CssClassProvider implements CompletionItemProvider {
  private cachedClassNames: string[] | undefined = undefined;

  public async provideCompletionItems(
    document: TextDocument,
    position: Position,
    token: CancellationToken
  ) {
    if (
      !this.isClassAttribute(document, position) ||
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

  private isClassAttribute(
    document: TextDocument,
    position: Position
  ): boolean {
    const lineText = document.lineAt(position).text;
    const cursorIndex = position.character;
    const textBeforeCursor = lineText.substring(0, cursorIndex);

    return /class\s*=\s*["'][^"']*$/.test(textBeforeCursor);
  }

  public async getClassNames(): Promise<string[]> {
    if (this.cachedClassNames) return this.cachedClassNames;

    const classNamesByUrl = await loadOrDownloadClassNames();
    this.cachedClassNames = Object.values(classNamesByUrl).flat();
    return this.cachedClassNames;
  }
}
