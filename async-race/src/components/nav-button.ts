class NavButton {
  private container: HTMLAnchorElement;

  private id: string;

  private text: string;

  constructor(id: string, text: string) {
    this.container = document.createElement('a');
    this.id = id;
    this.text = text;
  }

  create(): HTMLElement {
    this.container.textContent = this.text;
    this.container.href = `/#${this.id}`;
    return this.container;
  }
}

export default NavButton;
