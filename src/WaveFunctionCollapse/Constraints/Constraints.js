export function Dependency() {
    console.log("dependency")
}

export function Locality() {
    console.log("locality")
}

export function GetDependecies(items) {
    let dependecies = {
        items: []
    }
    return dependecies
}
// TODO: neighbors doesn't reflect the changes of having an item or something
//else. Figure out how to conform data to fit the way you wrote this or 
// do something else, idk.
export function GetNeighbors(tiles) {
    let neighbors = [];
    let tileNames = tiles["names"]
    for (let i = 0; i < tileNames.length; i++) {
        for (let j = 0; j < tileNames.length; j++) {
            if (i == j) {
                continue;
            }
            neighbors.push({"left":tileNames[i], 
                "right":tileNames[j]});
            neighbors.push({"up":tileNames[i], 
                "down":tileNames[j]});
        }
    }
    return neighbors
}
export function GenerateStrictArray(tilesetInfo) {
    let strictArray = [];
    for (let i = 0; i < tilesetInfo.length; i++) {
        if (tilesetInfo[i].noNeighbors) {
            strictArray.push(tilesetInfo[i]);
        }
    }
    return strictArray;
}
export function GenerateItems(item_info, width, height) {
    let item, cumulativeWeights;
    let carray=[];
    let items = {
        names: [],
        weights: [],
        amount:0,
        frequencies: []
    }
    let log_weights;
    let sum_of_weights = 0; 
    let sum_of_log_weights = 0;

    for (let i = 0; i < item_info.length; i++) {
        item = item_info[i];
        items["names"].push(item.name);
        items["weights"].push(item.weight || 1);
        items["amount"]++;
        items["frequencies"].push(item.frequency);
    }

    log_weights = new Array(items.amount);
    // debugger
    cumulativeWeights = items.weights.reduce( function(a,b,i) {
        return carray[i]=a+b;
    },0);
    for (let i = 0; i < items.amount; i++) {
        log_weights[i] = items.weights[i] * Math.log(items.weights[i]);
        sum_of_weights += items.weights[i];
        sum_of_log_weights += log_weights[i];
    }
    items["log_weights"] = log_weights;
    items["sum_of_weights"] = sum_of_weights;
    items["sum_of_log_weights"] = sum_of_log_weights;
    items["starting_entropy"] = Math.log(sum_of_weights) - sum_of_log_weights / sum_of_weights;
    items["sums_of_weights"] = new Array(width * height);
    items["sums_of_log_weights"] = new Array(width * height);
    items["entropies"] = new Array(width * height);
    items["carray"] = carray;
    items["csumweight"] = cumulativeWeights;
    return items
}

export function GenerateRules(rules_info) {
    let rules = {};
    for (let rule_type in rules_info) {
        rules[rule_type] = rules_info[rule_type]
    }
    return rules
}

export function GenerateTiles(tiles_info, width, height) {
    let tile, tile_name, new_tile, compatible, logWeights, cumulative_weights;
    let carray = [];
    let weightSum = 0;
    let logWeightSum = 0;
    let tiles = {
        types: [],
        rotations: [],
        names: [],
        weights: [],
        IDs: {},
        amount : 0
    };
    let cardinality = 1;
    let tile_ID = 0;

    let rotation = function(x) { return x; }    // calculator rotation value to add to tile ID to get correct tile
    let mirror = function(x) { return x; }  // calculator mirrored tile's value to get correct tile
    
    for (let i = 0; i < tiles_info.length; i++) {
        tile = tiles_info[i];

        switch(tile.symmetry) {
            case 'X':
                cardinality = 1;
                rotation = function(x) { return x; }
                mirror = function(x) { return x; }
                break;
            case 'L':
                cardinality = 4;
                rotation = function(x) { return (x + 1) % 4; }
                mirror = function(x) { return 3-x; }
                break;
            case 'T':
                cardinality = 4;
                rotation = function(x) { return (x + 1) % 4; }
                mirror = function(x) { return x % 2 == 0 ? 2-x : x; }
                break;
            case 'I':
                cardinality = 2;
                rotation = function(x) { return 1 - x; }
                mirror = function(x) { return x }
                break;
            case '\\':
                cardinality = 2;
                rotation = function(x) { return 1 - x; }
                mirror = function(x) { return 1 - x; }
                break;
            default: // Tiles with no manually assigned symmetries will default to X sym.
                console.warn("symmetry for tile " + tile.name + "is not set! Setting symmetry to default symmetry of X. Please change symmetry.")
                break;
        }
        
        for (let c = 0; c < cardinality; c++) {
            tile_name = tile.name + ' ' + c.toString();
            new_tile = [
                c + tile_ID,
                rotation(c) + tile_ID,
                rotation(rotation(c)) + tile_ID,
                rotation(rotation(rotation(c))) + tile_ID,
                mirror(c) + tile_ID,
                mirror(rotation(c)) + tile_ID,
                mirror(rotation(rotation(c))) + tile_ID,
                mirror(rotation(rotation(rotation(c)))) + tile_ID
            ]
            tiles["types"].push(tile.type);
            tiles["names"].push(tile_name);
            tiles["rotations"].push(new_tile)
            tiles["weights"].push(tile.weight || 1);
            tiles["IDs"][tile_name] = tile_ID + c;
            tiles["amount"]++;
        }
        tile_ID += cardinality;
    }


    // compatible tiles should be calculated according to neighbor constraints?
    compatible = new Array(tiles.amount);
    logWeights = new Array(tiles.amount);
    cumulative_weights = tiles.weights.reduce(function(a,b,i){ 
        return carray[i]=a+b;
    },0);
    // debugger

    for (let j = 0; j < width * height; j++) {
        compatible[j] = new Array(tiles.amount);

        for (let k = 0; k < tiles.amount; k++) {
            compatible[j][k] = new Array(4);
        }
    }

    // used for calculating entropy
    for (let t = 0; t < tiles.amount; t++) {
        logWeights[t] = (tiles.weights[t] * Math.log(tiles.weights[t]));    // negative of shannon's entropy
        weightSum += tiles.weights[t]; // total weight for an element in wave array
        logWeightSum += logWeights[t];   // total entropy for an element in wave array
    }
    //TODO: As an aside, if a weight is less that 1, then the logweight will be 
    // a negative number... which doesn't work... please normalize or do 
    // something more intelligent than that.
    tiles["compatible"] = compatible;
    tiles["logWeights"] = logWeights;
    tiles["weightSum"] = weightSum;
    tiles["logWeightSum"] = logWeightSum;
    tiles["entropy"] = Math.log(weightSum) - logWeightSum / weightSum;
    tiles["carray"] = carray;
    tiles["csumweight"] = cumulative_weights;
    return tiles
}
