var marker;
var Game;
var currentTile = 0;
var bmd;
var map;
var wfcMap;
var layer;
var editorLayer;
var cursors;
var player;
var facing = 'left';
var jumpTimer = 0;
var jumpButton;
export class Editor {
  constructor() {
    this.currentTileMarker = 0;
  }

  Preload(game) {
    // game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    // game.load.image('Town_B', 'assets/tilesets/wolfsong/Town_A.png');
  }
  Create(game, wfcMap, layer) {
    console.log(game);
    
    this.Game = game;
    this.layer = layer;
    this.wfcMap = wfcMap;

    //  Creates a blank tilemap
    map = game.add.tilemap();

    // Adds tileset for tile selection
    map.addTilesetImage(wfcMap.tilesets[0].name, wfcMap.tilesets[0].name);
    
    editorLayer = map.create('level1', 16, 18, 32, 32);
 
    let area = new Phaser.Rectangle(0, 0, 32 * 16, 32 * 2);
    bmd = game.make.bitmapData(32 * 16, 32 * 2);
    bmd.addToWorld();
    
    var i = 0;
    for (var n = 0; n < 2; n++) {
        for (var m = 0; m < 16; m++) {
            map.putTile(i, m, n, layer);
            i++;
        }
    }

    map.setCollisionByExclusion([0]);

    //  Create tile selector at the top of the screen
    this.CreateTileSelector(this.Game);

    player = this.Game.add.sprite(64, 100, 'dude');
    this.Game.physics.arcade.enable(player);
    this.Game.physics.arcade.gravity.y = 350;

    player.body.bounce.y = 0.1;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = this.Game.input.keyboard.createCursorKeys();
    jumpButton = this.Game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.Game.input.addMoveCallback(this.UpdateMarker, this);
  }

  Update(game, player) {
    game.physics.arcade.collide(player, layer);

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }
    
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }

  }
  PickTile(sprite, pointer, game) {
    // console.log('pick tile');
    var x = this.Game.math.snapToFloor(pointer.x, 32, 0);
    var y = this.Game.math.snapToFloor(pointer.y, 32, 0);

    this.currentTileMarker.x = x;
    this.currentTileMarker.y = y;

    x /= 32;
    y /= 32;

    currentTile = x + (y * 16);

    console.log(currentTile);
  }

  CreateTileSelector(game) {

    //  Our tile selection window
    var tileSelector = game.add.group();

    var tileSelectorBackground = game.make.graphics();
    tileSelectorBackground.beginFill(0x000000, 0.3);
    tileSelectorBackground.drawRect(0, 0, 800, 66);
    tileSelectorBackground.endFill();

    tileSelector.add(tileSelectorBackground);

    var tileStrip = tileSelector.create(1, 1, bmd);
    tileStrip.inputEnabled = true;
    tileStrip.events.onInputDown.add(this.PickTile, this);

    //  Our painting marker
    this.marker = game.add.graphics();
    this.marker.lineStyle(2, 0x000000, 1);
    this.marker.drawRect(0, 0, 32, 32);

    //  Our current tile marker
    this.currentTileMarker = game.add.graphics();
    this.currentTileMarker.lineStyle(1, 0xffffff, 2);
    this.currentTileMarker.drawRect(0, 0, 32, 32);

    // console.log(this.currentTileMarker)

    tileSelector.add(this.currentTileMarker);

  }

  UpdateMarker() {
    this.marker.x = this.layer.getTileX(this.Game.input.activePointer.worldX) * 32;
    this.marker.y = this.layer.getTileY(this.Game.input.activePointer.worldY) * 32;
    
    if (this.Game.input.mousePointer.isDown && this.marker.y > 32)
    {
        this.wfcMap.removeTile(this.layer.getTileX(this.marker.x), this.layer.getTileY(this.marker.y-64), this.layer);
        map.putTile(currentTile, this.layer.getTileX(this.marker.x), this.layer.getTileY(this.marker.y), editorLayer);
     }

  }
}
