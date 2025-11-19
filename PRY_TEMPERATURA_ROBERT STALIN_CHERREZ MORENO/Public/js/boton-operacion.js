class BotonOperacion extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        shadow.innerHTML = `
            <style>
                button {
                    width: 100%;
                    padding: 10px;
                    font-size: 1.2rem;
                    background: #0d6efd;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                }

                button:hover {
                    opacity: 0.8;
                }
            </style>

            <button id="btnOperacion"></button>
        `;

        const btn = shadow.getElementById('btnOperacion');
        const value = this.getAttribute('value') || '?';

        btn.textContent = value;

        btn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('operacion-click', {
                bubbles: true,
                composed: true,
                detail: { operacion: value }
            }));
        });
    }
}

customElements.define('boton-operacion', BotonOperacion);
