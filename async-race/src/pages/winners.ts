import { getCar } from '../api/garage';
import { getWinners } from '../api/winners';
import WinnersTable, { SortOrder, SortKey, Sort } from '../components/winners-table';
import { WINNERS_PER_PAGE } from '../constants';
import { WinnerExtended } from '../types/winner';
import Page from '../base/page';

class WinnersPage extends Page {
  private winners: WinnerExtended[];

  private sort: Sort;

  protected winnersTable: WinnersTable;

  constructor(id: string) {
    super(id, 'Winners');

    this.winners = [];
    this.sort = { key: null, order: null };
    this.winnersTable = new WinnersTable(this.handleSort.bind(this));
  }

  async fetch(): Promise<void> {
    let params: Parameters<typeof getWinners>[0] = {
      limit: WINNERS_PER_PAGE,
      page: this.state.currentPage,
    };
    if (this.sort.key) {
      const { key, order } = this.sort;
      params = { ...params, sort: key, order };
    }
    const { winners, total } = await getWinners(params);
    const winnerCars = await Promise.all(winners.map((winner) => getCar(winner.id)));
    const extendedWinners = winners.map((winner) => {
      const winnerCar = winnerCars.find((car) => car.id === winner.id);
      const name = winnerCar?.name ?? '';
      const color = winnerCar?.color ?? '';
      return { ...winner, name, color };
    });
    this.winners = extendedWinners;
    this.state.totalItems = total;
    this.state.totalPages = Math.ceil(total / WINNERS_PER_PAGE);
  }

  render(): typeof this.container {
    super.render();
    const wrapper = document.createElement('div');
    wrapper.classList.add('container');

    const header = this.header.render(this.state.currentPage, this.state.totalItems);
    const table = this.winnersTable.render(this.winners, this.state.currentPage);
    const pagination = this.pagination.render(this.state.currentPage, this.state.totalPages);

    wrapper.append(header, table, pagination);

    this.container.replaceChildren(wrapper);
    return this.container;
  }

  private async handleSort(key: SortKey, order: SortOrder): Promise<void> {
    this.sort.key = key;
    this.sort.order = order;
    await this.fetch();
    this.render();
  }
}

export default WinnersPage;
