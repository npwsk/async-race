abstract class Page {
  protected container: HTMLElement;

  protected heading: HTMLElement;

  constructor(pageId: string, title: string) {
    this.container = document.createElement('div');
    this.container.id = 'page';
    this.container.setAttribute('data-page', pageId);
    this.heading = Page.createHeading(title);
  }

  static createHeading(text: string): HTMLElement {
    const headingEl = document.createElement('h1');
    headingEl.textContent = text;
    return headingEl;
  }

  render(): HTMLElement {
    this.container.append(this.heading);
    return this.container;
  }
}

export default Page;
