export function useSnack() {
  const snacks = useState<Snack[]>(STATE_NAMES.snacks, () => []);

  function addSnack(snackData: Omit<Snack, 'id'>) {
    if (import.meta.server) {
      return;
    }

    let timer = null;
    const id = generateRandomString(50);

    if (snackData.auto) {
      timer = setTimeout(() => {
        removeSnack(id);
      }, SNACK_ALIVE_DURATION);
    }

    snacks.value.push({
      content: snackData.content,
      id,
      timer,
      type: snackData.type,
    });
  }

  function removeSnack(id: string) {
    const current = snacks.value.find((snack) => snack.id === id);
    const index = snacks.value.findIndex((snack) => snack.id === id);

    if (current?.timer) {
      clearTimeout(current.timer);
    }

    snacks.value.splice(index, 1);
  }

  function clearAllSnack() {
    snacks.value = [];
  }

  function addErrorSnack(message = DEFAULT_ERROR_MESSAGE, auto = true) {
    addSnack({
      auto,
      content: message,
      type: 'error',
    });
  }

  function addSuccessSnack(message: string, auto = true) {
    addSnack({
      auto,
      content: message,
      type: 'success',
    });
  }

  function addInfoSnack(message: string, auto = true) {
    addSnack({
      auto,
      content: message,
      type: 'info',
    });
  }

  return {
    addErrorSnack,
    addInfoSnack,
    addSuccessSnack,
    clearAllSnack,
    removeSnack,
    snacks,
  };
}
