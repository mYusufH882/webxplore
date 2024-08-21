<template>
  <div>
    <ul v-if="folders && folders.length" class="space-y-2">
      <li v-for="folder in folders" :key="folder.id" class="relative">
        <div
          @click="toggleDropdown(folder)"
          class="cursor-pointer flex items-center justify-between p-2 bg-white rounded-lg hover:bg-gray-100 transition duration-300"
        >
          <span
            :class="{ 'font-bold': selectedFolder && selectedFolder.id === folder.id }"
            class="text-blue-400"
          >
            {{ folder.name }}
          </span>
          <!-- Icon dropdown toggle -->
          <svg
            v-if="folder.subfolders && folder.subfolders.length"
            :class="{ 'rotate-180': activeFolder === folder }"
            class="ml-2 w-4 h-4 transform transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <!-- Dropdown menu for subfolders -->
        <ul
          v-if="activeFolder === folder"
          class="mt-2 ml-4 space-y-2 border-l-2 border-blue-200 pl-4"
        >
          <li v-for="subfolder in folder.subfolders" :key="subfolder.id">
            <div
              @click="selectFolder(subfolder)"
              class="cursor-pointer text-blue-400 hover:text-blue-600 transition duration-300"
            >
              {{ subfolder.name }}
            </div>
          </li>
        </ul>
      </li>
    </ul>
    <p v-else class="text-gray-500 text-sm">No folders found.</p>
  </div>
</template>

<script>
export default {
  name: 'FolderTree',
  props: {
    folders: {
      type: Array,
      required: true
    },
    selectedFolder: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      activeFolder: null
    }
  },
  methods: {
    toggleDropdown(folder) {
      this.activeFolder = this.activeFolder === folder ? null : folder
    },
    selectFolder(subfolder) {
      this.$emit('select-folder', subfolder)
    }
  }
}
</script>
