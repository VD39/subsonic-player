<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';

const props = withDefaults(
  defineProps<{
    gridRows?: number;
  }>(),
  {
    gridRows: 0,
  },
);

const swiperRef = ref(null);
const swiperWrapperRef = ref<HTMLElement | null>(null);

function breakpointsSettings(slides = 2) {
  return {
    grid: {
      fill: 'row',
      rows: props.gridRows,
    },
    slidesPerGroup: slides,
    slidesPerView: slides,
    spaceBetween: 15,
  } as never;
}

const swiper = useSwiper(swiperRef, {
  breakpoints: {
    /* eslint-disable perfectionist/sort-objects */
    0: breakpointsSettings(),
    500: breakpointsSettings(3),
    900: breakpointsSettings(4),
    1200: breakpointsSettings(5),
    1500: breakpointsSettings(6),
    1800: breakpointsSettings(7),
    /* eslint-enable perfectionist/sort-objects */
  },
});
</script>

<template>
  <div ref="swiperWrapperRef" :class="['mBL', $style.carouselSwiper]">
    <swiper-container ref="swiperRef">
      <slot />
    </swiper-container>

    <ButtonLink
      :class="$style.previous"
      :icon="ICONS.previous"
      @click="swiper.prev()"
    >
      Previous slide
    </ButtonLink>

    <ButtonLink :class="$style.next" :icon="ICONS.next" @click="swiper.next()">
      Next slide
    </ButtonLink>
  </div>
</template>

<style module>
.carouselSwiper {
  position: relative;
  z-index: 0;
  transition: all var(--transition);

  @media (hover: hover) {
    &:hover {
      .next,
      .previous {
        --carousel-swiper-button-opacity: 1;
      }
    }
  }
}

swiper-container {
  position: relative;
  text-size-adjust: none;
  display: grid;
  grid-template-rows: 1fr auto;
  padding: 0;
  margin-right: auto;
  margin-left: auto;
  overflow: hidden;
  list-style: none;
}

.next,
.previous {
  --carousel-swiper-button-opacity: 0;

  position: absolute;
  inset: 0 auto;
  z-index: 1;
  height: var(--width-height-100);
  opacity: var(--carousel-swiper-button-opacity);
  transition: opacity var(--transition);
}

.next {
  right: 0;
}

.previous {
  left: 0;
}
</style>
