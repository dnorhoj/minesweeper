// like random.randint() from python
function randint(x, y) {
    return Math.floor(Math.random()*(y-x))+x;
}

// Calculate numbers, etc.
function createTiles(width, height, bombs) {
    // Create tile template grid
    let tiles = [];

    for (y=0; y<height; y++) {
        let row = [];

        for (x=0; x<width; x++) {
            row.push(false);
        }
        tiles.push(row);
    }

    // Put in the bombs
    for (_=0; _<bombs; _++) {
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
    for(y=0; y<height; y++) {
        for(x=0; x<width; x++) {
            if(tiles[y][x] !== "x") {
                let surrounding = 0;
                // Check surrounding spaces for bombs
                for(y1=-1; y1<=1; y1++) {
                    for(x1=-1; x1<=1; x1++) {
                        try {
                            if(tiles[y+y1][x+x1] === "x") {
                                surrounding++;
                            }
                        } catch (TypeError) {}
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
    for (y=0; y<height; y++) {
        let row = $("<tr></tr>");

        // Create cells
        for (x=0; x<width; x++) {
            let cell = $("<td></td>").attr("x", x).attr("y", y).addClass("unclicked");
            $(row).append(cell);
        }

        $(selector).append(row);
    }
}

$(document).ready(() => {
    let width = 18;
    let height = 14;
    let bombs = 40;

    let tiles = createTiles(width, height, bombs);
    createGrid("#grid", width, height);

    let click = event => {
        let t = $(event.target);
        let x = t.attr("x");
        let y = t.attr("y");

        let tile = tiles[y][x];

        t.off('click');
        t.off("contextmenu")
        t.removeAttr("class");
        t.text(tile);

        if(tile === 0) {
            for(y1=-1; y1<=1; y1++) {
                for(x1=-1; x1<=1; x1++) {
                    let x2 = Number(t.attr("x"))+x1;
                    let y2 = Number(t.attr("y"))+y1;

                    try {
                        $(".unclicked[x="+x2+"][y="+y2+"]").click()
                    } catch(TypeError) {}
                }
            }
        }
        console.log("Click! %c("+t.attr("x")+", "+t.attr("y")+")", "color: green");
    }

    let rightclick = event => {
        let t = $(event.target);

        if(t.attr("class") === "unclicked") {
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
    $("table").on("contextmenu", () => {return false})
});