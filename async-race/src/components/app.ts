import PageIds from '../constants/pages';
import Page from '../base/page';
import Garage from '../pages/garage';
import Winners from '../pages/winners';
import NotFound from '../pages/not-found';
import Nav from './nav';

class App {
  elements: {
    root: HTMLElement | null;
    pageContainer: HTMLElement;
  };

  nav: Nav;

  garageView: Garage;

  winnersView: Winners;

  activePage: string;

  constructor() {
    const root = document.getElementById('root');
    const pageContainer = document.createElement('div');

    this.elements = { root, pageContainer };
    this.nav = new Nav(PageIds.Garage);
    this.garageView = new Garage(PageIds.Garage);
    this.winnersView = new Winners(PageIds.Winners);
    this.activePage = PageIds.Garage;
  }

  async renderPage(): Promise<void> {
    const hash = window.location.hash.slice(1);

    if (this.activePage === hash) return;

    this.activePage = hash;

    let targetPage: Page;

    switch (hash) {
      case '':
      case PageIds.Garage:
        await this.garageView.fetch();
        targetPage = this.garageView;
        this.nav.changeActive(PageIds.Garage);
        break;
      case PageIds.Winners:
        await this.winnersView.fetch();
        targetPage = this.winnersView;
        this.nav.changeActive(PageIds.Winners);
        break;
      default:
        targetPage = new NotFound();
    }

    this.elements.pageContainer.replaceChildren(targetPage.render());
  }

  init(): void {
    if (!this.elements.root) {
      return;
    }
    this.elements.root.append(this.nav.create());
    this.elements.root.append(this.elements.pageContainer);

    this.renderPage();

    window.addEventListener('hashchange', async () => {
      this.renderPage();
    });
  }
}

export default App;
