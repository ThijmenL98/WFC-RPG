import * as Phaser from 'phaser'
import * as spriteAssetKey from 'assets/spriteAssetKey.json!json';
import {Editor} from "Editor";
import {WFC} from 'WFC';

/*************** TODO: refactor code ************** */
// set WFC dimensions
var WFCTest;
var editor;
var tile_json = {
  tiles: [
      {name: 'tile_1', symmetry: '\\'},
      {name: 'tile_2', symmetry: 'L'},
      {name: 'tile_3', symmetry: 'X'}
  ],
  // Number after tile name is referring to rotation. 
  // 0 = 0 degree rotation, 1 = 90 degree rotation, 2 = 180 degree rotation,
  // 3 = 270 degree rotation.
  neighbors: [
      {left: 'tile_1 0', right: 'tile_2 0'},
      {left: 'tile_2 0', right: 'tile_3 0'},
      {left: 'tile_3 0', right: 'tile_1 1'}
  ]
}
<<<<<<< 3d5dd3c053d64a6a9c392f9d080972bd8bf7fc8b
var constraint_json = {
    LayerManager : 2,
    ItemManager : {}
}
=======

// more spagetti code dump - yay
// listens for tile number change
var sizeButton = document.getElementById("sizeButton");
var tileNum = +document.getElementById("tileSizeInput").value;      // number of tiles in x
var exportButton = document.getElementById("exportButton");

sizeButton.addEventListener("click", function(){
    tileNum = +document.getElementById("tileSizeInput").value;
    handler();
});

<<<<<<< e6a1b9ad0422cebc529166ccc791248eefe609c7

>>>>>>> feat: add regenerate and user input for tile size to generate map - still need to make input button functional
=======
>>>>>>> feat: add export button with functionality
WFCTest = new WFC(false, tileNum, tileNum, test_json);

exportButton.addEventListener("click", function(){
    // WFCTest.getTiled2dmap();
    var json_to_file = WFCTest.getTiled2dmap();

    let a = document.createElement("a");
    let json_string = JSON.stringify(json_to_file, null, 4);
    let file = new Blob([json_string], {type: 'text/plain'});
    a.href = URL.createObjectURL(file);
    a.download = 'testJson.json';
    a.click(); // wow what a terrible hack.
});


var pcg_tilemap = WFCTest.getTiled2dmap();
var tileSize = pcg_tilemap.tilesets[0].tileheight;     // x size of tiles (pixels)

// set selector dimensions
var selectorY = Math.ceil(pcg_tilemap.tilesets[0].tilecount/pcg_tilemap.height);    // number of rows of tiles

// calculate world dimensions
var worldWidth = tileSize * tileNum;   // x size of world (pixels)
var worldLength = tileSize * (tileNum+selectorY);     // y size of world (pixels)

/*************** Start Phaser ************** */
var game = new Phaser.Game(worldWidth, worldLength, Phaser.AUTO, '', { preload: preload, create: create, update: update });

editor = new Editor(tileNum, tileSize, selectorY);
function preload () {
//   editor.Preload(game);
  //Testing
    game.load.image('lil', 'assets/Lil_Prom.png')
    // game.load.image('maleSpriteSheet', 'assets/sprites/Male_SpriteSheet.png');
    game.load.image('maleSpriteSheet', 'assets/sprites/Male_SpriteSheet.png');
    game.load.image('testSpriteSheet', 'assets/sprites/test.png');

    //Shaders
    game.load.shader('TileMapFrag', 'assets/shaders/TileMap.frag');
    game.load.shader('TileMapVert', 'assets/shaders/TileMap.vert');
    game.load.shader('TestUV', 'assets/shaders/TestUV.frag');

    //Character sprites
    game.load.image('player', 'assets/sprites/PlayerSample.png')
    game.load.image('NPC', 'assets/sprites/PlayerSample2.png')

    //Assorted sprites
    game.load.image('door', 'assets/sprites/door.png')
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    
    //Tilemaps
    // game.load.image('RPGTown32x32', '/assets/tilesets/RPGTown32x32.png');
    game.load.image('Town_A', 'assets/tilesets/wolfsong/Town_A.png');
    game.load.image('Town_B', 'assets/tilesets/wolfsong/Town_B.png');
    game.load.image('City_A', 'assets/tilesets/wolfsong/City_A.png');
    game.load.image('City_B', 'assets/tilesets/wolfsong/City_B.png');
    game.load.image('Interior_A', 'assets/tilesets/wolfsong/Interior_A.png');
    game.load.image('Interior_B', 'assets/tilesets/wolfsong/Interior_B.png');
    game.load.image('FF_Set_1', 'assets/tilesets/wolfsong/FF_Set_1.png');
    game.load.image('Streets01b', 'assets/tilesets/wolfsong/Streets01b.png');
    game.load.image('BlackForest_A', 'assets/tilesets/wolfsong/BlackForest_A.png');
    game.load.image('Forests_B', 'assets/tilesets/wolfsong/Forests_B.png');

    game.load.tilemap('testPCG', null, pcg_tilemap, Phaser.Tilemap.TILED_JSON)
    // game.load.tilemap('turnipFarm', 'assets/tilemaps/turnipFarm.json', null, Phaser.Tilemap.TILED_JSON)
    // game.load.tilemap('turniptown', 'assets/tilemaps/turniptown.json', null, Phaser.Tilemap.TILED_JSON)
    // game.load.tilemap('turniptown2', 'assets/tilemaps/turniptown2.json', null, Phaser.Tilemap.TILED_JSON)
    // game.load.tilemap('town', 'assets/tilemaps/town.json', null, Phaser.Tilemap.TILED_JSON)
    // game.load.tilemap('pubInterior', 'assets/tilemaps/pubInterior.json', null, Phaser.Tilemap.TILED_JSON)
    // game.load.tilemap('shopInterior', 'assets/tilemaps/shopInterior.json', null, Phaser.Tilemap.TILED_JSON)

    //UI
    game.load.image('testDialogueBox', 'assets/sprites/ui/testDialogueBox.png')
    game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71)

}

function create () {
    game.stage.backgroundColor = '#ccc';
    let map = game.add.tilemap('testPCG');
    map.addTilesetImage(map.tilesets[0].name, map.tilesets[0].name);

    let layer = map.createLayer(0);
    layer.fixedToCamera = false;
    // move layer in y direction to make room for selector
    layer.position.setTo(0, selectorY*tileSize);

    // Creates editor selection
    editor.Create(game, map, layer);
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();

    // map.addTilesetImage('Town_A', 'Town_A')
    // map.addTilesetImage('Town_B', 'Town_B')
    // map.addTilesetImage('City_A', 'City_A')
    // map.addTilesetImage('City_B', 'City_B')
    // map.addTilesetImage('Interior_A', 'Interior_A')
    // map.addTilesetImage('Interior_B', 'Interior_B')
    // map.addTilesetImage('FF_Set_1', 'FF_Set_1')
    // map.addTilesetImage('Streets01b', 'Streets01b')
    // map.addTilesetImage('BlackForest_A', 'BlackForest_A')
    // map.addTilesetImage('Forests_B', 'Forests_B')
    
    layer.resizeWorld();
    // console.log(map, pcg_tilemap);
}

function update() {
    // TODO: add player movement mechanics

    // editor.Update(game);
}


// look at this lovely hack
function handler() {
    // recreate game when button clicked

    if(game) {
        game.destroy();
        game = null;

        WFCTest = new WFC(false, tileNum, tileNum, test_json);
        pcg_tilemap = WFCTest.getTiled2dmap();
        selectorY = Math.ceil(pcg_tilemap.tilesets[0].tilecount/pcg_tilemap.height);    // number of rows of tiles
        worldWidth = tileSize * tileNum;   // x size of world (pixels)
        worldLength = tileSize * (tileNum+selectorY);     // y size of world (pixels)

        game = new Phaser.Game({
            width:          worldWidth, 
            height:         worldLength,
            renderer:       Phaser.AUTO,
            parent:         "",
            enableDebug:    false,
            state:          {
                    preload:        preload,
                    create:         create,
                    update:         update
            },
        });
        console.log(typeof map);
        editor = new Editor(tileNum, tileSize, selectorY);
        create();
    } else {
        console.log('no game')
    }
}