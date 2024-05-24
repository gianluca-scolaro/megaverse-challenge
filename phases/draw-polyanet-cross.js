import {addPolyanet, getMap} from "../services/megaverse-service.js";
import {processInBatches} from "../utils/batch.js";

/**
 * Adds multiple Polyanets to the map to form the shape of a cross in the middle.
 * @param crossLength The length of each of the sides of the cross.
 */
const drawPolyanetCross = (crossLength) => {
  return getMap().then(map => recursiveDrawPolyanetCross(map, crossLength))
}

/*
 * I've observed that even though the api responds with 200 OK, the changes are sometimes not persisted.
 * I consider this unreliability of the API may be a hidden challenge of the assignment.
 * Due to lack of time I'm not able to dig deeper, so this quick fix checks the map again to see if it missed
 * adding any polyanet. If it did, then it re-runs to achieve the desired result.
 */
const recursiveDrawPolyanetCross = (map, crossLength) => {
  console.log("Starting draw polyanet cross iteration ...");
  return drawPolyanetCrossHelper(map, crossLength)
    .then(notEmpty => {
      if (notEmpty) return drawPolyanetCross();
      // No action was performed on the last iteration, meaning all polyanets have been added.
      return Promise.resolve();
    });
}

/*
* We could use the goal map values to draw the cross, however given that the shape is simple enough we can implement
* a more efficient approach.
* Iterating over goal map -> O(n) time complexity, n being the total amount of spaces in the map.
* Our alternative approach -> O(crossLength) time complexity. With crossLength always equal to 3, our approach has
* constant time because it only iterates 2 x crossLength times independently of the size of the map.
*/
const drawPolyanetCrossHelper = (map, crossLength) => {
  const n = map.length;
  const m = n > 0 ? map[0].length : 0;

  const centerCol = Math.floor(n / 2);
  const centerRow = Math.floor(m / 2);

  const actions = [];
  for (let i = -crossLength; i <= crossLength; i++) {
    const newRow = centerRow + i;
    const newCol1 = centerCol + i;
    const newCol2 = centerCol - i;

    // If we knew that m == n and the cross fits, we could remove this out of bounds checks.
    if(newRow >= 0 && newRow < m) {
      // Check out of bounds and if polyanet is already present in the map. This of course assumes that we start with an empty map.
      if (newCol1 >= 0 && newCol1 < n && !map[newRow][newCol1]) actions.push(() => addPolyanet(newRow, newCol1));
      if (i !== 0 && newCol2 >= 0 && newCol2 < n && !map[newRow][newCol2]) actions.push(() => addPolyanet(newRow, newCol2));
    }
  }

  return processInBatches(actions, 3).then(() => actions.length > 0);
}

export {drawPolyanetCross}