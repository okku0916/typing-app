export function calculateWpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0) {
    return 0;
  }

  const minutes = elapsedSeconds / 60;
  return Number(((correctChars / 5) / minutes).toFixed(2));
}
