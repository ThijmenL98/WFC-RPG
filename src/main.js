import * as Phaser from 'phaser'
import {Editor} from "Editor";
import {WFC} from 'WFC'
import * as tileset_info from "./Model/WaveFunctionCollapse/tile_info.json!json"

// debugger
let game = new Phaser.Game(512, 512, Phaser.AUTO, '', {preload: preload, create: create, update: update});
let editor;
const tilemap = WFC(false, 16, 16, tileset_info);
console.log(tilemap)

debugger
editor = new Editor();

function preload() {
    //Testing
    game.load.image('lil', 'assets/Lil_Prom.png')
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

    game.load.tilemap('testPCG', null, pcg_tilemap, Phaser.Tilemap.TILED_JSON);

    game.load.image('testDialogueBox', 'assets/sprites/ui/testDialogueBox.png');
    game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);

}

function create() {
    game.stage.backgroundColor = '#ccc';
    let map = game.add.tilemap('testPCG');
    map.addTilesetImage(map.tilesets[0].name, map.tilesets[0].name);

    let layer = map.createLayer(0);
    layer.fixedToCamera = false;
    layer.position.setTo(0, selectorY * tileSize);

    editor.Create(game, map, layer);
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();

    layer.resizeWorld();
}

function update() {
}
