import getAllWinners from '../api/winners';
import Winner from '../types/winner';
import Page from './page';

class WinnersPage extends Page {
  winners: Winner[];

  currentPage: number;

  constructor(id: string) {
    super(id, 'Winners');

    this.winners = [];
    this.currentPage = 1;
  }

  async render(container: HTMLElement): Promise<void> {
    this.winners = await getAllWinners();

    this.setPageAttribute(container);
    container.replaceChildren(this.getPageHeader());
  }

  getPageHeader(): HTMLElement {
    const container = document.createElement('div');
    container.innerHTML = `<header>
      <h1>${this.title}</h1>
      page: ${this.currentPage}
      winners total: ${this.winners.length}
    </header>`;

    return container.firstElementChild as HTMLElement;
  }
}

export default WinnersPage;
