import { LitElement, html } from "lit";

export class BotonNumero extends LitElement {
  static properties = {
    value: { type: String }
  };

  createRenderRoot() { return this; }

  render() {
    return html`
      <button class="btn btn-light w-100"
        @click=${() =>
          this.dispatchEvent(
            new CustomEvent("numero-click", {
              detail: this.value,
              bubbles: true,
              composed: true
            })
          )
        }>
        ${this.value}
      </button>
    `;
  }
}

customElements.define("boton-numero", BotonNumero);
