export {}

declare global {
  interface Window {
    /**
     * Cookies library.
     */
    glowCookies: any
    Cypress: any
    store: any
  }
}

declare module '*.mdx' {
  let MDXComponent: (props: any) => JSX.Element
  export default MDXComponent
}
