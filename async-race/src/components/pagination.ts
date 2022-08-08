const PREV_PAGE = 'prev';
const NEXT_PAGE = 'next';

type PageChangeCallback = (newActivePage: number) => void;
type BtnOptions = { active?: boolean; disabled?: boolean };

class Pagination {
  private container: HTMLElement;

  private activePage: number;

  private totalPages: number;

  private onPageChange: PageChangeCallback;

  constructor(activePage: number, totalPages: number, onPageChange: PageChangeCallback) {
    this.container = document.createElement('nav');
    this.activePage = activePage;
    this.totalPages = totalPages;
    this.onPageChange = onPageChange;
    this.container.addEventListener('click', this.handleClick.bind(this));
  }

  handleClick(e: Event): void {
    e.preventDefault();
    const target = e.target as HTMLElement;
    switch (target.dataset.page) {
      case undefined:
        break;
      case PREV_PAGE:
        if (this.activePage > 1) {
          this.activePage -= 1;
        }
        break;
      case NEXT_PAGE:
        if (this.activePage < this.totalPages) {
          this.activePage += 1;
        }
        break;
      default:
        this.activePage = Number(target.dataset.page);
        break;
    }
    this.onPageChange(this.activePage);
    window.scrollTo(0, 0);
  }

  render(current: number, total: number): HTMLElement {
    this.activePage = current;
    this.totalPages = total;
    let pagesNums = Array(total > 3 ? 3 : total)
      .fill(current)
      .map((cur, i) => cur - 1 + i);
    if (current === 1) {
      pagesNums = pagesNums.map((num) => num + 1);
    }
    if (current === total && total === 3) {
      pagesNums = pagesNums.map((num) => num - 1);
    }
    const prevBtn = Pagination.getButton(PREV_PAGE, { disabled: current === 1 });
    const nextBtn = Pagination.getButton(NEXT_PAGE, { disabled: current === total });
    const pageBtns = pagesNums.map((num) => Pagination.getButton(num, { active: num === current }));

    const ulEl = document.createElement('ul');
    ulEl.classList.add('pagination');
    ulEl.append(prevBtn, ...pageBtns, nextBtn);

    this.container.replaceChildren(ulEl);
    return this.container;
  }

  static getButton(page: string | number, opts: BtnOptions = {}): HTMLLIElement {
    const el = document.createElement('li');
    el.classList.add('page-item');
    Object.entries(opts).forEach(([opt, val]) => {
      if (val) {
        el.classList.add(opt);
      }
    });

    const linkEl = document.createElement('a');
    linkEl.href = '#';
    linkEl.classList.add('page-link');
    linkEl.setAttribute('data-page', page.toString());

    switch (page) {
      case PREV_PAGE:
        linkEl.textContent = '«';
        break;
      case NEXT_PAGE:
        linkEl.textContent = '»';
        break;
      default:
        linkEl.textContent = page.toString();
    }
    el.append(linkEl);

    return el;
  }
}

export default Pagination;
