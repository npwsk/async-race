import { getCar } from '../api/garage';
import { getWinners } from '../api/winners';
import Header from '../components/header';
import Pagination from '../components/pagination';
import WinnersTable from '../components/winners-table';
import { WinnerExtended } from '../types/winner';
import Page from './page';

const WINNERS_PER_PAGE = 10;

type WinnerElements = {
  header: Header;
  winnersTable: WinnersTable;
  pagination: Pagination;
};

class WinnersPage extends Page {
  private winners: WinnerExtended[];

  private currentPage: number;

  private totalPages: number;

  private totalItems: number;

  views: WinnerElements;

  constructor(id: string) {
    super(id, 'Winners');

    this.winners = [];
    this.currentPage = 1;
    this.totalPages = 1;
    this.totalItems = 1;
    this.views = {
      header: new Header('Winners'),
      winnersTable: new WinnersTable(),
      pagination: new Pagination(this.currentPage, this.totalPages, () => {}),
    };
  }

  private async fetchWinners(): Promise<{ winners: WinnerExtended[]; total: number }> {
    const { winners, total } = await getWinners({
      limit: WINNERS_PER_PAGE,
      page: this.currentPage,
    });
    const winnerCars = await Promise.all(winners.map((winner) => getCar(winner.id)));
    const extendedWinners = winners.map((winner) => {
      const winnerCar = winnerCars.find((car) => car.id === winner.id);
      const name = winnerCar?.name ?? '';
      const color = winnerCar?.color ?? '';
      return { ...winner, name, color };
    });
    return { winners: extendedWinners, total };
  }

  async update(shouldFetch = false): Promise<void> {
    if (shouldFetch || this.winners === null) {
      const { winners, total } = await this.fetchWinners();
      this.winners = winners;
      this.totalItems = total;
      this.totalPages = Math.ceil(total / WINNERS_PER_PAGE);
      this.views.header.render(this.currentPage, this.totalItems);
    }
    this.views.winnersTable.render(this.winners);
    this.views.pagination.render(this.currentPage, this.totalItems);
  }

  async render(container: HTMLElement): Promise<void> {
    this.update(true);
    const wrapper = document.createElement('div');
    wrapper.classList.add('container');

    const header = this.views.header.render(this.currentPage, this.totalItems);
    const table = this.views.winnersTable.render(this.winners);
    const pagination = this.views.pagination.render(this.currentPage, this.totalItems);

    wrapper.append(header, table, pagination);

    this.setPageAttribute(container);
    container.replaceChildren(wrapper);
  }
}

export default WinnersPage;
