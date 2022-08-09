import Car from '../types/car';

const DEFAULT_COLOR = '#ffc107';

type Callback<T> = (props: T) => void;

interface InputFieldProps {
  type?: string;
  name?: string;
  placeholder?: string;
  title?: string;
  value?: string;
}

class Form<CallbackParams> {
  container: HTMLElement;

  private action: string;

  private onSubmit: Callback<CallbackParams>;

  private inputFields: Record<string, HTMLInputElement>;

  private submitBtn: HTMLButtonElement;

  constructor(actionText: string, onSubmit: Callback<CallbackParams>) {
    this.action = actionText;
    this.onSubmit = onSubmit;
    this.container = document.createElement('form');
    this.container.classList.add('d-flex', 'flex-wrap', 'flex-md-nowrap', 'gap-3');
    this.inputFields = {
      name: Form.createInputField({
        type: 'text',
        name: 'name',
        placeholder: 'Car name',
        value: '',
      }),
      color: Form.createInputField(
        {
          type: 'color',
          name: 'color',
          title: 'Choose car color',
          value: DEFAULT_COLOR,
        },
        ['form-control-color'],
      ),
    };
    this.submitBtn = this.createSubmitBtn();
    this.container.append(...Object.values(this.inputFields), this.submitBtn);
    this.container.addEventListener('submit', this.handleSubmit.bind(this));
  }

  handleSubmit(e: Event): void {
    e.preventDefault();
    const values = Object.entries(this.inputFields).map(([name, field]) => [name, field.value]);
    this.onSubmit(Object.fromEntries(values));
    this.reset();
  }

  static createInputField(props: InputFieldProps = {}, classList: string[] = []): HTMLInputElement {
    const inputEl = document.createElement('input');
    inputEl.classList.add('form-control', ...classList);
    Object.entries(props).forEach(([prop, val]) => {
      inputEl[prop as keyof InputFieldProps] = val;
    });
    return inputEl;
  }

  createSubmitBtn(): HTMLButtonElement {
    const btnEl = document.createElement('button');
    btnEl.classList.add('btn', 'btn-primary');
    btnEl.type = 'submit';
    btnEl.textContent = this.action;
    return btnEl;
  }

  updateValues(values: Omit<Car, 'id'>): void {
    Object.keys(this.inputFields).forEach((name) => {
      if (name in values) {
        const value = values[name as keyof typeof values];
        this.inputFields[name].value = value;
      }
    });
  }

  reset(): void {
    this.updateValues({ name: '', color: DEFAULT_COLOR });
  }

  disable(): void {
    this.submitBtn.disabled = true;
  }

  enable(): void {
    this.submitBtn.disabled = false;
  }
}

export default Form;
