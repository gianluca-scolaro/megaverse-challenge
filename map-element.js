/*
* This enum might be considered unnecessary given that it's only used by the draw-logo function.
* But it helps keep a clear separation of concerns and could be reused if the solution is expanded upon.
*/
function getMapElement(elementString) {
  if (MapElement.hasOwnProperty(elementString)) {
    return MapElement[elementString];
  } else {
    throw new Error(`Invalid MapElement string: ${elementString}`);
  }
}

const MapElement = Object.freeze({
  SPACE: Symbol("SPACE"),
  POLYANET: Symbol("POLYANET"),
  WHITE_SOLOON: Symbol("WHITE_SOLOON"),
  BLUE_SOLOON: Symbol("BLUE_SOLOON"),
  PURPLE_SOLOON: Symbol("PURPLE_SOLOON"),
  RED_SOLOON: Symbol("RED_SOLOON"),
  UP_COMETH: Symbol("UP_COMETH"),
  DOWN_COMETH: Symbol("DOWN_COMETH"),
  LEFT_COMETH: Symbol("LEFT_COMETH"),
  RIGHT_COMETH: Symbol("RIGHT_COMETH")
});

export {getMapElement, MapElement}