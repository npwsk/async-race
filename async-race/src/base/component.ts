abstract class Component<K extends keyof HTMLElementTagNameMap> {
  container: HTMLElementTagNameMap[K];

  constructor(tag: K) {
    this.container = document.createElement(tag);
  }

  render(): HTMLElementTagNameMap[K] {
    return this.container;
  }
}

export default Component;
