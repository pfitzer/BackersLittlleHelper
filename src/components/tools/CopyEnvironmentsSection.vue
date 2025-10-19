<template>
  <div class="card rsi-border rsi-corners backdrop-blur-md shadow-xl mb-6" style="background: rgba(0, 11, 17, 0.85);">
    <div class="card-body">
      <h3 class="card-title text-secondary mb-4">{{ $t('tools.copyFromTo') }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- Source Environment -->
        <div>
          <label class="label">
            <span class="label-text font-bold">{{ $t('tools.copySource') }}</span>
          </label>
          <div class="flex flex-col gap-2">
            <button
              v-for="env in environments"
              :key="env"
              @click="$emit('update:sourceEnv', env)"
              :class="[
                'btn btn-sm justify-start transition-all duration-200',
                sourceEnv === env
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-base-100 scale-105 shadow-lg bg-primary/10 border-primary hover:bg-primary/20'
                  : 'btn-outline hover:scale-102'
              ]"
            >
              <svg v-if="sourceEnv === env" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span :class="['badge', getUniverseBadgeClass(env)]">{{ env }}</span>
              <span v-if="environmentStatus[env]" class="text-xs opacity-70">({{ $t('tools.folderExists') }})</span>
              <span v-else class="text-xs opacity-70">({{ $t('tools.folderMissing') }})</span>
            </button>
          </div>
        </div>
        <!-- Target Environment -->
        <div>
          <label class="label">
            <span class="label-text font-bold">{{ $t('tools.copyTarget') }}</span>
          </label>
          <div class="flex flex-col gap-2">
            <button
              v-for="env in environments"
              :key="env"
              @click="$emit('update:targetEnv', env)"
              :class="[
                'btn btn-sm justify-start transition-all duration-200',
                targetEnv === env
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-base-100 scale-105 shadow-lg bg-primary/10 border-primary hover:bg-primary/20'
                  : 'btn-outline hover:scale-102'
              ]"
            >
              <svg v-if="targetEnv === env" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span :class="['badge', getUniverseBadgeClass(env)]">{{ env }}</span>
              <span v-if="environmentStatus[env]" class="text-xs opacity-70">({{ $t('tools.folderExists') }})</span>
              <span v-else class="text-xs opacity-70">({{ $t('tools.folderMissing') }})</span>
            </button>
          </div>
        </div>
      </div>
      <button
        @click="$emit('copy')"
        class="btn btn-primary"
        :disabled="!installDirSet || sourceEnv === targetEnv"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
          <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
        </svg>
        {{ $t('tools.copy') }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  environments: Array,
  sourceEnv: String,
  targetEnv: String,
  environmentStatus: Object,
  installDirSet: Boolean,
  getUniverseBadgeClass: Function
})

defineEmits(['update:sourceEnv', 'update:targetEnv', 'copy'])
</script>
