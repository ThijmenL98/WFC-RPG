import {Controller} from './Controller'
import * as test_json from "./testJSON.json!json"

// Controller parameters: type, tileJSON, subset, newGame
var type = "Phaser";

var model_data = {
    tileJSON : test_json,
    subset : "item",
    includeItem : true,
    rule_flags : {
        tiles : true,
        items : null,
        num : 2
    },
    newGame : false
}
console.log(test_json["data"]);
var wfcController = new Controller(type, model_data);
wfcController.displayView();

var numButton = document.getElementById("numButton");
numButton.addEventListener("click", function(){
    wfcController.updateView();
});

var exportButton = document.getElementById("exportButton");
exportButton.addEventListener("click", function(){
    wfcController.updateTileMap();
    var json_to_file = wfcController.getTile2DJSON();

    let a = document.createElement("a");
    let json_string = JSON.stringify(json_to_file, null, 4);
    let file = new Blob([json_string], {type: 'text/plain'});
    a.href = URL.createObjectURL(file);
    a.download = 'testJson.json';
    a.click(); // wow what a terrible hack.
});

var testButton = document.getElementById("testRuns");
testButton.addEventListener("click", function(){
    console.log('Non-local Constraint');
    for(let i = 0; i<50; i++) {
        numButton.click();
    }
    console.log('done')
});

var updateButton = document.getElementById("updateButton");
updateButton.addEventListener("click", function(){
    wfcController.getTilesUpdated();
    wfcController.updateTileMap();
});

var updateButton = document.getElementById("itemToggle");
updateButton.addEventListener("click", function(){
    if (wfcController.includeItem == true) {
        wfcController.includeItem = false;
    } else {
        wfcController.includeItem = true;
    }

    console.log(test_json['tiles_info']);
    wfcController.itemToggle();   
    
});