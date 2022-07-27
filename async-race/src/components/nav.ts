import PageIds from '../constants/pages';
import NavButton from './nav-button';

class Nav {
  static buttons = [
    { title: 'Garage', id: PageIds.Garage },
    { title: 'Winners', id: PageIds.Winners },
  ];

  private container: HTMLElement;

  constructor() {
    this.container = document.createElement('nav');
  }

  create(): HTMLElement {
    const btns: HTMLElement[] = Nav.buttons.map((btn) => new NavButton(btn.id, btn.title).create());
    this.container.append(...btns);
    return this.container;
  }
}

export default Nav;
