type ClickCallback = () => Promise<void> | void;

type ButtonProps = {
  text: string;
  onClick: ClickCallback;
  label?: string;
};

type ButtonElements = {
  button: HTMLButtonElement;
  label: HTMLSpanElement;
};

class Button {
  private container: HTMLDivElement;

  private elements: ButtonElements;

  private onClick: ClickCallback;

  constructor(props: ButtonProps, classList: string[] = []) {
    this.container = document.createElement('div');

    const button = document.createElement('button');
    button.classList.add('btn', ...classList);
    button.textContent = props.text;

    const label = document.createElement('span');
    label.textContent = props.label ?? '';

    this.elements = { button, label };
    this.onClick = props.onClick;

    this.elements.button.addEventListener('mousedown', this);
    this.elements.button.addEventListener('click', this);
  }

  handleEvent(e: Event): void {
    if (e.type === 'mousedown') {
      e.preventDefault();
    }
    if (e.type === 'click') {
      this.handleClick();
    }
  }

  private async handleClick(): Promise<void> {
    await this.onClick();
  }

  render(text?: string): HTMLDivElement {
    const { label, button } = this.elements;
    if (text) {
      button.textContent = text;
    }
    this.container.classList.add('hstack', 'gap-3');
    this.container.replaceChildren(label, button);
    return this.container;
  }

  disable(): void {
    this.elements.button.disabled = true;
  }

  enable(): void {
    this.elements.button.disabled = false;
  }
}

export default Button;
