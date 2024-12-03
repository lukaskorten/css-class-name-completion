export function extractClassNames(cssContent: string): string[] {
  const classNameRegex = /\.([a-zA-Z0-9_-]+(?:\\:[a-zA-Z0-9_-]+)*)\b/g;
  const classNames = new Set<string>();
  let match: RegExpMatchArray | null = null;
  while ((match = classNameRegex.exec(cssContent))) {
    classNames.add(match[1].replaceAll('\\', ''));
  }
  return [...classNames];
}
