abstract class Page {
  protected pageId: string;

  protected title: string;

  constructor(pageId: string, title: string) {
    this.pageId = pageId;
    this.title = title;
  }

  getPageHeader(): HTMLElement {
    const headingEl = document.createElement('h1');
    headingEl.textContent = this.title;
    return headingEl;
  }

  protected setPageAttribute(container: HTMLElement): void {
    container.setAttribute('data-page', this.pageId);
  }

  render(container: HTMLElement): void | Promise<void> {
    container.replaceChildren(this.getPageHeader());
  }
}

export default Page;
