// like random.randint() from python
function randint(x, y) {
    return Math.floor(Math.random() * (y - x)) + x;
}

// Calculate numbers, etc.
function createTiles(width, height, bombs) {
    // Create tile template grid
    let tiles = [];

    for (y = 0; y < height; y++) {
        let row = [];

        for (x = 0; x < width; x++) {
            row.push(false);
        }
        tiles.push(row);
    }

    // Put in the bombs
    for (_ = 0; _ < bombs; _++) {
        let x;
        let y;
        do {
            x = randint(0, width);
            y = randint(0, height);
        }
        while (tiles[y][x] === "x")
        tiles[y][x] = "x";
    }

    // Put in the numbers
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            if (tiles[y][x] !== "x") {
                let surrounding = 0;
                // Check surrounding spaces for bombs
                for (y1 = -1; y1 <= 1; y1++) {
                    for (x1 = -1; x1 <= 1; x1++) {
                        try {
                            if (tiles[y + y1][x + x1] === "x") {
                                surrounding++;
                            }
                        } catch (TypeError) { }
                    }
                }
                tiles[y][x] = surrounding;
            }
        }
    }

    return tiles;
}

// Create tiles that make the game work
function createGrid(selector, width, height) {

    // Create rows
    for (y = 0; y < height; y++) {
        let row = $("<tr></tr>");

        // Create cells
        for (x = 0; x < width; x++) {
            let cell = $("<td></td>").attr("x", x).attr("y", y).addClass("unclicked");
            $(row).append(cell);
        }

        selector.append(row);
    }
}

$(document).ready(() => {
    let width = 18;
    let height = 14;
    let bombs = 40;

    let wh = location.search.replace("?", "").split("x").map(Number);
    if (wh.length === 3) {
        width = wh[0];
        height = wh[1];
        bombs = wh[2];
    }

    let table = $("#grid");
    let tiles = createTiles(width, height, bombs);
    let gameover = false;
    createGrid(table, width, height);

    let click = event => {
        let t = $(event.target);
        let x = t.attr("x");
        let y = t.attr("y");
        let tile = tiles[y][x];

        t.off('click');
        t.off("contextmenu")
        t.removeAttr("class");

        if (tile === 0) {
            for (y1 = -1; y1 <= 1; y1++) {
                for (x1 = -1; x1 <= 1; x1++) {
                    let x2 = Number(t.attr("x")) + x1;
                    let y2 = Number(t.attr("y")) + y1;

                    setTimeout(() => {
                        try {
                            table.children()[y2].children[x2].click();
                        } catch (TypeError) { }
                    }, 0);
                }
            }
            return;
        } else if (tile === "x") {
            t.addClass("bomb");
            if (!gameover) {
                $(".flag").contextmenu();
                let unclicked = $(".unclicked");
                gameover = true;
                unclicked.each(i => {
                    setTimeout(() => {
                        unclicked[i].click();
                    }, 100);
                });
            }
            return;
        }

        t.text(tile);
        //console.log("Click on coord: %c("+t.attr("x")+", "+t.attr("y")+")", "color: green");
    }

    let rightclick = event => {
        let t = $(event.target);
        event.preventDefault();

        if (t.attr("class") === "unclicked") {
            t.attr("class", "flag");
            t.off("click");
        } else {
            t.attr("class", "unclicked");
            t.on("click", click);
        }

        return false;
    }

    $("td").on("click", click);
    $("td").on("contextmenu", rightclick);
    $("table").on("contextmenu", () => { return false })
});