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
        setTimeout(() => {
            app.addClass(selected_STR);
        }, 50);
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
            //seleccionarApp($(this));
            // Si hay varias seleccionadas, marcar todas como "dragging"
            if ($("." + app_STR + ".selected").length > 1) {
                $("." + app_STR + ".selected").addClass("dragging-multiple");
            } else {
                // Si solo hay una app seleccionada, no hacer nada
                if ($(this).hasClass(selected_STR)) {
                    return;
                } else {
                    // Si no hay ninguna seleccionada, seleccionar esta
                    seleccionarApp($(this));
                }
            }
        },
        stop: function () {
            $("." + app_STR).removeClass("dragging-multiple");
        }
    });

    // Hacer celdas droppable
    $(".celda").droppable({
        accept: function (draggable) {
            return draggable.hasClass(app_STR);
        },
        hoverClass: "destino",
        tolerance: "pointer",
        drop: function (event, ui) {
            const $celdaDestino = $(this);
            const $icono = ui.draggable;
            const $seleccionadas = $("." + app_STR + ".selected");
            const $todasCeldas = $(".celda");

            if ($seleccionadas.length > 1) {
                const $todasCeldas = $(".celda");
                const columnas = Math.ceil(Math.sqrt($todasCeldas.length));

                let appsOrdenadas = $seleccionadas.toArray().sort(function (a, b) {
                    let idxA = $todasCeldas.index($(a).parent()[0]);
                    let idxB = $todasCeldas.index($(b).parent()[0]);
                    return idxA - idxB;
                });

                let indicesOriginales = appsOrdenadas.map(function (app) {
                    return $todasCeldas.index($(app).parent());
                });

                let minIdx = Math.min(...indicesOriginales);
                let minRow = Math.floor(minIdx / columnas);
                let minCol = minIdx % columnas;

                let destinoIdx = $todasCeldas.index($celdaDestino);
                let destinoRow = Math.floor(destinoIdx / columnas);
                let destinoCol = destinoIdx % columnas;

                let celdasDestino = [];
                let indicesDestino = [];
                let puedeMover = true;

                // Calcular celdas destino y comprobar que no se repiten
                let destinoSet = new Set();
                for (let i = 0; i < appsOrdenadas.length; i++) {
                    let idx = indicesOriginales[i];
                    let row = Math.floor(idx / columnas);
                    let col = idx % columnas;
                    let relRow = row - minRow;
                    let relCol = col - minCol;
                    let nuevaRow = destinoRow + relRow;
                    let nuevaCol = destinoCol + relCol;
                    let nuevoIdx = nuevaRow * columnas + nuevaCol;

                    // Si ya hay una app que va a esa celda, no se puede mover
                    if (destinoSet.has(nuevoIdx)) {
                        puedeMover = false;
                        break;
                    }
                    destinoSet.add(nuevoIdx);

                    indicesDestino.push(nuevoIdx);

                    let $nuevaCelda = $todasCeldas.eq(nuevoIdx);
                    if ($nuevaCelda.length === 0) {
                        puedeMover = false;
                        break;
                    }
                    celdasDestino.push($nuevaCelda);
                }

                // Comprobar que ninguna celda destino (excepto las originales) esté ocupada por una app que no se está moviendo
                if (puedeMover) {
                    for (let i = 0; i < celdasDestino.length; i++) {
                        let $celda = celdasDestino[i];
                        // Si la celda destino no es una de las originales y está ocupada, no se puede mover
                        if (
                            !indicesOriginales.includes(indicesDestino[i]) &&
                            $celda.children("." + app_STR).length > 0
                        ) {
                            puedeMover = false;
                            break;
                        }
                    }
                }

                // Si todas las celdas destino son válidas, mover
                if (puedeMover && celdasDestino.length === appsOrdenadas.length) {
                    for (let i = 0; i < appsOrdenadas.length; i++) {
                        $(appsOrdenadas[i]).detach().css({ top: 0, left: 0 }).appendTo(celdasDestino[i]);
                    }
                } else {
                    // Si no se pueden mover todas, ajustar la app arrastrada al grid
                    const $celdaOriginal = $todasCeldas.eq($todasCeldas.index($icono.parent()));
                    $icono.detach().css({ top: 0, left: 0 }).appendTo($celdaOriginal);
                }
            } else {
                // Solo una app, pero solo la mueves si la celda destino está vacía
                if ($celdaDestino.is(":empty")) {
                    $icono.detach().css({ top: 0, left: 0 }).appendTo($celdaDestino);
                } else {
                    // Ajustar la app al grid en su posición original
                    const $celdaOriginal = $todasCeldas.eq($todasCeldas.index($icono.parent()));
                    $icono.detach().css({ top: 0, left: 0 }).appendTo($celdaOriginal);
                }
            }
        }
    });

    $("#" + github_STR).dblclick(function () {
        window.open("https://github.com/EugenioDaniel");
    });

    $("#" + linkedin_STR).dblclick(function () {
        window.open("https://es.linkedin.com/in/eugenio-daniel-sanchez-gil-8a1244250");
    });

    $("#" + correo_STR).dblclick(function () {
        window.open("mailto:eugeni@eugeni.es");
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