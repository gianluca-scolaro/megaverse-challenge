import {
  getMap,
  removeCometh,
  removePolyanet,
  removeSoloon
} from "./services/megaverse-service.js";
import {processInBatches} from "./utils/batch.js";

/**
 * Removes all astral objects from the map.
 */
const clearMap = () => getMap().then(map => recursiveClearMap(map));

/*
 * I've observed that even though the api responds with 200 OK, the changes are sometimes not persisted.
 * I consider this unreliability of the API may be a hidden challenge of the assignment.
 * Due to lack of time I'm not able to dig deeper, so this quick fix checks the solution map to see if it missed
 * clearing anything. If it did, then it re-runs to achieve the desired result.
 */
const recursiveClearMap = (map) => {
  console.log("Starting map cleanup iteration ...");
  return clearMapHelper(map)
    .then(notEmpty => {
      if (notEmpty) return clearMap();
      // No action was performed on the last iteration, no astral objects are left in the map.
      return Promise.resolve();
    });
}

const clearMapHelper = (map) => {
  const actions = [];
  for(let row = 0; row < map.length; row++) {
    for(let col = 0; col < map[row].length; col++) {
      const element = map[row][col];
      if(!element) continue;
      handleMapElement(element.type, row, col, actions);
    }
  }
  return processInBatches(actions).then(() => actions.length > 0);
}

function handleMapElement(elementType, row, col, actions) {
  switch (elementType) {
    case 0:
      actions.push(() => removePolyanet(row, col));
      break;
    case 1:
      actions.push(() => removeSoloon(row, col));
      break;
    case 2:
      actions.push(() => removeCometh(row, col));
      break;
    default:
      console.warn(`Unhandled map element type: ${elementType}`);
  }
}

export {clearMap}