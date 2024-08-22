<template>
  <div v-if="selectedFolder && parentFolder" class="mb-4">
    <h2 class="text-xl font-semibold text-gray-800 mb-2">
      {{ parentFolder.name }} > {{ selectedFolder.name }}
      <button
        @click="editFolder(selectedFolder)"
        class="ml-4 bg-yellow-500 text-white px-1 py-0.5 text-sm rounded shadow hover:bg-yellow-600"
      >
        Edit
      </button>
      <button
        @click="deleteFolder(selectedFolder)"
        class="ml-2 bg-red-500 text-white px-1 py-0.5 text-sm rounded shadow hover:bg-red-600"
      >
        Delete
      </button>
    </h2>

    <!-- Show Files -->
    <div v-if="selectedFolder && selectedFolder.files && selectedFolder.files.length">
      <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

    <!-- Show SubFolder -->
    <!-- <div
      v-if="selectedFolder && selectedFolder.subfolders && selectedFolder.subfolders.length"
      class="mt-4"
    >
      <h3 class="text-lg font-semibold text-gray-700">Sub Folders :</h3>
      <ul class="space-y-2">
        <li v-for="subfolder in selectedFolder.subfolders" :key="subfolder.id">
          <a
            href="#"
            @click.prevent="handleFolderSelect(subfolder)"
            class="text-blue-500 hover:underline"
          >
            {{ subfolder.name }}
          </a>
        </li>
      </ul>
    </div> -->
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
