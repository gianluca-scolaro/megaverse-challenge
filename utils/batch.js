/**
 * Util function to perform actions in batches.
 * Given a specified batch size, it processes that amount of actions at a time, waiting for them to finish before
 * moving on to the next batch.
 */
const processInBatches = async (actions, batchSize = 5) => {
  for (let i = 0; i < actions.length; i += batchSize) {
    const batch = actions.slice(i, i + batchSize);
    await processBatch(batch);
  }
}

const processBatch = (batch) => {
  const promises = batch.map(action => action());
  return Promise.allSettled(promises);
}

export {processInBatches}