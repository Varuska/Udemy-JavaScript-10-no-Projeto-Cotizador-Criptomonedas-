const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const ObjBusqueda = {
    moneda: '',
    criptomoneda: ''
};

//Crear um Promise
const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas)
})

document.addEventListener('DOMContentLoaded', () => {

    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);

    monedaSelect.addEventListener('change', leerValor);

})

function consultarCriptomonedas() {

    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;

        criptomonedasSelect.appendChild(option);
    });
}

function leerValor(e) {

    ObjBusqueda[e.target.name] = e.target.value;

}

function submitFormulario(e) {
    e.preventDefault();
    //Validar

    const { moneda, criptomoneda } = ObjBusqueda;

    if (moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son obligatorios');

        return;
    }

    //Consultar la Api con los resultados
    consultarApi()

}

function mostrarAlerta(msg) {

    const existeError = document.querySelector('.error');

    if (!existeError) {
        const divMensaje = document.createElement('DIV');

        divMensaje.classList.add('error');

        divMensaje.textContent = msg;

        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove()
        }, 3000)
    }
}

function consultarApi() {
    const { moneda, criptomoneda } = ObjBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    mostrarSpinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        })
}

function mostrarCotizacionHTML(cotizacion) {

    limpiarHtml()

    const { PRICE, HIGHDAY
        , LOWDAY, CHANGEPCT24HOUR
        , LASTUPDATE
    } = cotizacion;

    const precio = document.createElement('P');
    precio.classList.add('precio')//Aqui se agrega precio
    precio.innerHTML = `El Precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `El Precio mas alto del dia es: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>El Precio mas bajo del dia es: <span>${LOWDAY}</span>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>EL porcentanje de variacion es : <span>${CHANGEPCT24HOUR}%</span>`;

    const variacion = document.createElement('p');
    variacion.innerHTML = `<p>Ultima actualizacion es: <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(variacion);
};

function limpiarHtml() {

    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }

}

function mostrarSpinner() {
    limpiarHtml();

    const spinner = document.createElement('DIV');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>    
    `;

    resultado.appendChild(spinner)
}