export default function parseComponentDisplayName(name: string) {
  const names = name.match(/\w+(?=\(?)/g);
  return names || ['Anonymous'];
}
