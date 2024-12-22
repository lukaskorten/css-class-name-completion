import {
  CancellationToken,
  CompletionItem,
  CompletionItemKind,
  CompletionItemProvider,
  Position,
  TextDocument,
} from 'vscode';
import { loadClassNames } from './download-styles';
import { clearStorage } from './storage';

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

  private async getClassNames(): Promise<string[]> {
    if (this.cachedClassNames) return this.cachedClassNames;
    this.cachedClassNames = await loadClassNames();
    return this.cachedClassNames;
  }

  public async updateClassNames() {
    this.cachedClassNames = undefined;
    clearStorage();
    this.cachedClassNames = await loadClassNames();
  }
}
