import { commands, ExtensionContext, languages } from 'vscode';
import { CssClassProvider } from './provider';

const provider = new CssClassProvider();

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    languages.registerCompletionItemProvider(
      { language: 'html', scheme: 'file' },
      provider
    )
  );

  const disposable = commands.registerCommand(
    'cssClassNames.updateCssClasses',
    () => provider.updateClassNames()
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
