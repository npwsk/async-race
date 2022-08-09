import { WinnerExtended } from '../types/winner';
import CarIcon from './car-icon';
import { WINNERS_PER_PAGE } from '../constants';

enum TableCols {
  Number,
  Color,
  Name,
  Wins,
  BestTime,
}

const TABLE_COLS = [
  TableCols.Number,
  TableCols.Color,
  TableCols.Name,
  TableCols.Wins,
  TableCols.BestTime,
];

const HEAD_ROW_TITLES = {
  [TableCols.Number]: '#',
  [TableCols.Color]: 'Color',
  [TableCols.Name]: 'Name',
  [TableCols.Wins]: 'Wins',
  [TableCols.BestTime]: 'Best time (seconds)',
};

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC',
}

const sortMap = {
  wins: TableCols.Wins,
  time: TableCols.BestTime,
};

const sortOrderSymbol = {
  [SortOrder.Asc]: '↓',
  [SortOrder.Desc]: '↑',
};

type FetchCallback = (sort: SortKey, order: SortOrder) => void;

export type SortKey = keyof typeof sortMap;

type InitSort = { key: null; order: null };

export type Sort =
  | {
    key: keyof typeof sortMap;
    order: SortOrder.Asc | SortOrder.Desc;
  }
  | InitSort;

class WinnersTable {
  container: HTMLTableElement;

  headRow: HTMLTableRowElement;

  fetchSorted: FetchCallback;

  sort: Sort;

  constructor(fetchSorted: FetchCallback) {
    this.container = document.createElement('table');
    this.headRow = document.createElement('tr');
    this.fetchSorted = fetchSorted;
    this.sort = { key: null, order: null };
    this.headRow.addEventListener('click', this);
  }

  render(winners: WinnerExtended[], currentPage: number): HTMLTableElement {
    const head = document.createElement('thead');
    head.classList.add('table-light');

    const headCells = TABLE_COLS.map((col) => {
      const cell = document.createElement('th');
      const sortMapEntry = Object.entries(sortMap).find(([, colIndex]) => col === colIndex);
      cell.textContent = HEAD_ROW_TITLES[col];

      if (sortMapEntry) {
        const key = sortMapEntry[0];
        if (this.sort.key === key) {
          cell.textContent += sortOrderSymbol[this.sort.order];
        }
        cell.setAttribute('data-sort', key);
      }
      return cell;
    });
    this.headRow.replaceChildren(...headCells);
    head.append(this.headRow);

    const rows = winners.map((winner, index) => {
      const row = document.createElement('tr');

      const rowCells = TABLE_COLS.map((col) => {
        const tagName = col === TableCols.Name ? 'th' : 'td';
        const colEl = document.createElement(tagName);

        switch (col) {
          case TableCols.Number:
            colEl.textContent = ((currentPage - 1) * WINNERS_PER_PAGE + index + 1).toString();
            break;
          case TableCols.Color: {
            const svg = new CarIcon(winner.color).render();
            colEl.append(svg);
            break;
          }
          case TableCols.Name:
            colEl.textContent = winner.name;
            break;
          case TableCols.Wins:
            colEl.textContent = winner.wins.toString();
            break;
          case TableCols.BestTime:
            colEl.textContent = winner.time.toFixed(2);
            break;
          default:
        }

        return colEl;
      });

      row.append(...rowCells);
      return row;
    });

    this.container.replaceChildren(head, ...rows);
    this.container.classList.add('table');
    return this.container;
  }

  handleEvent(e: Event): void {
    if (e.type === 'click') {
      this.handleClick(e);
    }
  }

  private handleClick(e: Event): void {
    const target = e.target as HTMLElement;
    const th = target.closest('[data-sort]');
    if (!th) return;
    const sortKey = (th as HTMLElement).dataset.sort;

    if (sortKey && Object.hasOwn(sortMap, sortKey)) {
      this.setSort(sortKey as SortKey);
      this.fetchSorted(this.sort.key as SortKey, this.sort.order as SortOrder);
    }
  }

  private setSort(key: SortKey): void {
    const prevKey = this.sort.key;
    const prevOrder = this.sort.order;
    let order: SortOrder;
    if (prevKey === key) {
      order = prevOrder === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc;
    } else {
      order = SortOrder.Asc;
    }

    this.sort = { key, order };
  }
}

export default WinnersTable;
