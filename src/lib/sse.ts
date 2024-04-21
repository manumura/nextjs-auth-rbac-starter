import {
  EventSourceMessage,
  EventStreamContentType,
  fetchEventSource,
} from '@microsoft/fetch-event-source';
import { FatalError, RetriableError } from '../types/Errors';

export const userChangeEventAbortController = new AbortController();

export async function subscribe(
  url: string,
  abortController: AbortController,
  onMessage: (message: EventSourceMessage) => void,
) {
  const maxRetries = 10;
  let retryCount = 0;

  await fetchEventSource(url, {
    credentials: 'include',
    signal: abortController.signal,
    async onopen(response) {
      if (
        response.ok &&
        response.headers.get('content-type')?.startsWith(EventStreamContentType)
      ) {
        // everything's good
        return;
      } else if (
        response.status >= 400 &&
        response.status < 500 &&
        response.status !== 429
      ) {
        // client-side errors are usually non-retriable:
        console.error('Fatal error on open: ', response);
        throw new FatalError();
      } else {
        console.error('Retriable error on open: ', response);
        throw new RetriableError();
      }
    },
    onmessage(message) {
      // if the server emits an error message, throw an exception
      // so it gets handled by the onerror callback below:
      // console.log('message received: ', message);
      if (message.event === 'FatalError') {
        throw new FatalError(message.data);
      }

      if (message.event && message.data) {
        onMessage(message);
      }
    },
    onclose() {
      // if the server closes the connection unexpectedly, retry:
      throw new RetriableError();
    },
    onerror(error) {
      console.error('Fetch event source error: ', error);
      if (error instanceof FatalError) {
        // rethrow to stop the operation
        throw error;
      } else {
        // do nothing to automatically retry. You can also return a specific retry interval here.
        if (retryCount >= maxRetries) {
          console.error('Max retries reached: closing stream');
          throw error;
        }
        retryCount++;
        console.error('retry count: ', retryCount);
      }
    },
  });
}
