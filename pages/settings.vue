<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import InputRange from '@/components/Atoms/InputRange.vue';
import ToggleSwitch from '@/components/Atoms/ToggleSwitch.vue';
import AboutApp from '@/components/Molecules/AboutApp.vue';
import SelectableBadge from '@/components/Molecules/Settings/SelectableBadge.vue';
import SelectableOption from '@/components/Molecules/Settings/SelectableOption.vue';
import SettingsField from '@/components/Molecules/Settings/SettingsField.vue';
import SettingsGroup from '@/components/Molecules/Settings/SettingsGroup.vue';
import SettingsSection from '@/components/Molecules/Settings/SettingsSection.vue';

const {
  crossfadeDuration,
  crossfadeEnabled,
  deletePodcastOnEnd,
  replayGainMode,
  resetSettings,
  scrobbleEnabled,
  setCrossfadeDuration,
  setStreamBitrate,
  setThemeMode,
  setViewLayout,
  showPodcasts,
  showRadioStations,
  streamBitrate,
  themePreference,
  toggleCrossfade,
  toggleDeletePodcastOnEnd,
  toggleScrobble,
  toggleShowPodcasts,
  toggleShowRadioStations,
  viewLayout,
} = useSettings();
const { setReplayGainMode } = useAudioPlayer();
const { aboutInformation, fetchInformation } = useServerInfo();
const {
  cacheEstimate,
  clearAllAppStorage,
  clearPwaCaches,
  fetchCacheEstimate,
} = useMaintenance();
const { closeModal, openModal } = useModal();

function onClearCache() {
  openModal(MODAL_TYPE.confirmDialog, {
    confirmText: 'Clear',
    message:
      'Permanently clear all locally cached data? This includes cached audio, images, and player/queue state.',
    onCancel() {
      closeModal();
    },
    async onConfirm() {
      await clearAllAppStorage();
      await clearPwaCaches();
      closeModal();
    },
  });
}

function onCrossfadeDuration(value: number) {
  setCrossfadeDuration(Math.round(value));
}

function onResetSettings() {
  openModal(MODAL_TYPE.confirmDialog, {
    confirmText: 'Reset',
    message:
      'Reset all settings to their default values? This cannot be undone.',
    onCancel() {
      closeModal();
    },
    onConfirm() {
      resetSettings();
      closeModal();
    },
  });
}

onMounted(() => {
  fetchInformation();
  fetchCacheEstimate();
});
</script>

<template>
  <div :class="['column', $style.settings]">
    <h1 :class="$style.title">Settings</h1>

    <SettingsSection title="Appearance">
      <SettingsGroup
        ref="themeGroup"
        description="Switch between dark, light, or system-preferred appearance"
        title="Theme"
        variant="badge"
      >
        <SelectableBadge
          v-for="opt in THEME_OPTIONS"
          :key="opt.value"
          :label="opt.label"
          :selected="themePreference === opt.value"
          @click="setThemeMode(opt.value)"
        />
      </SettingsGroup>

      <SettingsGroup
        ref="layoutGroup"
        description="Choose between a compact grid or a detailed list"
        title="Layout"
        variant="list"
      >
        <SelectableOption
          v-for="opt in LAYOUT_OPTIONS"
          :key="opt.value"
          :description="opt.description"
          :selected="viewLayout === opt.value"
          :title="opt.title"
          @click="setViewLayout(opt.value)"
        />
      </SettingsGroup>
    </SettingsSection>

    <SettingsSection title="Audio Quality">
      <SettingsGroup
        ref="streamingGroup"
        description="Adjusting audio quality enables server-side transcoding, converting to a compatible format with a lower bitrate for smoother streaming"
        title="Streaming"
        variant="list"
      >
        <SelectableOption
          v-for="opt in BITRATE_OPTIONS"
          :key="opt.value"
          :badge="opt.badge"
          :description="opt.description"
          :selected="streamBitrate === opt.value"
          :title="opt.title"
          @click="setStreamBitrate(opt.value)"
        />
      </SettingsGroup>

      <SettingsGroup
        ref="replayGainGroup"
        description="Adjust playback volume to a consistent level using metadata embedded in your audio files"
        title="ReplayGain"
        variant="badge"
      >
        <SelectableBadge
          v-for="opt in REPLAY_GAIN_OPTIONS"
          :key="opt.value"
          :label="opt.label"
          :selected="replayGainMode === opt.value"
          @click="setReplayGainMode(opt.value)"
        />
      </SettingsGroup>

      <SettingsGroup
        ref="crossfadeGroup"
        description="Smoothly transition between tracks by switching early to the preloaded next track"
        title="Crossfade"
        variant="list"
      >
        <SettingsField title="Enable crossfade">
          <ToggleSwitch
            ref="crossfadeToggle"
            label="Enable crossfade"
            :pressed="crossfadeEnabled"
            @click="toggleCrossfade"
          />
        </SettingsField>

        <SettingsField
          description="Tracks shorter than the crossfade duration may not scrobble on some services"
          title="Duration"
        >
          <div
            ref="crossfadeWrapper"
            :class="[
              'centerAll',
              'spaceBetween',
              $style.crossfadeWrapper,
              {
                [$style.disabled]: !crossfadeEnabled,
              },
            ]"
          >
            <span class="strong">{{ crossfadeDuration }}s</span>

            <InputRange
              ref="crossfadeInputRange"
              v-model="crossfadeDuration"
              aria-label="Crossfade duration"
              :disabled="!crossfadeEnabled"
              :max="CROSSFADE_DURATION_MAX"
              :min="CROSSFADE_DURATION_MIN"
              @change="onCrossfadeDuration"
            />

            <span :class="['strong', $style.secondaryText]">
              {{ CROSSFADE_DURATION_MAX }}s
            </span>
          </div>
        </SettingsField>
      </SettingsGroup>
    </SettingsSection>

    <SettingsSection title="Navigation">
      <SettingsField
        description="Display podcasts in the navigation menu"
        title="Show podcasts"
      >
        <ToggleSwitch
          ref="showPodcastsToggle"
          label="Show podcasts"
          :pressed="showPodcasts"
          @click="toggleShowPodcasts"
        />
      </SettingsField>

      <SettingsField
        description="Display radio stations in the navigation menu"
        title="Show radio stations"
      >
        <ToggleSwitch
          ref="showRadioStationsToggle"
          label="Show radio stations"
          :pressed="showRadioStations"
          @click="toggleShowRadioStations"
        />
      </SettingsField>
    </SettingsSection>

    <SettingsSection title="Playback">
      <SettingsField
        description="Report plays to your Subsonic server"
        title="Scrobble"
      >
        <ToggleSwitch
          ref="scrobbleToggle"
          label="Scrobble"
          :pressed="scrobbleEnabled"
          @click="toggleScrobble"
        />
      </SettingsField>

      <SettingsField
        description="Automatically delete a podcast episode when it finishes playing. NOTE: Enabling this option will not respect the repeat setting, and will delete the episode even if it is set to repeat."
        title="Delete podcast on end"
      >
        <ToggleSwitch
          ref="deletePodcastOnEndToggle"
          label="Delete podcast on end"
          :pressed="deletePodcastOnEnd"
          @click="toggleDeletePodcastOnEnd"
        />
      </SettingsField>
    </SettingsSection>

    <SettingsSection title="Maintenance">
      <SettingsField
        description="Approximate space used by cached audio, images, and other data"
        responsive
        title="Cache size"
      >
        <span :class="$style.secondaryText">{{ cacheEstimate }}</span>
      </SettingsField>

      <SettingsField
        description="Remove all cached data and stored player/queue state"
        title="Clear cache"
      >
        <ButtonLink
          ref="clearCacheButtonLink"
          class="actionButton"
          showText
          @click="onClearCache"
        >
          Clear
        </ButtonLink>
      </SettingsField>

      <SettingsField
        description="Restore all settings to their factory defaults"
        title="Reset settings"
      >
        <ButtonLink
          ref="resetSettingsButtonLink"
          class="actionButton"
          showText
          @click="onResetSettings"
        >
          Reset
        </ButtonLink>
      </SettingsField>
    </SettingsSection>

    <SettingsSection v-if="aboutInformation" title="About">
      <AboutApp
        :appInformation="aboutInformation.appInformation"
        :serverInformation="aboutInformation.serverInformation"
      />
    </SettingsSection>
  </div>
</template>

<style module>
.settings {
  gap: var(--space-24);
  padding: var(--space-24);
}

.title {
  font-size: var(--h2-font-size);
}

.secondaryText {
  color: var(--secondary-font-color);
}

.crossfadeWrapper {
  width: 200px;
}

.disabled {
  opacity: 0.5;
}
</style>
