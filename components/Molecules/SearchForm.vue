<script setup lang="ts">
import ButtonLink from '@/components/Atoms/ButtonLink.vue';
import InputField from '@/components/Atoms/InputField.vue';

const emit = defineEmits<{
  submit: [value: string];
}>();

const formInputs = {
  query: {
    validationRules: {
      required: true,
    },
  },
};

const form = createForm(formInputs);

async function onFormSubmit() {
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
  <form novalidate @submit.prevent="onFormSubmit">
    <div class="centerItems">
      <InputField
        :id="form.fields.query.id"
        v-model="form.fields.query.value.value"
        :class="$style.inputField"
        hide-label
        :label="form.fields.query.label"
        placeholder="Enter query"
        :required="form.fields.query.required"
      />

      <ButtonLink :class="$style.buttonLink" :icon="ICONS.search" type="submit">
        Login
      </ButtonLink>
    </div>
  </form>
</template>

<style module>
.inputField {
  input {
    padding-right: calc(var(--space-24) * 2);
  }
}

.buttonLink {
  margin-left: calc(var(--space-24) * -2);
}
</style>
