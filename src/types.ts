
export interface Attribute {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  converter: (prop?: string) => any;
}
