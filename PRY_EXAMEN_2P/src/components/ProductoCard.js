import { LitElement, html, css } from 'lit';

class ProductoCard extends LitElement {
    static styles = css`
    .card {
      width: 320px;
      padding: 20px;
      border-radius: 16px;
      background: #ffffff;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
      font-family: 'Segoe UI', Arial, sans-serif;
      text-align: center;
    }

    h2 {
      margin-bottom: 12px;
      color: #1f2933;
    }

    input {
      width: auto;
      padding: 10px;
      margin: 6px 0;
      border-radius: 8px;
      border: 1px solid #d1d5db;
      font-size: 14px;
    }

    input:focus {
      outline: none;
      border-color: #2563eb;
    }

    hr {
      margin: 16px 0;
      border: none;
      border-top: 1px solid #e5e7eb;
    }

    .controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 12px;
      margin: 14px 0;
    }

    .quantity {
      font-size: 18px;
      font-weight: bold;
    }

    .btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      font-size: 18px;
      color: white;
      cursor: pointer;
    }

    .plus {
      background: #22c55e;
    }

    .minus {
      background: #ef4444;
    }

    .total {
      margin-top: 10px;
      font-size: 18px;
      color: #111827;
    }
  `;

  static properties = {
    nombre: { type: String },
    precio: { type: Number },
    cantidad: { type: Number }
  };

  constructor() {
    super();
    this.nombre = '';
    this.precio = 500;
    this.cantidad = 1;
  }

  aumentar() {
    this.cantidad++;
  }

  disminuir() {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  cambiarNombre(e) {
    this.nombre = e.target.value;
  }

  cambiarPrecio(e) {
    this.precio = Number(e.target.value) || 0;
  }

  render() {
    const total = this.precio * this.cantidad;

    return html`
      <div class="card">
        <h2>Crear producto</h2>

        <input type="text" placeholder="Nombre del producto" @input="${this.cambiarNombre}"/>
        <input type="number" placeholder="Precio unitario" min="0" @input="${this.cambiarPrecio}"/>

        <h3>${this.nombre || 'Producto sin nombre'}</h3>
        <p>Precio: <strong>$${this.precio}</strong></p>

        <div class="controls">
          <button class="btn minus" @click="${this.disminuir}">−</button>
          <span class="quantity">${this.cantidad}</span>
          <button class="btn plus" @click="${this.aumentar}">+</button>
        </div>

        <div class="total">
          Total: <strong>$${total}</strong>
        </div>
      </div>
    `;
  }
}

customElements.define('producto-card', ProductoCard);
