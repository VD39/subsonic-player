export function useErrorHandler() {
  const { addErrorSnack } = useSnack();

  function handleError(error: unknown, source?: string) {
    if (source) {
      console.error(`[${source}]`, error);
    }

    addErrorSnack(getFriendlyErrorMessage(error));
  }

  return {
    handleError,
  };
}
