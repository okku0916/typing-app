export function getLeadingWhitespace(line: string): string {
  const matched = line.match(/^[ \t]*/);
  return matched ? matched[0] : "";
}

export function getIndentJump(referenceCode: string, nextIndex: number): number {
  if (nextIndex < 0 || nextIndex >= referenceCode.length) {
    return 0;
  }

  let cursor = nextIndex;
  while (cursor < referenceCode.length) {
    const char = referenceCode[cursor];
    if (char === " " || char === "\t") {
      cursor += 1;
      continue;
    }
    break;
  }

  return cursor - nextIndex;
}
