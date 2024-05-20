import {
  PhApplePodcastsLogo,
  PhCompass,
  PhDotsThreeVertical,
  PhHeadphones,
  PhHeart,
  PhListPlus,
  PhMagnifyingGlass,
  PhMoon,
  PhMusicNotes,
  PhPlaylist,
  PhQueue,
  PhRadio,
  PhSignOut,
  PhSun,
  PhTextIndent,
  PhTextOutdent,
  PhUsersThree,
  PhVinylRecord,
  PhWaveform,
  PhWaveSine,
  PhX,
} from '@phosphor-icons/vue';

const ICONS = [
  PhApplePodcastsLogo,
  PhCompass,
  PhDotsThreeVertical,
  PhHeadphones,
  PhHeart,
  PhListPlus,
  PhMagnifyingGlass,
  PhMoon,
  PhMusicNotes,
  PhPlaylist,
  PhQueue,
  PhRadio,
  PhSignOut,
  PhSun,
  PhTextIndent,
  PhTextOutdent,
  PhUsersThree,
  PhVinylRecord,
  PhWaveform,
  PhWaveSine,
  PhX,
];

export default defineNuxtPlugin((nuxtApp) => {
  ICONS.forEach((icon) => {
    nuxtApp.vueApp.component(icon.name!, icon);
  });
});
