// Función genérica para poder usar delays (funciones con esperas de tiempo)
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

window.onload = function () {
    const pantallaCarga = document.getElementById("pantalla-carga");
    if (pantallaCarga) {
        pantallaCarga.style.transition = "opacity 0.5s ease";
        pantallaCarga.style.opacity = "0";
        setTimeout(() => {
            pantallaCarga.style.display = "none";
        }, 500);
    }
};