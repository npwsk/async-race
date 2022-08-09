import Component from './component';
import Header from '../components/header';
import Pagination from '../components/pagination';

type PageState = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
};

abstract class Page extends Component<'div'> {
  protected pageId: string;

  protected title: string;

  protected header: Header;

  protected pagination: Pagination;

  protected state: PageState;

  constructor(pageId: string, title: string) {
    super('div');
    this.pageId = pageId;
    this.title = title;
    this.state = {
      currentPage: 1,
      totalPages: 1,
      totalItems: 1,
    };
    this.header = new Header(title);
    this.pagination = new Pagination(this.handlePageChange.bind(this));
  }

  render(): HTMLDivElement {
    const header = this.header.render(this.state.currentPage, this.state.totalItems);

    const pagination = this.pagination.render(this.state.currentPage, this.state.totalPages);

    this.container.replaceChildren(header, pagination);
    return this.container;
  }

  protected async handlePageChange(newActivePage: number): Promise<void> {
    this.state.currentPage = newActivePage;
    await this.fetch();
    this.render();
  }

  async fetch(): Promise<void> {
    this.render();
  }
}

export default Page;
