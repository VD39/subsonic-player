import type { VueWrapper } from '@vue/test-utils';

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';

import GenreList from '@/components/Atoms/GenreList.vue';
import NoMediaMessage from '@/components/Atoms/NoMediaMessage.vue';
import TextClamp from '@/components/Atoms/TextClamp.vue';
import AlbumsList from '@/components/Organisms/AlbumsList.vue';
import ArtistsList from '@/components/Organisms/ArtistsList.vue';
import {
  getFormattedArtistsMock,
  getFormattedTracksMock,
} from '@/test/helpers';
import { useAudioPlayerMock } from '@/test/useAudioPlayerMock';
import { useHeadMock } from '@/test/useHeadMock';

import ArtistPage from './[[id]].vue';

const openModalMock = vi.fn();

mockNuxtImport('useModal', () => () => ({
  openModal: openModalMock,
}));

const downloadMediaMock = vi.fn();

mockNuxtImport('useMediaLibrary', () => () => ({
  downloadMedia: downloadMediaMock,
}));

const addToPlaylistModalMock = vi.fn();

mockNuxtImport('usePlaylist', () => () => ({
  addToPlaylistModal: addToPlaylistModalMock,
}));

const openTrackInformationModalMock = vi.fn();

mockNuxtImport('useMediaInformation', () => () => ({
  openTrackInformationModal: openTrackInformationModalMock,
}));

const dragStartMock = vi.fn();

mockNuxtImport('useDragAndDrop', () => () => ({
  dragStart: dragStartMock,
}));

const artistDataMock = ref<Artist | null>(null);

mockNuxtImport('useArtist', () => () => ({
  getArtist: vi.fn().mockReturnValue({
    data: artistDataMock,
    status: ref('success'),
  }),
}));

const { useHeadTitleMock } = useHeadMock();
const { addTrackToQueueMock, playTracksMock } = useAudioPlayerMock();

const track = getFormattedTracksMock()[0];
const artist = getFormattedArtistsMock()[0];

function factory(props = {}) {
  return mount(ArtistPage, {
    global: {
      stubs: {
        AlbumsList: true,
        ArtistsList: true,
        GenreList: true,
        TracksList: true,
      },
    },
    props: {
      ...props,
    },
  });
}

describe('[[id]]', () => {
  let wrapper: VueWrapper;

  beforeEach(() => {
    wrapper = factory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('matches the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('when getArtist does not return any data', () => {
    beforeEach(() => {
      wrapper = factory();
    });

    it('sets the useHead function with correct title', () => {
      expect(useHeadTitleMock.value).toBe('Artist');
    });

    it('shows the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(true);
    });

    it('does not show the artist content', () => {
      expect(wrapper.find({ ref: 'artistContent' }).exists()).toBe(false);
    });
  });

  describe('when getArtist does returns data', () => {
    beforeEach(() => {
      artistDataMock.value = getFormattedArtistsMock()[0];
      wrapper = factory();
    });

    it('sets the useHead function with correct title', () => {
      expect(useHeadTitleMock.value).toBe('artist-0 - Artist');
    });

    it('does not show the NoMediaMessage component', () => {
      expect(wrapper.findComponent(NoMediaMessage).exists()).toBe(false);
    });

    it('shows the artist content', () => {
      expect(wrapper.find({ ref: 'artistContent' }).exists()).toBe(true);
    });

    describe('when artistData.biography is not set', () => {
      it('does not show the TextClamp component', () => {
        expect(wrapper.findComponent(TextClamp).exists()).toBe(false);
      });
    });

    describe('when artistData.biography is set', () => {
      beforeEach(() => {
        artistDataMock.value = getFormattedArtistsMock(1, {
          biography: 'biography',
        })[0];

        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the TextClamp component', () => {
        expect(wrapper.findComponent(TextClamp).exists()).toBe(true);
      });

      describe('when the TextClamp component emits the more event', () => {
        beforeEach(() => {
          wrapper.findComponent(TextClamp).vm.$emit('more');
        });

        it('calls the openModal function with the correct parameters', () => {
          expect(openModalMock).toHaveBeenCalledWith(MODAL_TYPE.readMoreModal, {
            text: artistDataMock.value!.biography,
            title: 'Artist biography',
          });
        });
      });
    });

    describe('when artistData.genres is an empty array', () => {
      beforeEach(() => {
        artistDataMock.value = getFormattedArtistsMock(1, {
          genres: [],
        })[0];

        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('does not show the GenreList component', () => {
        expect(wrapper.findComponent(GenreList).exists()).toBe(false);
      });
    });

    describe('when artistData.genres is not an empty array', () => {
      it('shows the GenreList component', () => {
        expect(wrapper.findComponent(GenreList).exists()).toBe(true);
      });
    });

    describe('when artistData.totalAlbums is 1', () => {
      it('shows the correct album count text', () => {
        expect(wrapper.find({ ref: 'albumCount' }).text()).toBe('1 Album');
      });
    });

    describe('when artistData.totalAlbums is greater than 1', () => {
      beforeEach(() => {
        artistDataMock.value = getFormattedArtistsMock(1, {
          totalAlbums: 5,
        })[0];

        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the correct album count text', () => {
        expect(wrapper.find({ ref: 'albumCount' }).text()).toBe('5 Albums');
      });
    });

    describe('when artistData.totalTracks is 1', () => {
      it('shows the correct track count text', () => {
        expect(wrapper.find({ ref: 'trackCount' }).text()).toBe('1 Track');
      });
    });

    describe('when artistData.totalTracks is greater than 1', () => {
      beforeEach(() => {
        artistDataMock.value = getFormattedArtistsMock(1, {
          totalTracks: 10,
        })[0];

        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the correct track count text', () => {
        expect(wrapper.find({ ref: 'trackCount' }).text()).toBe('10 Tracks');
      });
    });

    describe('when artistData.lastFmUrl is not set', () => {
      it('does not show the LastFm ButtonLink component', () => {
        expect(wrapper.findComponent({ ref: 'lastFmButton' }).exists()).toBe(
          false,
        );
      });
    });

    describe('when artistData.lastFmUrl is set', () => {
      beforeEach(() => {
        artistDataMock.value = getFormattedArtistsMock(1, {
          lastFmUrl: 'lastFmUrl',
        })[0];

        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the LastFm ButtonLink component', () => {
        expect(wrapper.findComponent({ ref: 'lastFmButton' }).exists()).toBe(
          true,
        );
      });
    });

    describe('when artistData.musicBrainzUrl is not set', () => {
      it('does not show the MusicBrainz ButtonLink component', () => {
        expect(
          wrapper.findComponent({ ref: 'musicBrainzButton' }).exists(),
        ).toBe(false);
      });
    });

    describe('when artistData.musicBrainzUrl is set', () => {
      beforeEach(() => {
        artistDataMock.value = getFormattedArtistsMock(1, {
          musicBrainzUrl: 'musicBrainzUrl',
        })[0];

        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the MusicBrainz ButtonLink component', () => {
        expect(
          wrapper.findComponent({ ref: 'musicBrainzButton' }).exists(),
        ).toBe(true);
      });
    });

    describe.each([
      ['top', 'topTracks', 'topTracksTracksList'],
      ['similar', 'similarTracks', 'similarTracksTracksList'],
    ])('_', (component, key, ref) => {
      describe(`when artistData.${key} is an empty array`, () => {
        it(`does not show the ${component} tracks TracksList component`, () => {
          expect(wrapper.findComponent({ ref }).exists()).toBe(false);
        });
      });

      describe(`when artistData.${key} is not an empty array`, () => {
        beforeEach(() => {
          artistDataMock.value = getFormattedArtistsMock(1, {
            [key]: getFormattedTracksMock(5),
          })[0];

          wrapper = factory();
        });

        it('matches the snapshot', () => {
          expect(wrapper.html()).toMatchSnapshot();
        });

        it(`shows the ${component} tracks TracksList component`, () => {
          expect(wrapper.findComponent({ ref }).exists()).toBe(true);
        });

        describe(`when the ${component} TracksList component emits the addToPlaylist event`, () => {
          beforeEach(() => {
            wrapper.findComponent({ ref }).vm.$emit('addToPlaylist', track);
          });

          it('calls the addToPlaylistModal function with the correct parameters', () => {
            expect(addToPlaylistModalMock).toHaveBeenCalledWith(track);
          });
        });

        describe(`when the ${component} TracksList component emits the addToQueue event`, () => {
          beforeEach(() => {
            wrapper.findComponent({ ref }).vm.$emit('addToQueue', track);
          });

          it('calls the addTrackToQueue function with the correct parameters', () => {
            expect(addTrackToQueueMock).toHaveBeenCalledWith(track);
          });
        });

        describe(`when the ${component} TracksList component emits the downloadMedia event`, () => {
          beforeEach(() => {
            wrapper.findComponent({ ref }).vm.$emit('downloadMedia', track);
          });

          it('calls the downloadMedia function with the correct parameters', () => {
            expect(downloadMediaMock).toHaveBeenCalledWith(track);
          });
        });

        describe(`when the ${component} TracksList component emits the dragStart event`, () => {
          beforeEach(() => {
            wrapper.findComponent({ ref }).vm.$emit('dragStart', track);
          });

          it('calls the dragStart function with the correct parameters', () => {
            expect(dragStartMock).toHaveBeenCalledWith(track);
          });
        });

        describe(`when the ${component} TracksList component emits the playTrack event`, () => {
          beforeEach(() => {
            wrapper.findComponent({ ref }).vm.$emit('playTrack', 2);
          });

          it('calls the playTracks function with the correct parameters', () => {
            expect(playTracksMock).toHaveBeenCalledWith(
              artistDataMock.value![key as keyof Artist],
              1,
            );
          });
        });

        describe(`when the ${component} TracksList component emits the favouriteTrack event`, () => {
          beforeEach(() => {
            wrapper.findComponent({ ref }).vm.$emit('mediaInformation', track);
          });

          it('calls the openTrackInformationModal function with the correct parameters', () => {
            expect(openTrackInformationModalMock).toHaveBeenCalledWith(track);
          });
        });
      });
    });

    describe('when artistData.similarArtist is an empty array', () => {
      it('does not show the ArtistsList component', () => {
        expect(wrapper.findComponent(ArtistsList).exists()).toBe(false);
      });
    });

    describe('when artistData.similarArtist is not an empty array', () => {
      beforeEach(() => {
        artistDataMock.value = getFormattedArtistsMock(1, {
          similarArtist: [artist],
        })[0];

        wrapper = factory();
      });

      it('matches the snapshot', () => {
        expect(wrapper.html()).toMatchSnapshot();
      });

      it('shows the ArtistsList component', () => {
        expect(wrapper.findComponent(ArtistsList).exists()).toBe(true);
      });
    });

    describe('when the AlbumsList component emits the dragStart event', () => {
      beforeEach(() => {
        wrapper.findComponent(AlbumsList).vm.$emit('dragStart', track);
      });

      it('calls the dragStart function with the correct parameters', () => {
        expect(dragStartMock).toHaveBeenCalledWith(track);
      });
    });
  });
});
