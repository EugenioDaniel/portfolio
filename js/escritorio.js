$(function () {
    const escritorio_STR = "#escritorio";
    const app_STR = "app";
    const selected_STR = "selected";
    const escritorio = $(escritorio_STR);
    const totalCeldas = 55;

    // Calcular el número ideal de filas y columnas
    const columnas = Math.ceil(Math.sqrt(totalCeldas));
    const filas = Math.ceil(totalCeldas / columnas);

    // Lista de apps predefinidas
    cv_STR = "CV";
    github_STR = "GitHub";
    linkedin_STR = "LinkedIn";
    correo_STR = "Correo";
    const apps = {
        0: [cv_STR, "../miscelaneous/img/cv.png", "Abre mi Currículum Vitae"],
        1: [github_STR, "../miscelaneous/img/github.png", "Abre mi GitHub en una nueva pestaña"],
        2: [linkedin_STR, "../miscelaneous/img/linkedIn.png", "Abre mi LinkedIn en una nueva pestaña"],
        3: [correo_STR, "../miscelaneous/img/correo.png", "Envíame un correo electrónico"]
    };

    function seleccionarApp(app) {
        $("." + app_STR).removeClass(selected_STR);
        app.addClass(selected_STR);
    }

    // Crear celdas
    for (let i = 0; i < totalCeldas; i++) {
        const $celda = $("<div>").addClass("celda").attr("data-index", i);
        escritorio.append($celda);
    }

    function anadirApp(nombre, rutaFoto, textoHover, posicion) {
        const $app = $("<div>").attr("id", nombre).addClass(app_STR).attr("title", textoHover);
        const $foto = $("<img>").attr("src", rutaFoto);
        const $texto = $("<span>").text(nombre);
        $app.append($foto).append($texto);
        $(`.celda[data-index="${posicion}"]`).append($app);
        $app.click(function () {
            seleccionarApp($(this));
        });
    }

    // Añadir apps
    for (const [posicion, info] of Object.entries(apps)) {
        let [nombre, rutaFoto, textoHover] = info;
        anadirApp(nombre, rutaFoto, textoHover, posicion);
    }

    // Hacer apps arrastrables
    $("." + app_STR).draggable({
        revert: "invalid",
        containment: escritorio_STR,
        zIndex: 100,
        start: function () {
            seleccionarApp($(this));
        }
    });

    // Hacer celdas droppable
    $(".celda").droppable({
        accept: function (draggable) {
            return draggable.hasClass(app_STR) && $(this).is(":empty");
        },
        hoverClass: "destino",
        tolerance: "pointer",
        drop: function (event, ui) {
            const $celdaDestino = $(this);
            const $icono = ui.draggable;
            $icono.detach().css({ top: 0, left: 0 }).appendTo($celdaDestino);
        }
    });

    $("#" + github_STR).dblclick(function () {
        window.open("https://github.com/EugenioDaniel");
    });

    $("#" + linkedin_STR).dblclick(function () {
        window.open("https://es.linkedin.com/in/eugenio-daniel-sanchez-gil-8a1244250");
    });

    $("#" + correo_STR).dblclick(function () {
        window.open("mailto:eugeniodanielsanchez@gmail.com");
    });

    $("#" + cv_STR).dblclick(function () {
        crearVentana("Currículum Vitae", "../miscelaneous/pdf/CV.pdf");
    });

    $(".celda:not(:has(.app))").click(function () {
        $("." + app_STR).removeClass(selected_STR);
    });

    // Ventanas

    function crearVentana(titulo, url) {
        const $ventana = $(`
        <div class="ventana en-grande cristal">
            <div class="barra-titulo">
                <span class="titulo">${titulo}</span>
                <span class="pequenizar">❐</span>
                <span class="cerrar">X</span>
            </div>
            <div class="contenido">
                <iframe src="${url}"></iframe>
            </div>
        </div>
        `);

        // Agregar a la página
        $("#ventanas").append($ventana);

        // Centrar en pantalla
        const left = ($(window).width() - $ventana.width()) / 2;
        const top = ($(window).height() - $ventana.height()) / 2;
        $ventana.css({ top, left });

        // Hacerla arrastrable
        $ventana.draggable({
            handle: ".barra-titulo",
            containment: "window"
        });

        // Botón de cerrar
        $ventana.find(".cerrar").click(function () {
            $ventana.remove();
        });

        // Botón de que sea movible
        $ventana.find(".pequenizar").click(function () {
            $ventana.toggleClass("en-grande");
            actualizarResizable();
        });
        $ventana.find(".barra-titulo").dblclick(function () {
            $ventana.toggleClass("en-grande");
            actualizarResizable();
        });

        // Hacer redimensionable solo si NO tiene la clase en-grande
        function actualizarResizable() {
            if ($ventana.hasClass("en-grande")) {
                if ($ventana.hasClass("ui-resizable")) {
                    $ventana.resizable("destroy");
                }
            } else {
                $ventana.resizable({
                    handles: "all",
                    minWidth: 300,
                    minHeight: 200,
                    containment: "#ventanas"//,
                    //alsoResize: $ventana.find("iframe")
                });
            }
        }

        // Inicialmente está en-grande, así que no es redimensionable
        actualizarResizable();
    }

    // Selección múltiple por arrastre
    let isSelecting = false;
    let $selectionBox = null;
    let startX, startY;

    $(escritorio_STR).on("mousedown", function (e) {
        // Solo si el click es sobre el escritorio y no sobre una app
        if ($(e.target).hasClass("celda") || $(e.target).attr("id") === "escritorio") {
            isSelecting = true;
            startX = e.pageX;
            startY = e.pageY;

            $selectionBox = $("<div>")
                .css({
                    position: "absolute",
                    border: "2px dashed #fff",
                    background: "rgba(255,255,255,0.15)",
                    left: startX,
                    top: startY,
                    width: 0,
                    height: 0,
                    zIndex: 9999,
                    pointerEvents: "none"
                })
                .attr("id", "selection-box");
            $("body").append($selectionBox);
        }
    });

    $(document).on("mousemove", function (e) {
        if (isSelecting && $selectionBox) {
            let x = Math.min(e.pageX, startX);
            let y = Math.min(e.pageY, startY);
            let w = Math.abs(e.pageX - startX);
            let h = Math.abs(e.pageY - startY);
            $selectionBox.css({ left: x, top: y, width: w, height: h });

            // Selección dinámica de apps mientras arrastras
            const boxLeft = x;
            const boxTop = y;
            const boxRight = x + w;
            const boxBottom = y + h;

            $("." + app_STR).each(function () {
                const $app = $(this);
                const offset = $app.offset();
                const left = offset.left;
                const top = offset.top;
                const right = left + $app.width();
                const bottom = top + $app.height();

                if (right > boxLeft && left < boxRight && bottom > boxTop && top < boxBottom) {
                    $app.addClass(selected_STR);
                } else {
                    $app.removeClass(selected_STR);
                }
            });
        }
    });

    $(document).on("mouseup", function (e) {
        if (isSelecting && $selectionBox) {
            isSelecting = false;

            // Calcular el área de selección
            const boxOffset = $selectionBox.offset();
            const boxLeft = boxOffset.left;
            const boxTop = boxOffset.top;
            const boxRight = boxLeft + $selectionBox.width();
            const boxBottom = boxTop + $selectionBox.height();

            // Seleccionar apps dentro del área
            $("." + app_STR).each(function () {
                const $app = $(this);
                const offset = $app.offset();
                const left = offset.left;
                const top = offset.top;
                const right = left + $app.width();
                const bottom = top + $app.height();

                // Si el app está dentro del rectángulo de selección
                if (right > boxLeft && left < boxRight && bottom > boxTop && top < boxBottom) {
                    $app.addClass(selected_STR);
                }
            });

            $selectionBox.remove();
            $selectionBox = null;
        }
    });

});
