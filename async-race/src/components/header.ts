class Header {
  container: HTMLElement;

  title: string;

  currentPage: number;

  totalItems: number;

  constructor(title: string) {
    this.container = document.createElement('header');
    this.title = title;
    this.currentPage = 1;
    this.totalItems = 1;
  }

  render(currentPage: number, totalItems: number): HTMLElement {
    const heading = document.createElement('h1');
    heading.textContent = this.title;

    const counter = document.createElement('div');
    counter.innerHTML = `<strong>Current page:</strong> ${currentPage}
    <strong>Total items:</strong> ${totalItems}`;
    this.container.replaceChildren(heading, counter);

    this.container.classList.add('container', 'hstack', 'justify-content-between');
    return this.container;
  }
}

export default Header;
