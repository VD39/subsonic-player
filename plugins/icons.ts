import {
  PhApplePodcastsLogo,
  PhArrowsClockwise,
  PhCaretCircleDown,
  PhCaretCircleUp,
  PhCaretDoubleLeft,
  PhCaretDoubleRight,
  PhCaretDown,
  PhCheckCircle,
  PhCircleNotch,
  PhCompass,
  PhDotsThreeVertical,
  PhDownload,
  PhFastForward,
  PhGear,
  PhHeadphones,
  PhHeart,
  PhInfo,
  PhLastfmLogo,
  PhListPlus,
  PhMagnifyingGlass,
  PhMinusCircle,
  PhMoon,
  PhMusicNotes,
  PhPause,
  PhPlay,
  PhPlaylist,
  PhPlusCircle,
  PhQueue,
  PhRadio,
  PhRepeat,
  PhRepeatOnce,
  PhRewind,
  PhShuffle,
  PhSignOut,
  PhSkipBack,
  PhSkipForward,
  PhSpeakerHigh,
  PhSpeakerLow,
  PhSpeakerNone,
  PhSpeakerX,
  PhSun,
  PhTextIndent,
  PhTextOutdent,
  PhTrash,
  PhUsersThree,
  PhVinylRecord,
  PhWaveform,
  PhWaveSine,
  PhX,
} from '@phosphor-icons/vue';

const ICONS = [
  PhApplePodcastsLogo,
  PhArrowsClockwise,
  PhCaretCircleDown,
  PhCaretCircleUp,
  PhCaretDoubleLeft,
  PhCaretDoubleRight,
  PhCaretDown,
  PhCheckCircle,
  PhCircleNotch,
  PhCompass,
  PhDotsThreeVertical,
  PhDownload,
  PhFastForward,
  PhGear,
  PhHeadphones,
  PhHeart,
  PhInfo,
  PhLastfmLogo,
  PhListPlus,
  PhMagnifyingGlass,
  PhMinusCircle,
  PhMoon,
  PhMusicNotes,
  PhPause,
  PhPlay,
  PhPlaylist,
  PhPlusCircle,
  PhQueue,
  PhRadio,
  PhRepeat,
  PhRepeatOnce,
  PhRewind,
  PhShuffle,
  PhSignOut,
  PhSkipBack,
  PhSkipForward,
  PhSpeakerHigh,
  PhSpeakerLow,
  PhSpeakerNone,
  PhSpeakerX,
  PhSun,
  PhTextIndent,
  PhTextOutdent,
  PhTrash,
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
