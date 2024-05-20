<script setup lang="ts">
import InputField from '@/components/FormFields/InputField.vue';
import IconButton from '@/components/Buttons/IconButton.vue';

const emit = defineEmits(['submit']);

const formInputs = {
  query: {
    validationRules: {
      required: true,
    },
  },
};

const form = createForm(formInputs);

async function submitForm() {
  validateInputs(form);

  if (!form.isValid.value) {
    return;
  }

  const query = replaceSpacesWithCharacter(
    form.fields.query.value.value as string,
  ).toLowerCase();

  form.fields.query.value.value = '';

  emit('submit', query);
}
</script>

<template>
  <form novalidate @submit.prevent="submitForm">
    <div :class="$style.inner">
      <InputField
        :id="form.fields.query.id"
        v-model="form.fields.query.value.value"
        :class="$style.input"
        :label="form.fields.query.label"
        placeholder="Enter query"
        :required="form.fields.query.required"
        hide-label
      />

      <IconButton type="submit" :class="$style.button" icon="PhMagnifyingGlass">
        Login
      </IconButton>
    </div>
  </form>
</template>

<style module>
.inner {
  @mixin align-center;

  position: relative;
}

.input {
  input {
    padding-right: var(--space-40);
  }
}

.button {
  margin-left: calc(var(--space-40) * -1);
}
</style>
