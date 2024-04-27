const DURATION = 5000;

export function useSnack() {
  const snacks = useState<Snack[]>('snack', () => []);

  function addSnack(snackData: Omit<Snack, 'id'>) {
    let timer = null;
    const id = generateRandomString(50);

    if (snackData.auto) {
      timer = setTimeout(() => {
        removeSnack(id);
      }, DURATION);
    }

    snacks.value.push({
      content: snackData.content,
      type: snackData.type,
      timer,
      id,
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

  function addErrorSnack(
    message = 'Sorry, something went wrong. Please try again.',
    auto = true,
  ) {
    addSnack({
      content: message,
      type: 'error',
      auto,
    });
  }

  function addSuccessSnack(message: string, auto = true) {
    addSnack({
      content: message,
      type: 'success',
      auto,
    });
  }

  function addInfoSnack(message: string, auto = true) {
    addSnack({
      content: message,
      type: 'info',
      auto,
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
