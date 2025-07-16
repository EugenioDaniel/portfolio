// Función genérica para poder usar delays (funciones con esperas de tiempo)
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function alternarPantallaCompleta() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        $("#btn-pantalla-completa-2").css("transform", "rotate(0deg) translateY(-1vh)");
        $("#btn-pantalla-completa-2").attr("title", "Pantalla Completa");
    } else {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { // Safari
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE11
            elem.msRequestFullscreen();
        }
        $("#btn-pantalla-completa-2").css("transform", "rotate(180deg) translateY(-0.8vh)");
        $("#btn-pantalla-completa-2").attr("title", "Salir de Pantalla Completa");
    }
}

$(function alCargarLaPagina() {
    const pantallaCarga = document.getElementById("pantalla-carga");
    pantallaCarga.style.opacity = "1";
    setTimeout(() => {
        pantallaCarga.style.transition = "opacity 1s ease";
        pantallaCarga.style.opacity = "0";
        setTimeout(() => {
            pantallaCarga.style.display = "none";
        }, 1000); // Espera a que termine la transición
    }, 2000); // Espera 2 segundos antes de iniciar la transición
});