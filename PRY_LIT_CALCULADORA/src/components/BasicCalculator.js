import { LitElement, html, css } from "lit";

export class BasicCalculator extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 320px;
      margin: auto;
    }

    .calc-card {
      background: #1e1e1e;
      color: white;
      padding: 1rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }

    .display {
      width: 100%;
      height: 70px;
      background: #000;
      color: #0f0;
      font-size: 2rem;
      padding: 10px;
      text-align: right;
      border-radius: 8px;
      border: none;
    }

    .btn-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-top: 1rem;
    }

    ::slotted(button) {
      height: 60px;
      font-size: 1.4rem;
      border-radius: 10px !important;
    }
  `;

  constructor() {
    super();
    this.expresion = "";
  }

  firstUpdated() {
    this.display = this.renderRoot.querySelector("#txt_display");

    this.addEventListener("numero-click", (e) =>
      this.procesarNumero(e.detail)
    );

    this.addEventListener("operacion-click", (e) =>
      this.procesarOperacion(e.detail)
    );
  }

  procesarNumero(valor) {

    //evitar doble punto en el mismo número
    if (valor === ".") {
      const ult = this.expresion.split(/[\+\-\*\/]/).pop();
      if (ult.includes(".")) return; 
    }

    if (valor === "AC") {
      this.expresion = "";
      this.display.value = "";
      return;
    }

    if (valor === "=") {
      try {
        this.expresion = String(Function(`return ${this.expresion}`)());
        this.display.value = this.expresion;
      } catch {
        this.display.value = "Error";
        this.expresion = "";
      }
      return;
    }

    this.expresion += valor;
    this.display.value = this.expresion;
  }

  procesarOperacion(op) {
    if (op === "AC") {
      this.expresion = "";
      this.display.value = "";
      return;
    }

    if (op === "=") {
      try {
        this.expresion = String(Function(`return ${this.expresion}`)());
        this.display.value = this.expresion;
      } catch {
        this.display.value = "Error";
        this.expresion = "";
      }
      return;
    }

    // Cualquier otro operador (+ - * /)
    this.expresion += op;
    this.display.value = this.expresion;
  }

  render() {
    return html`
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">

      <div class="calc-card">
        <input id="txt_display" class="display" disabled placeholder="0" />

        <div class="btn-grid">
          <slot></slot>
        </div>
      </div>
    `;
  }
}

customElements.define("basic-calculator", BasicCalculator);
