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

    const counters = document.createElement('div');
    counters.classList.add('d-flex', 'flex-column', 'gap-2');

    const pageCounter = document.createElement('div');
    pageCounter.innerHTML = `<strong>Current page:</strong> ${currentPage}`;
    const itemsCounter = document.createElement('div');
    itemsCounter.innerHTML = `<strong>Total items:</strong> ${totalItems}`;
    counters.append(pageCounter, itemsCounter);

    this.container.replaceChildren(heading, counters);

    this.container.classList.add(
      'container',
      'py-3',
      'd-flex',
      'flex-wrap',
      'justify-content-between',
      'align-items-center',
    );
    return this.container;
  }
}

export default Header;
