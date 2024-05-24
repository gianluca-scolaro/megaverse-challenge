import {addCometh, addPolyanet, addSoloon, getGoalMap, getMap} from "../services/megaverse-service.js";
import {processInBatches} from "../utils/batch.js";
import {getMapElement, MapElement} from "../map-element.js";

/**
 * Adds multiple astral objects to the map to form the shape of a logo.
 */
const drawLogo = () => {
  const map = getMap();
  const goalMap = getGoalMap();
  return Promise.all([map, goalMap])
    .then(values => recursiveDrawLogo(values[0], values[1]));
}

/*
 * I've observed that even though the api responds with 200 OK, the changes are sometimes not persisted.
 * I consider this unreliability of the API may be a hidden challenge of the assignment.
 * Due to lack of time I'm not able to dig deeper, so this quick fix checks the maps again to see if it missed
 * adding any astral object. If it did, then it re-runs to achieve the desired result.
 */
const recursiveDrawLogo = (map, goalMap) => {
  console.log("Starting draw logo iteration ...");
  return drawLogoHelper(map, goalMap)
    .then(notEmpty => {
      if (notEmpty) return drawLogo();
      // No action was performed on the last iteration, meaning all astral objects have been added.
      return Promise.resolve();
    });
}

const drawLogoHelper = (map, goalMap) => {
  const actions = [];
  for(let row = 0; row < goalMap.length; row++) {
    for(let col = 0; col < goalMap[row].length; col++) {
      // If an element is found in the map, it means we already added it in the previous recursive iteration.
      // This of course assumes that we start with an empty map.
      if(!map[row][col]) handleMapElement(goalMap[row][col], row, col, actions);
    }
  }
  return processInBatches(actions).then(() => actions.length > 0);
}

function handleMapElement(elementString, row, col, actions) {
  const element = getMapElement(elementString);

  switch (element) {
    case MapElement.SPACE:
      break;
    case MapElement.POLYANET:
      actions.push(() => addPolyanet(row, col));
      break;
    case MapElement.WHITE_SOLOON:
      actions.push(() => addSoloon(row, col, 'white'));
      break;
    case MapElement.BLUE_SOLOON:
      actions.push(() => addSoloon(row, col, 'blue'));
      break;
    case MapElement.PURPLE_SOLOON:
      actions.push(() => addSoloon(row, col, 'purple'));
      break;
    case MapElement.RED_SOLOON:
      actions.push(() => addSoloon(row, col, 'red'));
      break;
    case MapElement.UP_COMETH:
      actions.push(() => addCometh(row, col, 'up'));
      break;
    case MapElement.DOWN_COMETH:
      actions.push(() => addCometh(row, col, 'down'));
      break;
    case MapElement.LEFT_COMETH:
      actions.push(() => addCometh(row, col, 'left'));
      break;
    case MapElement.RIGHT_COMETH:
      actions.push(() => addCometh(row, col, 'right'));
      break;
    default:
      console.warn(`Unhandled MapElement: ${element}`);
  }
}

export {drawLogo}