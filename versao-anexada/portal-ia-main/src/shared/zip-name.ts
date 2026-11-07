// The name of a plugin's .zip and of a skill's: the build writes the file under it, and the pages link to it.
export function zipName(name: string, version: string): string {
  return `${name}-${version}.zip`;
}
