import {callApiWithRetries} from "../utils/retry.js";

/**
 * This service handles all the interactions with the Megaverse API, abstracting away its complexity for the intended
 * consumers.
 */

const baseUrl = 'https://challenge.crossmint.io/api';

// We could receive this id as a parameter to allow the service to be reused by multiple candidates.
const candidateId = 'dafe21bb-05ae-45d7-bbcc-8aea17c8c38a';

const addPolyanet = (row, column, retries = 5) => updateAstralObject('polyanets', row, column, retries, 'POST');

const removePolyanet = (row, column, retries = 5) => updateAstralObject('polyanets', row, column, retries, 'DELETE');

const addSoloon = (row, column, color, retries = 5) => updateAstralObject('soloons', row, column, retries, 'POST', {color});

const removeSoloon = (row, column, retries = 5) => updateAstralObject('soloons', row, column, retries, 'DELETE');

const addCometh = (row, column, direction, retries = 5) => updateAstralObject('comeths', row, column, retries, 'POST', {direction});

const removeCometh = (row, column, retries = 5) => updateAstralObject('comeths', row, column, retries, 'DELETE');

/*
 * Important assumption: There is no bulk endpoint to add many astral objects at the same time.
 *
 * Given the small amount of requests that the api is able to handle at the same time, it's tempting to simply call the
 * endpoint sequentially (i.e. one astral object at a time). However, there is no reason, other than the api
 * limitations, to try and parallelize the calls to the api. The retry and batching logic might be considered 'over-engineered', but the
 * assignment states that a bit of over-engineering is okay :)
 */
const updateAstralObject = async (astralObject, row, column, retries, method, bodyArgs = {}) => {
  const body = {
    ...bodyArgs,
    candidateId,
    row,
    column
  }

  const fetchCall = () => fetch(`${baseUrl}/${astralObject}`, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  return callApiWithRetries(
    fetchCall,
    retries,
    () => console.log(`Successfully updated ${astralObject} at row ${row} and column ${column}`),
    (response) => console.error(`Error updating ${astralObject} at row ${row} and column ${column}, `
    + `status: ${response.status}, text: ${response.statusText}`),
    (error) => console.error(`Error updating ${astralObject} at row ${row} and column ${column}, error: `, error),
    () => console.log(`Run out of retries when updating ${astralObject} at row ${row} and column ${column}`)
  );
}

const getGoalMap = (retries = 5) => {
  const fetchCall = () => fetch(`${baseUrl}/map/${candidateId}/goal`);
  return callApiWithRetries(
    fetchCall,
    retries,
    () => console.log(`Successfully fetched map goal data`),
    (response) => console.error(`Error fetching map goal data, status: ${response.status}, text: ${response.statusText}`),
    (error) => console.error('Error fetching map goal data, error:', error),
    () => console.log('Run out of retries when fetching map goal data')
  )
    .then(res => res ? res.json() : false)
    .then(data => data ? data.goal : [])
}

const getMap = (retries = 5) => {
  const fetchCall = ()  => fetch(`${baseUrl}/map/${candidateId}`)
  return callApiWithRetries(
    fetchCall,
    retries,
    () => console.log(`Successfully fetched map data`),
    (response) => console.error(`Error fetching map data, status: ${response.status}, text: ${response.statusText}`),
    (error) => console.error('Error fetching map data, error:', error),
    () => console.log('Run out of retries when fetching map data')
  )
    .then(res => res ? res.json() : false)
    .then(data => data ? data.map.content : [])
}

export {addPolyanet, removePolyanet, addSoloon, removeSoloon, addCometh, removeCometh, getGoalMap, getMap};