<template>
  <div class="card bg-base-300/50 backdrop-blur-md shadow-xl border border-primary/20">
    <div class="card-body">
      <h3 class="card-title text-secondary mb-4">{{ title }}</h3>
      <p class="text-sm opacity-70 mb-4">{{ path || noPathText }}</p>
      <div class="flex gap-2 flex-wrap items-center">
        <button
          @click="$emit('delete')"
          class="btn btn-error btn-sm"
          :disabled="!path"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          {{ deleteText }}
        </button>
        <span v-if="extraInfo" class="badge badge-neutral">{{ extraInfo }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  path: String,
  noPathText: String,
  deleteText: String,
  extraInfo: String
})

defineEmits(['delete'])
</script>
