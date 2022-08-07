class Alert {
  container: HTMLDivElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.addEventListener('click', this);
  }

  render(title = '', message?: string): HTMLDivElement {
    this.container.classList.add(
      'toast-container',
      'position-fixed',
      'top-0',
      'start-0',
      'w-100',
      'h-100',
      'bg-dark',
      'd-flex',
      'align-items-center',
      'justify-content-center',
    );

    const alertEl = document.createElement('div');
    alertEl.classList.add('toast', 'align-items-center', 'show');

    const alertHeader = document.createElement('div');
    alertHeader.classList.add('toast-header');
    alertHeader.textContent = title;
    alertEl.append(alertHeader);

    if (message) {
      const alertBody = document.createElement('div');
      alertBody.classList.add('toast-body');
      alertBody.innerHTML = `<strong>${message}</strong>`;
      alertEl.append(alertBody);
    }

    this.container.replaceChildren(alertEl);
    return this.container;
  }

  show(): void {
    this.container.classList.add('show');
  }

  hide(): void {
    this.container.classList.remove('show');
  }

  handleEvent(e: Event): void {
    if (e.type === 'click') {
      this.handleClick(e);
    }
  }

  private handleClick(e: Event): void {
    if (e.target === this.container) {
      this.hide();
    }
  }
}

export default Alert;
