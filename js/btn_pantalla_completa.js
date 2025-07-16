$(function alCargarLaPagina() {

    const pantallaCompleta_STR = "#btn-pantalla-completa";

    function esconderBtnPantallaCompleta() {
        $(pantallaCompleta_STR).css("transition", "transform 0.6s");
        $(pantallaCompleta_STR).fadeOut(300);
        $(pantallaCompleta_STR).css("transform", "translateY(-5vh)");
    }

    async function esperarAndEsconderBtnPantallaCompleta() {
        await delay(3000);
        if (!$(pantallaCompleta_STR).is(":hover")) {
            esconderBtnPantallaCompleta();
        }
    }

    esperarAndEsconderBtnPantallaCompleta();

    $(pantallaCompleta_STR).hover(
        function alPonerRatonEncima() { },
        function alQuitarElRatonDeEncima() {
            esperarAndEsconderBtnPantallaCompleta();
        }
    );

    $(pantallaCompleta_STR).click(function () {

        esconderBtnPantallaCompleta();

        alternarPantallaCompleta()
    });

});