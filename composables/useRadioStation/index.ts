export function useRadioStation() {
  const { fetchData } = useAPI();
  const { addSuccessSnack } = useSnack();
  const { closeModal, openModal } = useModal();

  const radioStations = useState<RadioStation[]>(
    STATE_NAMES.radioStations,
    () => [],
  );

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
        params,
      },
    );

    if (radioStationData) {
      addSuccessSnack(`Successfully added radio station ${params.name}.`);
      await getRadioStations();
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
        params,
      },
    );

    if (radioStationData) {
      addSuccessSnack(`Successfully updated radio station ${params.name}.`);
      await getRadioStations();
    }
  }

  async function deleteRadioStation(id: string) {
    const { data: radioStationData } = await fetchData(
      '/deleteInternetRadioStation',
      {
        params: {
          id,
        },
      },
    );

    if (radioStationData) {
      addSuccessSnack('Successfully deleted radio station.');
      await getRadioStations();
    }
  }

  /* istanbul ignore next -- @preserve */
  function addRadioStationModal() {
    openModal(MODAL_TYPE.addRadioStationModal, {
      async onSubmit(radioStation: RadioStationParams) {
        await addRadioStation(radioStation);
        closeModal();
        await getRadioStations();
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
        await getRadioStations();
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
    updateRadioStation,
    updateRadioStationModal,
  };
}
