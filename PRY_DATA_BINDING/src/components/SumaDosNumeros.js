import { LitElement, html, css } from 'lit';

export class SumaDosNumeros extends LitElement {
  static properties = {
    numero1: { type: Number },
    numero2: { type: Number },
    resultado: { type: Number },
    mensaje: { type: String }
  };

  constructor() {
    super();
    this.numero1 = 0;
    this.numero2 = 0;
    this.resultado = this.numero1 + this.numero2;
    this.mensaje = '';
  }

  actualizarNumero(e) {
    const valor = e.target.value;
    const id = e.target.id;

    if (!/^\d*\.?\d*$/.test(valor) || (valor.indexOf('.') !== -1 && valor.split('.').length > 2) || (valor.startsWith('.') && valor.length === 1)) {
      this.mensaje = 'Solo se permiten números y un punto decimal válido';
      e.target.value = e.target.value.slice(0, -1);
      this.resultado = 0;
      this.requestUpdate();
      return;
    } else {
      this.mensaje = '';
    }

    if (id === "numero1") {
      this.numero1 = valor ? Number(valor) : 0;
    } else if (id === "numero2") {
      this.numero2 = valor ? Number(valor) : 0;
    }

    this.resultado = this.numero1 + this.numero2;
    this.requestUpdate();
  }

  render() {
    return html`
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
      <div class="container mt-3 p-3 border rounded bg-light">
        <div class="row mb-2">
          <div class="col">
            <input 
              type="text"
              id="numero1"  
              @input="${this.actualizarNumero}" value="${this.numero1}" 
              class="form-control"
              placeholder="Número 1"/>
          </div>
          <div class="col">
            <input 
              type="text"
              id="numero2"  
              @input="${this.actualizarNumero}" value="${this.numero2}"
              class="form-control"
              placeholder="Número 2"/>
          </div>
        </div>
        ${this.mensaje 
          ? html`<div class="alert alert-danger p-2">${this.mensaje}</div>` 
          : ''}
        <p class="fw-bold">Resultado: ${this.resultado}</p>
      </div>
    `;
  }
}

customElements.define("suma-dos-numeros", SumaDosNumeros);
