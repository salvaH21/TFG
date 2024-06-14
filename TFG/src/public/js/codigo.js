window.onload = iniciar;

function iniciar() {
    //Boton de hacer foto  escucha el click
    var botonCamara = document.getElementById("botonCamara");
    botonCamara.addEventListener("click", pulsarCamara);
    //Boton de galeria escucha el click
    var botonGaleria = document.getElementById("botonGaleria");
    botonGaleria.addEventListener("click", pulsarGaleria);
}

function pulsarCamara() {
    window.location.href = '/captura';
}

function pulsarGaleria() {
    window.location.href = '/galeria';
}