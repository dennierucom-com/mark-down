export function resolveRelativePath(currentFilePath: string, targetPath: string): string {
  // If absolute or external, return as is
  if (targetPath.startsWith('/') || targetPath.startsWith('http://') || targetPath.startsWith('https://')) {
    return targetPath;
  }

  // Normalize slashes
  const normalizedCurrent = currentFilePath.replace(/\\/g, '/');
  const normalizedTarget = targetPath.replace(/\\/g, '/');

  const currentParts = normalizedCurrent.split('/');
  // Remove the file itself to get the directory
  currentParts.pop();

  const targetParts = normalizedTarget.split('/');

  for (const part of targetParts) {
    if (part === '.') {
      continue;
    } else if (part === '..') {
      if (currentParts.length > 0) {
        currentParts.pop();
      }
    } else {
      currentParts.push(part);
    }
  }

  return currentParts.join('/');
}
