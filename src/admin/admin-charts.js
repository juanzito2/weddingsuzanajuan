/**
 * ============================================================
 * SUZANA & JUAN
 * ADMIN CHARTS
 * ============================================================
 *
 * Recebe as memórias já carregadas pelo admin.js.
 * Não acessa Supabase diretamente.
 * ============================================================
 */


export function renderAdminCharts(memories = []) {

    const safeMemories =
        Array.isArray(memories)
            ? memories
            : [];


    renderStatusChart(
        safeMemories
    );


    renderActivityChart(
        safeMemories
    );
}


/**
 * ============================================================
 * STATUS BAR CHART
 * ============================================================
 */

function renderStatusChart(memories) {

    const container =
        document.querySelector(
            "[data-bar-chart]"
        );


    if (!container) {
        return;
    }


    const data = [

        {
            label: "Pendientes",

            value:
                memories.filter(
                    memory =>
                        memory.status ===
                        "pending"
                ).length
        },

        {
            label: "Publicados",

            value:
                memories.filter(
                    memory =>
                        memory.status ===
                        "approved"
                ).length
        },

        {
            label: "Destacados",

            value:
                memories.filter(
                    memory =>
                        memory.status ===
                            "approved"
                        &&
                        memory.featured ===
                            true
                ).length
        }

    ];


    const max =
        Math.max(
            ...data.map(
                item => item.value
            ),
            1
        );


    container.innerHTML = "";


    const chart =
        document.createElement(
            "div"
        );


    chart.className =
        "royal-bar-chart";


    data.forEach(
        (item, index) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "royal-bar-chart__row";


            const label =
                document.createElement(
                    "span"
                );


            label.className =
                "royal-bar-chart__label";


            label.textContent =
                item.label;


            const track =
                document.createElement(
                    "div"
                );


            track.className =
                "royal-bar-chart__track";


            const bar =
                document.createElement(
                    "div"
                );


            bar.className =
                "royal-bar-chart__bar";


            track.appendChild(
                bar
            );


            const value =
                document.createElement(
                    "strong"
                );


            value.className =
                "royal-bar-chart__value";


            value.textContent =
                String(item.value);


            row.append(
                label,
                track,
                value
            );


            chart.appendChild(
                row
            );


            const percentage =
                item.value === 0
                    ? 0
                    : Math.max(
                        8,
                        (
                            item.value /
                            max
                        )
                        *
                        100
                    );


            window.setTimeout(
                () => {

                    bar.style.width =
                        `${percentage}%`;

                },
                120 + index * 100
            );

        }
    );


    container.appendChild(
        chart
    );
}


/**
 * ============================================================
 * ACTIVITY LINE CHART
 * ============================================================
 */

function renderActivityChart(memories) {

    const container =
        document.querySelector(
            "[data-line-chart]"
        );


    if (!container) {
        return;
    }


    const datedMemories =
        memories
            .map(
                memory => ({

                    ...memory,

                    chartDate:
                        parseMemoryDate(
                            memory
                        )

                })
            )
            .filter(
                memory =>
                    memory.chartDate
            );


    if (
        datedMemories.length === 0
    ) {

        container.innerHTML = `
            <div class="admin-chart__empty">
                La actividad aparecerá aquí cuando los invitados
                comiencen a compartir recuerdos.
            </div>
        `;

        return;
    }


    const grouped =
        groupByDay(
            datedMemories
        );


    const entries =
        Array.from(
            grouped.entries()
        )
            .sort(
                (a, b) =>
                    a[0] - b[0]
            )
            .slice(-7);


    drawLineChart(
        container,
        entries
    );
}


/**
 * ============================================================
 * GROUP
 * ============================================================
 */

function groupByDay(memories) {

    const map =
        new Map();


    memories.forEach(
        memory => {

            const date =
                memory.chartDate;


            const day =
                new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                );


            const key =
                day.getTime();


            map.set(
                key,
                (
                    map.get(key)
                    ??
                    0
                )
                +
                1
            );

        }
    );


    return map;
}


/**
 * ============================================================
 * DRAW SVG
 * ============================================================
 */

function drawLineChart(
    container,
    entries
) {

    container.innerHTML = "";


    const width = 700;
    const height = 230;

    const padding = {
        top: 20,
        right: 20,
        bottom: 38,
        left: 35
    };


    const innerWidth =
        width
        -
        padding.left
        -
        padding.right;


    const innerHeight =
        height
        -
        padding.top
        -
        padding.bottom;


    const values =
        entries.map(
            entry =>
                entry[1]
        );


    const maxValue =
        Math.max(
            ...values,
            1
        );


    const svg =
        createSVG(
            "svg"
        );


    svg.setAttribute(
        "viewBox",
        `0 0 ${width} ${height}`
    );


    svg.setAttribute(
        "preserveAspectRatio",
        "none"
    );


    /* GRADIENT */

    const defs =
        createSVG(
            "defs"
        );


    const gradient =
        createSVG(
            "linearGradient"
        );


    gradient.setAttribute(
        "id",
        "royalActivityGradient"
    );


    gradient.setAttribute(
        "x1",
        "0"
    );


    gradient.setAttribute(
        "y1",
        "0"
    );


    gradient.setAttribute(
        "x2",
        "0"
    );


    gradient.setAttribute(
        "y2",
        "1"
    );


    gradient.append(
        createStop(
            "0%",
            "#70499a",
            "0.20"
        ),

        createStop(
            "100%",
            "#70499a",
            "0"
        )
    );


    defs.appendChild(
        gradient
    );


    svg.appendChild(
        defs
    );


    /* GRID */

    for (
        let index = 0;
        index < 4;
        index++
    ) {

        const y =
            padding.top
            +
            (
                innerHeight /
                3
            )
            *
            index;


        const line =
            createSVG(
                "line"
            );


        line.setAttribute(
            "x1",
            padding.left
        );


        line.setAttribute(
            "x2",
            width - padding.right
        );


        line.setAttribute(
            "y1",
            y
        );


        line.setAttribute(
            "y2",
            y
        );


        line.setAttribute(
            "class",
            "chart-grid-line"
        );


        svg.appendChild(
            line
        );

    }


    const points =
        entries.map(
            (entry, index) => {

                const x =
                    entries.length === 1
                        ?
                        (
                            padding.left
                            +
                            innerWidth / 2
                        )
                        :
                        (
                            padding.left
                            +
                            (
                                innerWidth /
                                (
                                    entries.length -
                                    1
                                )
                            )
                            *
                            index
                        );


                const y =
                    padding.top
                    +
                    innerHeight
                    -
                    (
                        entry[1] /
                        maxValue
                    )
                    *
                    (
                        innerHeight -
                        10
                    );


                return {
                    x,
                    y,
                    timestamp:
                        entry[0],

                    value:
                        entry[1]
                };

            }
        );


    const linePath =
        points
            .map(
                (point, index) =>
                    `${
                        index === 0
                            ? "M"
                            : "L"
                    } ${point.x} ${point.y}`
            )
            .join(" ");


    const baseline =
        padding.top
        +
        innerHeight;


    const areaPath =
        points.length
            ?
            `${linePath}
             L ${points.at(-1).x} ${baseline}
             L ${points[0].x} ${baseline}
             Z`
            :
            "";


    const area =
        createSVG(
            "path"
        );


    area.setAttribute(
        "d",
        areaPath
    );


    area.setAttribute(
        "class",
        "chart-area"
    );


    svg.appendChild(
        area
    );


    const line =
        createSVG(
            "path"
        );


    line.setAttribute(
        "d",
        linePath
    );


    line.setAttribute(
        "class",
        "chart-line"
    );


    svg.appendChild(
        line
    );


    points.forEach(
        point => {

            const circle =
                createSVG(
                    "circle"
                );


            circle.setAttribute(
                "cx",
                point.x
            );


            circle.setAttribute(
                "cy",
                point.y
            );


            circle.setAttribute(
                "r",
                "4"
            );


            circle.setAttribute(
                "class",
                "chart-point"
            );


            svg.appendChild(
                circle
            );


            const label =
                createSVG(
                    "text"
                );


            label.setAttribute(
                "x",
                point.x
            );


            label.setAttribute(
                "y",
                height - 12
            );


            label.setAttribute(
                "text-anchor",
                "middle"
            );


            label.setAttribute(
                "class",
                "chart-axis-label"
            );


            label.textContent =
                formatDate(
                    point.timestamp
                );


            svg.appendChild(
                label
            );

        }
    );


    container.appendChild(
        svg
    );
}


/**
 * ============================================================
 * HELPERS
 * ============================================================
 */

function parseMemoryDate(memory) {

    const raw =
        memory.createdAt
        ??
        memory.created_at;


    if (!raw) {
        return null;
    }


    const date =
        new Date(raw);


    return Number.isNaN(
        date.getTime()
    )
        ? null
        : date;
}


function formatDate(timestamp) {

    return new Intl.DateTimeFormat(
        "es-ES",
        {
            day: "2-digit",
            month: "short"
        }
    )
        .format(
            new Date(timestamp)
        )
        .replace(".", "");
}


function createSVG(tag) {

    return document.createElementNS(
        "http://www.w3.org/2000/svg",
        tag
    );
}


function createStop(
    offset,
    color,
    opacity
) {

    const stop =
        createSVG(
            "stop"
        );


    stop.setAttribute(
        "offset",
        offset
    );


    stop.setAttribute(
        "stop-color",
        color
    );


    stop.setAttribute(
        "stop-opacity",
        opacity
    );


    return stop;
}