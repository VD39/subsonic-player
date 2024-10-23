<script setup lang="ts">
const props = defineProps<{
  maxLines: number;
  text: string;
}>();

defineEmits(['more']);

const showButton = ref(false);
const textRef = ref<HTMLElement | null>(null);
const tempText = ref('');

function updateClamp() {
  if (!textRef.value) {
    return;
  }

  showButton.value = false;

  if (textRef.value.getClientRects().length <= props.maxLines) {
    tempText.value = props.text;
    textRef.value.innerHTML = tempText.value;
  }

  if (textRef.value.getClientRects().length > props.maxLines) {
    while (textRef.value.getClientRects().length > props.maxLines) {
      tempText.value = props.text.substring(0, tempText.value.length - 1);
      textRef.value.innerHTML = tempText.value;
    }

    textRef.value.innerHTML = `${textRef.value.innerText
      .substring(0, textRef.value.innerText.length - 20)
      .trim()}...  `;

    showButton.value = true;
  }
}

function onResize() {
  updateClamp();
}

onMounted(() => {
  if (!textRef.value) {
    return;
  }

  textRef.value.innerHTML = props.text;
  tempText.value = textRef.value.innerText;

  updateClamp();

  window.addEventListener('resize', onResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
});
</script>

<template>
  <div :class="$style.textClamp">
    <div
      ref="clamp"
      :class="['clamp', $style.lineClamp]"
      :style="{ '--truncate-line-clamp': maxLines }"
    >
      <span ref="textRef" />

      <button
        v-if="showButton"
        ref="readMore"
        :class="$style.button"
        @click="$emit('more')"
      >
        More
      </button>
    </div>
  </div>
</template>

<style module>
.textClamp {
  position: relative;
}

.lineClamp {
  -webkit-line-clamp: var(--truncate-line-clamp);
}

.button {
  display: inline;
}
</style>
