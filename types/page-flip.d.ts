// page-flip levert geen eigen types mee; we gebruiken enkel de constructor
declare module "page-flip" {
  export class PageFlip {
    constructor(element: HTMLElement, settings: Record<string, unknown>);
  }
}
