/// <reference types="react" />

declare module "*.svg" {
  import * as React from "react"
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}
