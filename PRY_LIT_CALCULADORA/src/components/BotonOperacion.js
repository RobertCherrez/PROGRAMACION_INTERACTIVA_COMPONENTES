import { LitElement, html } from "lit";

export class BotonOperacion extends LitElement {
  static properties = {
    value: { type: String }
  };

  createRenderRoot() { return this; }

  render() {
    return html`
      <button class="btn btn-warning w-100"
        @click=${() =>
          this.dispatchEvent(
            new CustomEvent("operacion-click", {
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

customElements.define("boton-operacion", BotonOperacion);
