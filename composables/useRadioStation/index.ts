export function useRadioStation() {
  const { fetchData } = useAPI();
  const { addSuccessSnack } = useSnack();

  const radioStations = useState<RadioStation[]>('radio-stations', () => []);

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

    if (Array.isArray(radioStationsData)) {
      radioStations.value = radioStationsData;
    }
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
      addSuccessSnack(`Successfully added playlist ${params.name}.`);
      await getRadioStations();
    }
  }

  async function updateRadioStation(params: RadioStationParams) {
    const { data: radioStationData } = await fetchData(
      '/updateInternetRadioStation',
      {
        method: 'POST',
        params,
      },
    );

    if (radioStationData) {
      addSuccessSnack(`Successfully updated playlist ${params.name}.`);
      await getRadioStations();
    }
  }

  async function deleteRadioStation(id: string) {
    const { data: radioStationData } = await fetchData(
      '/deleteInternetRadioStation',
      {
        method: 'DELETE',
        params: {
          id,
        },
      },
    );

    if (radioStationData) {
      addSuccessSnack('Successfully deleted playlist.');
      await getRadioStations();
    }
  }

  return {
    addRadioStation,
    deleteRadioStation,
    getRadioStations,
    radioStations,
    updateRadioStation,
  };
}
