<script setup lang="ts">
import IconButton from '@/components/Buttons/IconButton.vue';

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

const swiper = useSwiper(swiperRef, {
  slidesPerView: 2,
  slidesPerGroup: 2,
  spaceBetween: 15,
  breakpoints: {
    0: {
      slidesPerView: 2,
      slidesPerGroup: 2,
      grid: {
        rows: props.gridRows,
        fill: 'row',
      },
    },
    500: {
      slidesPerView: 3,
      slidesPerGroup: 3,
      grid: {
        rows: props.gridRows,
        fill: 'row',
      },
    },
    900: {
      slidesPerView: 4,
      slidesPerGroup: 4,
      grid: {
        rows: props.gridRows,
        fill: 'row',
      },
    },
    1200: {
      slidesPerView: 5,
      slidesPerGroup: 5,
      grid: {
        rows: props.gridRows,
        fill: 'row',
      },
    },
    1500: {
      slidesPerView: 6,
      slidesPerGroup: 6,
      grid: {
        rows: props.gridRows,
        fill: 'row',
      },
    },
    1800: {
      slidesPerView: 7,
      slidesPerGroup: 7,
      grid: {
        rows: props.gridRows,
        fill: 'row',
      },
    },
  },
});
</script>

<template>
  <div ref="swiperWrapperRef" :class="$style.carouselSwiper">
    <swiper-container ref="swiperRef">
      <slot />
    </swiper-container>

    <IconButton
      icon="PhCaretDoubleLeft"
      :class="$style.previous"
      @click="swiper.prev()"
    >
      Previous slide
    </IconButton>

    <IconButton
      icon="PhCaretDoubleRight"
      :class="$style.next"
      @click="swiper.next()"
    >
      Next slide
    </IconButton>
  </div>
</template>

<style module>
.carouselSwiper {
  position: relative;
  z-index: 0;
  margin-bottom: var(--space-32);

  &:hover {
    .next,
    .previous {
      opacity: 1;
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

/* stylelint-disable no-descending-specificity */
.next,
.previous {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 99;
  height: 100%;
  background-color: rgb(20 20 20 / 40%);
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.next {
  right: 0;
}

.previous {
  left: 0;
}
/* stylelint-enable no-descending-specificity */
</style>
