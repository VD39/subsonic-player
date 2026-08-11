export function useErrorHandler() {
  const { addErrorSnack } = useSnack();

  function logError(error: unknown, source?: string) {
    if (source) {
      console.error(`[${source}]`, error);
    } else {
      console.error(error);
    }

    console.error(getFriendlyErrorMessage(error));
  }

  function handleError(error: unknown, source?: string) {
    logError(error, source);

    addErrorSnack(getFriendlyErrorMessage(error));
  }

  return {
    handleError,
    logError,
  };
}
