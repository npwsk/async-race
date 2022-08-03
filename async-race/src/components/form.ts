import Car from '../types/car';

const DEFAULT_COLOR = '#ffffff';

type SubmitCallback = (props: Omit<Car, 'id'>) => void;

interface InputFieldProps {
  type?: string;
  name?: string;
  placeholder?: string;
  title?: string;
  value?: string;
}

class Form {
  container: HTMLElement;

  private action: string;

  private onSubmit: SubmitCallback;

  private inputFields: Record<string, HTMLInputElement>;

  private submitBtn: HTMLButtonElement;

  constructor(actionText: string, onSubmit: SubmitCallback) {
    this.action = actionText;
    this.onSubmit = onSubmit;
    this.container = document.createElement('form');
    this.container.classList.add('p-3', 'hstack', 'gap-3');
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
    this.updateValues({ name: '', color: DEFAULT_COLOR });
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
}

export default Form;
