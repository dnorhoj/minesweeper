// like random.randint() from python
function randint(x, y) {
    return Math.floor(Math.random()*(y-x))+x;
}

// Calculate numbers, etc.
function createTiles(width, height, bombs) {
    // Create tile template grid
    let tiles = [];

    // Fill in all rows with null
    for (y=0; y<height; y++) {
        let row = [];

        for (x=0; x<width; x++) {
            row.push(null);
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
        while (tiles[y][x] == "x")
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
                            if(tiles[y+y1][x+x1] == "x") {
                                surrounding++;
                            }
                        } catch (TypeError) {}
                    }
                }
                tiles[y][x] = String(surrounding);
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

    $("td").on("click", event => {
        let t = $(event.target);
        console.log("Click! %c("+t.attr("x")+", "+t.attr("y")+")", "color: green");
        t.text(tiles[t.attr("y")][t.attr("x")])
        t.attr("class", "")
    })
});