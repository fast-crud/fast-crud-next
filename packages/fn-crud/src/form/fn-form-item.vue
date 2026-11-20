<template>
  <div class="fn-form-item" :class="{ 'fn-form-item-error': error }">
    <label v-if="label" class="fn-form-item-label" :for="htmlFor">{{ label }}</label>
    <div class="fn-form-item-control">
      <div class="fn-form-item-field">
        <slot />
      </div>
      <div class="fn-form-item-message" :class="{ 'fn-form-item-error-message': error, 'fn-form-item-help': !error && help }" :role="error ? 'alert' : undefined">
        {{ error || help }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label?: string; error?: string; help?: string; htmlFor?: string }>();
</script>

<style lang="less">
.fn-form-item {
  display: flex;
  align-items: flex-start;
  min-width: 0;
  // margin-bottom: 16px;
  gap: 12px;

  .fn-form-item-label {
    flex: 0 0 var(--fn-form-label-width, 120px);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: var(--fn-control-height, 32px);
    padding-top: 0;
    color: #344054;
    text-align: right;
  }

  .fn-form-item-control {
    flex: 1;
    min-width: 0;
  }

  .fn-form-item-field {
    display: flex;
    align-items: center;
    min-height: var(--fn-control-height, 32px);
  }

  .fn-form-item-message {
    margin-top: 4px;
    min-height: 16px;
    font-size: 12px;
    line-height: 16px;
  }

  .fn-form-item-help {
    color: #98a2b1;
  }

  .fn-form-item-error-message {
    color: #dc3545;
  }

  &.fn-form-item-error .fn-input {
    border-color: #dc3545;
    &:focus {
      box-shadow: 0 0 0 2px color-mix(in srgb, #dc3545 18%, transparent);
    }
  }

  .dark & {
    .fn-form-item-label {
      color: #d8dee8;
    }
    .fn-form-item-help {
      color: #98a2b1;
    }
  }
}
</style>
