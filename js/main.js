// Función genérica para poder usar delays (funciones con esperas de tiempo)
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}