export function useRadioStation() {
  const { fetchData } = useAPI();
  const { addSuccessSnack } = useSnack();
  const { closeModal, openModal } = useModal();

  const radioStations = useState<RadioStation[]>(
    STATE_NAMES.radioStations,
    () => [],
  );

  function resetRadioStations() {
    radioStations.value = [];
  }

  async function getRadioStations() {
    const { data: radioStationsData } = await fetchData(
      '/getInternetRadioStations',
      {
        transform: /* istanbul ignore next -- @preserve */ (response) =>
          (response.internetRadioStations.internetRadioStation || [])
            .map(formatRadioStation)
            .sort((a, b) => a.name.localeCompare(b.name)),
      },
    );

    radioStations.value = radioStationsData || [];
  }

  async function addRadioStation(params: RadioStationParams) {
    const { data: radioStationData } = await fetchData(
      '/createInternetRadioStation',
      {
        method: 'POST',
        query: params,
      },
    );

    if (radioStationData) {
      await getRadioStations();
      addSuccessSnack(`Successfully added radio station ${params.name}.`);
    }
  }

  async function updateRadioStation(params: RadioStationParams) {
    if (!params.homepageUrl) {
      delete params.homepageUrl;
    }

    const { data: radioStationData } = await fetchData(
      '/updateInternetRadioStation',
      {
        method: 'POST',
        query: params,
      },
    );

    if (radioStationData) {
      await getRadioStations();
      addSuccessSnack(`Successfully updated radio station ${params.name}.`);
    }
  }

  async function deleteRadioStation(id: string) {
    const { data: radioStationData } = await fetchData(
      '/deleteInternetRadioStation',
      {
        query: {
          id,
        },
      },
    );

    if (radioStationData) {
      await getRadioStations();
      addSuccessSnack('Successfully deleted radio station.');
    }
  }

  /* istanbul ignore next -- @preserve */
  function addRadioStationModal() {
    openModal(MODAL_TYPE.addRadioStationModal, {
      async onSubmit(radioStation: RadioStationParams) {
        await addRadioStation(radioStation);
        closeModal();
      },
    });
  }

  /* istanbul ignore next -- @preserve */
  function updateRadioStationModal(radioStation: RadioStation) {
    openModal(MODAL_TYPE.updateRadioStationModal, {
      async onSubmit(newRadioStation: RadioStationParams) {
        await updateRadioStation({
          ...newRadioStation,
          id: radioStation.id,
        });

        closeModal();
      },
      radioStation,
    });
  }

  return {
    addRadioStation,
    addRadioStationModal,
    deleteRadioStation,
    getRadioStations,
    radioStations,
    resetRadioStations,
    updateRadioStation,
    updateRadioStationModal,
  };
}
