class NavButton {
  private container: HTMLAnchorElement;

  id: string;

  private text: string;

  constructor(id: string, text: string) {
    this.container = document.createElement('a');
    this.id = id;
    this.text = text;
  }

  setState(active: boolean): void {
    const { classList } = this.container;
    if (active && !classList.contains('active')) {
      this.container.classList.add('active');
    }
    if (!active) {
      this.container.classList.remove('active');
    }
  }

  create(): HTMLElement {
    this.container.classList.add('nav-link');
    this.container.textContent = this.text;
    this.container.href = `#${this.id}`;
    return this.container;
  }
}

export default NavButton;
