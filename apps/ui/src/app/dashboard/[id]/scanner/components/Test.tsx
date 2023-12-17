export const Test = <Multi extends boolean>(props: {
  multi: Multi
  b: Multi extends true ? (items: string[]) => void : (item: string) => void
}) => {
  if (props.multi === true) {
    // Use type assertion to tell TypeScript that it's an array of strings
    props.b([''] as string[] & string)
  } else {
    // Use type assertion to tell TypeScript that it's a single string
    props.b('a' as string)
  }
  return <div>Test</div>
}
