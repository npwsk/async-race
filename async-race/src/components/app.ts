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

  garageView: Garage;

  winnersView: Winners;

  constructor() {
    const root = document.getElementById('root');
    const currentPage = document.createElement('div');

    this.elements = { root, currentPage };
    this.nav = new Nav(PageIds.Garage);
    this.garageView = new Garage(PageIds.Garage);
    this.winnersView = new Winners(PageIds.Winners);
  }

  renderPage(): void {
    const hash = window.location.hash.slice(1);

    if (this.elements.currentPage.dataset.page === hash) return;

    let targetPage: Page;

    switch (hash) {
      case '':
      case PageIds.Garage:
        targetPage = this.garageView;
        this.nav.changeActive(PageIds.Garage);
        break;
      case PageIds.Winners:
        targetPage = this.winnersView;
        this.nav.changeActive(PageIds.Winners);
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
