import { LitElement, html, css } from 'lit';

export class SaludarConInput extends LitElement {

    static properties = {
        nombre: { type: String }
    };

    constructor() {
        super();
        this.nombre = 'Robert Cherrez';
    }
    actualizarNombre(e) {
        this.nombre = e.target.value;
    }
    render() {
        return html`

        <input @input="${this.actualizarNombre}" value="${this.nombre}"/>
        <p>Tu nombre es: ${this.nombre}</p>

        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUQxCKhpn6BhmsiAYE73sUwG1lKJkrgSusTw&s"/>

        `;
    }
}
customElements.define("saludar-con-input", SaludarConInput);
