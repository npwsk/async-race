import PageIds from '../constants/pages';
import Page from '../pages/page';
import Garage from '../pages/garage';
import Winners from '../pages/winners';
import NotFound from '../pages/not-found';
import Nav from './nav';

class App {
  container: HTMLElement | null;

  nav: Nav;

  garagePage: Garage;

  winnersPage: Winners;

  constructor() {
    this.container = document.getElementById('root');
    this.nav = new Nav();
    this.garagePage = new Garage(PageIds.Garage);
    this.winnersPage = new Winners(PageIds.Winners);
  }

  renderPage(pageId: string): void {
    const currentPage = this.container?.querySelector('[data-page]');
    if (!currentPage) return;
    if (currentPage.id === pageId) return;

    let page: Page;

    switch (pageId) {
      case PageIds.Garage:
        page = this.garagePage;
        break;
      case PageIds.Winners:
        page = this.winnersPage;
        break;
      default:
        page = new NotFound();
        break;
    }

    currentPage.replaceWith(page.render());
  }

  init(): void {
    if (!this.container) {
      return;
    }
    this.container.append(this.nav.create());
    this.container.append(this.garagePage.render());

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1);
      this.renderPage(hash);
    });
  }
}

export default App;
