<script setup lang="ts">
const props = defineProps<{
  maxLines: number;
  text: string;
}>();

defineEmits(['more']);

const showButton = ref(false);
const textRef = ref<HTMLElement | null>(null);
const temp = ref('');

function updateClamp() {
  if (!textRef.value) {
    return;
  }

  showButton.value = false;

  if (textRef.value.getClientRects().length <= props.maxLines) {
    temp.value = props.text;
    textRef.value.innerText = temp.value;
  }

  if (textRef.value.getClientRects().length > props.maxLines) {
    while (textRef.value.getClientRects().length > props.maxLines) {
      temp.value = props.text.substring(0, temp.value.length - 1);
      textRef.value.innerText = temp.value;
    }

    textRef.value.innerText = `${textRef.value.innerText
      .substring(0, textRef.value.innerText.length - 20)
      .trim()}...  `;

    showButton.value = true;
  }
}

onMounted(() => {
  if (!textRef.value) {
    return;
  }

  textRef.value.innerText = props.text;
  temp.value = textRef.value.innerText;

  updateClamp();

  window.addEventListener('resize', updateClamp);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateClamp);
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
  margin-bottom: var(--space-8);
}

.lineClamp {
  -webkit-line-clamp: var(--truncate-line-clamp);
}

.button {
  display: inline;
}
</style>
