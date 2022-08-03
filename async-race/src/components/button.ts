type ClickCallback = () => Promise<void>;

type ButtonProps = {
  text: string;
  label?: string;
  onClick: ClickCallback;
};

type ButtonElements = {
  button: HTMLButtonElement;
  label: HTMLSpanElement;
};

class Button {
  container: HTMLDivElement;

  elements: ButtonElements;

  private onClick: ClickCallback;

  constructor(props: ButtonProps, classList: string[] = []) {
    this.container = document.createElement('div');
    this.container.classList.add('hstack', 'gap-3');

    const button = document.createElement('button');
    button.classList.add('btn', ...classList);
    button.textContent = props.text;

    const label = document.createElement('span');
    label.textContent = props.label ?? '';

    this.elements = { button, label };
    this.onClick = props.onClick;

    this.container.addEventListener('click', this);
  }

  handleEvent(e: Event): void {
    if (e.type === 'click') {
      this.handleClick();
    }
  }

  async handleClick(): Promise<void> {
    this.container.classList.add('disabled');
    await this.onClick();
    this.container.classList.remove('disabled');
  }

  render(): HTMLDivElement {
    const { label, button } = this.elements;
    this.container.replaceChildren(label, button);
    return this.container;
  }
}

export default Button;
