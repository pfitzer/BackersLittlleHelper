<template>
  <div class="card rsi-border rsi-corners backdrop-blur-md shadow-xl mb-6" style="background: rgba(0, 11, 17, 0.85);">
    <div class="card-body">
      <h3 class="card-title text-2xl mb-4">{{ $t('tools.backupDir') }}</h3>
      <p class="text-sm opacity-70 mb-4">{{ backupDirectory || $t('tools.noPathSet') }}</p>

      <!-- Existing Backups List -->
      <div v-if="existingBackups.length > 0" class="mb-6">
        <h4 class="text-lg font-semibold mb-3">{{ $t('tools.existingBackups') }}</h4>
        <div class="space-y-2">
          <div
            v-for="backup in existingBackups"
            :key="backup.name"
            class="flex items-center justify-between p-3 bg-base-300/50 rounded-lg border border-primary/20"
          >
            <div class="flex items-center gap-3">
              <span :class="['badge', getUniverseBadgeClass(backup.universe)]">{{ backup.universe }}</span>
              <span class="text-sm opacity-70">{{ backup.age }}</span>
            </div>
            <div class="flex gap-2">
              <button
                @click="$emit('restore-backup', backup.name)"
                class="btn btn-success btn-xs"
                :title="$t('tools.restore')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                </svg>
              </button>
              <button
                @click="$emit('delete-backup', backup.name)"
                class="btn btn-error btn-xs"
                :title="$t('tools.delete')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2 flex-wrap">
        <button @click="$emit('delete')" class="btn btn-error btn-sm" :disabled="!backupDirectory">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          {{ $t('tools.delete') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  backupDirectory: String,
  existingBackups: Array,
  getUniverseBadgeClass: Function
})

defineEmits(['delete', 'delete-backup'])
</script>
