<script setup lang="ts">
defineProps<{
  appInformation: AppInformation;
  serverInformation: ServerInformation;
}>();
</script>

<template>
  <div :class="['smallFont', $style.aboutApp]">
    <p>
      Subsonic player is an open source, responsive, modern web-based client
      designed and built for Subsonic music servers.
    </p>
  </div>

  <div :class="['mBM', $style.columns]">
    <div :class="['smallFont', $style.aboutApp, $style.column]">
      <h3 :class="['mBM', 'strong', 'smallFont', $style.heading]">Server</h3>

      <p v-if="serverInformation.name" ref="name">
        <span class="strong">Name: </span>
        {{ serverInformation.name }}
      </p>

      <p v-if="serverInformation.version" ref="version">
        <span class="strong">Version: </span>
        {{ serverInformation.version }}
      </p>

      <p>
        <span class="strong">URL: </span>

        <a
          :href="serverInformation.url"
          rel="noopener noreferrer"
          target="_blank"
        >
          {{ serverInformation.url }}
        </a>
      </p>

      <p v-if="serverInformation.openSubsonic" ref="openSubsonic">
        <span class="strong">OpenSubsonic enabled: </span>
        {{ serverInformation.openSubsonic }}
      </p>
    </div>

    <div :class="['smallFont', $style.aboutApp, $style.column]">
      <h3 :class="['mBM', 'strong', 'smallFont', $style.heading]">App</h3>

      <p>
        <span class="strong">App version: </span>

        <a
          :href="appInformation.githubReleaseUrl"
          rel="noopener noreferrer"
          target="_blank"
        >
          {{ appInformation.version }}
        </a>
      </p>

      <p>
        <span class="strong">Released: </span>
        {{ appInformation.releaseDate }}
      </p>

      <p>
        <a
          :href="appInformation.homepageUrl"
          rel="noopener noreferrer"
          target="_blank"
        >
          Subsonic Player
        </a>
      </p>

      <p>
        <a
          :href="appInformation.githubUrl"
          rel="noopener noreferrer"
          target="_blank"
        >
          Source code
        </a>
      </p>

      <p>
        <a
          :href="appInformation.bugReportUrl"
          rel="noopener noreferrer"
          target="_blank"
        >
          Bug reports
        </a>
      </p>
    </div>
  </div>
</template>

<style module>
.aboutApp {
  color: var(--secondary-font-color);

  a {
    color: var(--theme-color);
  }
}

.columns {
  display: flex;
  flex-direction: column;
  gap: var(--space-24);

  @media (--tablet-up) {
    flex-direction: row;
  }
}

.column {
  @media (--tablet-up) {
    flex: 1;
  }
}

.heading {
  color: var(--body-font-color);
}
</style>
