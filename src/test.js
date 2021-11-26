import {Controller} from './Controller/Controller'
import * as test_json from "./testJSON.json!json"

// Controller parameters: type, tileJSON, subset, newGame
const wfcController = new Controller('Phaser', test_json, "item", false, true, null, null, 2);
wfcController.displayView();

const numButton = document.getElementById("numButton");
numButton.addEventListener("click", function(){
    wfcController.updateView();
});

const exportButton = document.getElementById("exportButton");
exportButton.addEventListener("click", function(){
    wfcController.updateTileMap();
    const json_to_file = wfcController.getTile2DJSON();

    let a = document.createElement("a");
    let json_string = JSON.stringify(json_to_file, null, 4);
    let file = new Blob([json_string], {type: 'text/plain'});
    a.href = URL.createObjectURL(file);
    a.download = 'testJson.json';
    a.click(); // wow what a terrible hack.
});

const testButton = document.getElementById("testRuns");
testButton.addEventListener("click", function(){
    console.log('Non-local Constraint');
    for(let i = 0; i<50; i++) {
        numButton.click();
    }
    console.log('done')
});

let updateButton = document.getElementById("updateButton");
updateButton.addEventListener("click", function(){
    wfcController.getTilesUpdated();
    wfcController.updateTileMap();
});

updateButton = document.getElementById("itemToggle");
updateButton.addEventListener("click", function(){
    wfcController.includeItem = wfcController.includeItem !== true;
    wfcController.itemToggle();
});