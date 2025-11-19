class ConversorTemperatura extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });

        this.formato = this.getAttribute("formato") || "C-F";

        shadow.innerHTML = `
            <link rel="stylesheet" href="./Public/vendor/bootstrap/css/bootstrap.min.css">

            <div class="card bg-dark text-white p-3 mt-2">
                <h5 class="text-center mb-3">
                    Conversor
                </h5>

                <div class="mb-3">
                    <label class="form-label">${this.formato === "C-F" ? "Celsius" : "Fahrenheit"}</label>
                    <input type="number" id="input1" class="form-control" placeholder="Ingrese valor">
                </div>

                <div class="mb-3">
                    <label class="form-label">${this.formato === "C-F" ? "Fahrenheit" : "Celsius"}</label>
                    <input type="text" id="input2" class="form-control" placeholder="Resultado" disabled>
                </div>

                <button id="btnConvertir" class="btn btn-warning w-100">Convertir</button>
            </div>
        `;

        this.input1 = shadow.getElementById("input1");
        this.input2 = shadow.getElementById("input2");
        this.btn = shadow.getElementById("btnConvertir");

        this.btn.addEventListener("click", () => {
            this.convertir();
        });
    }

    convertir() {
        const valor = parseFloat(this.input1.value);

        if (isNaN(valor)) {
            this.input2.value = "Ingrese un número válido";
            return;
        }

        let resultado;

        if (this.formato === "C-F") {
            resultado = (valor * 9/5) + 32;
        } else {
            resultado = (valor - 32) * 5/9;
        }

        this.input2.value = resultado.toFixed(2);
    }
}

customElements.define("conversor-temperatura", ConversorTemperatura);
