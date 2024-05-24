/**
 * Util function to perform an api call with a randomized exponential backoff retry logic.
 */
const callApiWithRetries = async (fetchCall, maxRetries, onSuccess, onFailure, onError, onLimitReached) => {
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  const timeout = retryCount => (2 ** (retryCount + Math.random())) * 1000;
  for (let retryCount = 0; retryCount < maxRetries; retryCount++) {
    try {
      const response = await fetchCall();
      if (response.ok) {
        onSuccess();
        return response;
      }
      onFailure(response);
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : timeout(retryCount);
        await delay(waitTime);
      } else {
        await delay(timeout(retryCount));
      }
    } catch (error) {
      onError(error);
      await delay(timeout(retryCount));
    }
  }
  onLimitReached();
  return false;
}

export {callApiWithRetries}