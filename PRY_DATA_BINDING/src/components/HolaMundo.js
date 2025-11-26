import {  LitElement, html, css } from "lit";

export class HolaMundo extends LitElement {

    nombre = 'ROBERT STALIN';
    apellido = 'CHERREZ MORENO';

    NOMBRE_COMPLETO = this.nombre + ' ' + this.apellido;
    nombrescompletos = `${this.nombre} ${this.apellido}`;

    render() {
        return html`

        <p>Hola ${this.nombrescompletos}</p>
        `;
    }
}
customElements.define("hola-mundo", HolaMundo);