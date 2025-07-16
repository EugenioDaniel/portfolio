$(function alCargarLaPagina() {

    const barraTareas_STR = "#barra-tareas";
    const hitboxBarraTareas_STR = "#hitbox-barra-tareas";

    async function esperarAndEsconderBarraDeTareas() {
        await delay(3000);
        if (!$(barraTareas_STR).is(":hover")) {
            $(barraTareas_STR).css("transform", "translateY(5vh)");
        }
    }

    $(barraTareas_STR).css("transform", "translateY(0vh)");
    esperarAndEsconderBarraDeTareas();

    $(hitboxBarraTareas_STR).hover(function mostrarBarraTareas() {
        $(barraTareas_STR).css("transform", "translateY(0vh)");
    });

    $(barraTareas_STR).hover(
        function alPonerRatonEncima() { },
        function alQuitarElRatonDeEncima() {
            esperarAndEsconderBarraDeTareas();
        }
    );

    function actualizarHoraBarraTareas() {
        const ahora = new Date();
        const horas = ahora.getHours().toString().padStart(2, '0');
        const minutos = ahora.getMinutes().toString().padStart(2, '0');
        const segundos = ahora.getSeconds().toString().padStart(2, '0');
        $("#hora").text(`${horas}:${minutos}:${segundos}`);

        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const diaTexto = ahora.toLocaleDateString('es-ES', opciones);
        $("#dia").text(diaTexto);
    }

    setInterval(actualizarHoraBarraTareas, 1000);
    actualizarHoraBarraTareas();

    $("#btn-pantalla-completa-2").click(function () {
        alternarPantallaCompleta()
    });

});