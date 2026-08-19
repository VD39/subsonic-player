<script setup lang="ts">
import DropdownDivider from '@/components/dropdown/DropdownDivider.vue';
import DropdownItem from '@/components/dropdown/DropdownItem.vue';
import DropdownMenu from '@/components/dropdown/DropdownMenu.vue';
import TrackPlayPause from '@/components/player/controls/TrackPlayPause.vue';
import TrackPlayPauseDropdownItem from '@/components/player/controls/TrackPlayPauseDropdownItem.vue';
import ButtonLink from '@/components/ui/ButtonLink.vue';
import InteractionWrapper from '@/components/ui/InteractionWrapper.vue';
import LazyLoadContent from '@/components/ui/LazyLoadContent.vue';
import LinkOrText from '@/components/ui/LinkOrText.vue';
import MarqueeScroll from '@/components/ui/MarqueeScroll.vue';

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

const { isCurrentTrack } = useQueue();

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
  <LazyLoadContent class="trackRow trackPlayPauseHover">
    <InteractionWrapper @click="onClick" @contextMenu="openDropdownMenu">
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
        <ButtonLink
          ref="addToQueueButton"
          :icon="ICONS.add"
          title="Add to queue"
          @click="$emit('addToQueue')"
        >
          Add to queue
        </ButtonLink>
      </div>

      <div class="trackCell trackOptions">
        <DropdownMenu ref="dropdownMenuRef">
          <TrackPlayPauseDropdownItem
            :trackId="radioStation.id"
            :type="radioStation.type"
            @playTrack="$emit('playRadioStation')"
          />
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
