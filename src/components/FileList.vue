<template>
  <div v-if="selectedFolder && parentFolder" class="mb-4">
    <!-- Show Files -->
    <div v-if="selectedFolder && selectedFolder.files && selectedFolder.files.length">
      <ul class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-2">
        <li
          v-for="file in selectedFolder.files"
          :key="file.id"
          class="bg-white text-center p-4 rounded-lg shadow-md border border-gray-200"
        >
          <!-- <div v-if="file.mime_type.startsWith('image/')">
              <img :src="file.path" :alt="file.name" class="max-h-40 w-auto mx-auto mb-2" />
            </div> -->
          <div>
            <p class="font-medium text-blue-600">{{ file.name }}</p>
            <p class="text-gray-500 text-sm">({{ file.mime_type }}, {{ file.size }} bytes)</p>
          </div>
        </li>
      </ul>
    </div>

    <p v-else class="text-gray-600 my-5"><small>No files in this folder.</small></p>
  </div>
</template>

<script>
export default {
  name: 'FileList',
  props: {
    selectedFolder: {
      type: Object,
      default: () => ({})
    },
    parentFolder: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    editFolder(folder) {
      this.$emit('edit-folder', folder)
    },
    deleteFolder(folder) {
      this.$emit('delete-folder', folder)
    },
    handleFolderSelect(folder) {
      this.$emit('select-folder', folder)
    }
  }
}
</script>
