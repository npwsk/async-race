import PageIds from '../constants/pages';
import Page from '../pages/page';
import Garage from '../pages/garage';
import Winners from '../pages/winners';
import NotFound from '../pages/not-found';
import Nav from './nav';

class App {
  elements: {
    root: HTMLElement | null;
    currentPage: HTMLElement;
  };

  nav: Nav;

  garagePage: Garage;

  winnersPage: Winners;

  constructor() {
    const root = document.getElementById('root');
    const currentPage = document.createElement('div');

    this.elements = { root, currentPage };
    this.nav = new Nav();
    this.garagePage = new Garage(PageIds.Garage);
    this.winnersPage = new Winners(PageIds.Winners);
  }

  renderPage(): void {
    const hash = window.location.hash.slice(1);

    if (this.elements.currentPage.dataset.page === hash) return;

    let targetPage: Page;

    switch (hash) {
      case '':
      case PageIds.Garage:
        targetPage = this.garagePage;
        break;
      case PageIds.Winners:
        targetPage = this.winnersPage;
        break;
      default:
        targetPage = new NotFound();
    }

    targetPage.render(this.elements.currentPage);
  }

  init(): void {
    if (!this.elements.root) {
      return;
    }
    this.elements.root.append(this.nav.create());
    this.elements.root.append(this.elements.currentPage);

    this.renderPage();

    window.addEventListener('hashchange', async () => {
      this.renderPage();
    });
  }
}

export default App;
