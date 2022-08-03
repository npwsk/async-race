import PageIds from '../constants/pages';
import NavButton from './nav-button';

class Nav {
  static items = [
    { title: 'Garage', id: PageIds.Garage },
    { title: 'Winners', id: PageIds.Winners },
  ];

  private container: HTMLElement;

  private active: PageIds;

  private buttons: NavButton[];

  constructor(defaultActive?: PageIds) {
    this.active = defaultActive || PageIds.Garage;
    this.container = document.createElement('nav');
    this.container.classList.add('navbar', 'navbar-expand', 'bg-light');
    this.buttons = Nav.items.map((btn) => new NavButton(btn.id, btn.title));
  }

  changeActive(id: PageIds): void {
    if (id === this.active) {
      return;
    }
    this.active = id;
    this.buttons.forEach((btn) => btn.setState(btn.id === this.active));
  }

  create(): HTMLElement {
    const btns: HTMLElement[] = this.buttons.map((btn) => btn.create());
    this.buttons.find((btn) => btn.id === this.active)?.setState(true);

    const btnsContainer = document.createElement('div');
    btnsContainer.classList.add('navbar-nav');
    btnsContainer.append(...btns);

    const innerContainer = document.createElement('div');
    innerContainer.classList.add('container-fluid');
    innerContainer.append(btnsContainer);

    this.container.append(innerContainer);
    return this.container;
  }
}

export default Nav;
