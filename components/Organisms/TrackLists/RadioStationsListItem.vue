<script setup lang="ts">
import InteractionWrapper from '@/components/Atoms/InteractionWrapper.vue';
import LazyLoadContent from '@/components/Atoms/LazyLoadContent.vue';
import LinkOrText from '@/components/Atoms/LinkOrText.vue';
import MarqueeScroll from '@/components/Atoms/MarqueeScroll.vue';
import DropdownDivider from '@/components/Molecules/Dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/Molecules/Dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/Molecules/Dropdown/DropdownMenu.vue';
import TrackPlayPause from '@/components/Organisms/TrackPlayPause.vue';

const props = defineProps<{
  index: number;
  radioStation: RadioStation;
}>();

const emit = defineEmits<{
  addToQueue: [];
  deleteRadioStation: [];
  editRadioStation: [];
  playRadioStation: [];
}>();

const { isCurrentTrack } = useAudioPlayer();

const dropdownMenuRef = useTemplateRef('dropdownMenuRef');

function onClick() {
  if (isCurrentTrack(props.radioStation.id)) {
    return;
  }

  emit('playRadioStation');
}

function openDropdownMenu(event: MouseEvent | TouchEvent) {
  dropdownMenuRef.value?.openDropdownMenu(event);
}
</script>

<template>
  <LazyLoadContent class="trackRow">
    <InteractionWrapper
      @click="onClick"
      @contextMenu="openDropdownMenu"
    >
      <div class="trackCell">
        <div>
          <TrackPlayPause
            :image="radioStation.image"
            :trackId="radioStation.id"
            :trackNumber="index + 1"
            @playTrack="$emit('playRadioStation')"
          />

          <MarqueeScroll>
            <LinkOrText
              is="a"
              class="noTouchEvents"
              :isLink="!!radioStation.homePageUrl"
              target="_blank"
              :text="radioStation.name"
              :to="radioStation.homePageUrl"
            />
          </MarqueeScroll>
        </div>
      </div>

      <div class="trackCell trackOptions">
        <DropdownMenu ref="dropdownMenuRef">
          <DropdownItem
            ref="playRadioStation"
            @click="$emit('playRadioStation')"
          >
            Play station
          </DropdownItem>
          <DropdownItem ref="addToQueue" @click="$emit('addToQueue')">
            Add to queue
          </DropdownItem>
          <template v-if="radioStation.homePageUrl">
            <DropdownDivider />
            <DropdownItem
              is="a"
              ref="visitStation"
              :href="radioStation.homePageUrl"
              target="_blank"
            >
              Visit station
            </DropdownItem>
          </template>
          <DropdownDivider />
          <DropdownItem
            ref="editRadioStation"
            @click="$emit('editRadioStation')"
          >
            Edit station
          </DropdownItem>
          <DropdownItem
            ref="deleteRadioStation"
            @click="$emit('deleteRadioStation')"
          >
            Delete station
          </DropdownItem>
        </DropdownMenu>
      </div>
    </InteractionWrapper>
  </LazyLoadContent>
</template>
