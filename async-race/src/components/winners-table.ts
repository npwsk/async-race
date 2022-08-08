import { WinnerExtended } from '../types/winner';
import CarIcon from './car-icon';

enum TableCols {
  Number = '#',
  Color = 'Color',
  Name = 'Name',
  Wins = 'Wins',
  BestTime = 'Best time (seconds)',
}

const TABLE_COLS = [
  TableCols.Number,
  TableCols.Color,
  TableCols.Name,
  TableCols.Wins,
  TableCols.BestTime,
];

class WinnersTable {
  container: HTMLTableElement;

  constructor() {
    this.container = document.createElement('table');
  }

  render(winners: WinnerExtended[]): HTMLTableElement {
    const head = document.createElement('thead');
    head.classList.add('table-light');

    const headRow = document.createElement('tr');
    const headCells = TABLE_COLS.map((col) => {
      const cell = document.createElement('th');
      cell.textContent = col;
      return cell;
    });
    headRow.append(...headCells);
    head.append(headRow);

    const rows = winners.map((winner, index) => {
      const row = document.createElement('tr');

      const rowCells = TABLE_COLS.map((col) => {
        const tagName = col === TableCols.Name ? 'th' : 'td';
        const colEl = document.createElement(tagName);

        switch (col) {
          case TableCols.Number:
            colEl.textContent = (index + 1).toString();
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
}

export default WinnersTable;
