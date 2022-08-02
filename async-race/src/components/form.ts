class Form {
  action: string;

  onSubmit: EventListener;

  constructor(actionText: string, onSubmit: EventListener) {
    this.action = actionText;
    this.onSubmit = onSubmit;
  }

  create(): HTMLElement {
    const form = document.createElement('form');
    form.classList.add('p-3', 'hstack', 'gap-3');
    form.innerHTML = `
    <input name="car-name" class="form-control" type="text" placeholder="Car name">
    <input name="car-color" type="color" class="form-control form-control-color" id="carColor" value="#ffffff" title="Choose car color">
    <button type="submit" class="btn btn-primary">Create</button>`;
    form.addEventListener('submit', this.onSubmit);

    return form;
  }
}

export default Form;
