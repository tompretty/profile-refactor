export function mapErrorToStardustErrors(error?: string): string[] | undefined {
  if (!error) {
    return undefined;
  }

  return [error];
}
