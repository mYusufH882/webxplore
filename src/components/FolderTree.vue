<template>
  <div>
    <ul v-if="folders && folders.length" class="space-y-2">
      <li v-for="folder in folders" :key="folder.id" class="relative">
        <div
          @click="toggleDropdown(folder)"
          class="cursor-pointer flex items-center justify-between p-2 bg-white rounded-lg hover:bg-gray-100 transition duration-300"
        >
          <!-- Nama Folder -->
          <span
            @click="selectFolder(folder)"
            :class="{ 'font-bold': selectedFolder && selectedFolder.id === folder.id }"
            class="text-blue-400 mr-auto"
          >
            {{ folder.name }}
          </span>

          <!-- Ikon Dropdown -->
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

          <!-- Three-Dot Menu for Folder Options -->
          <div class="relative" @click.stop="toggleOptions(folder)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v0.01M12 12v0.01M12 18v0.01"
              />
            </svg>
            <!-- Options dropdown -->
            <div
              v-if="showOptions && optionsFolder === folder"
              class="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
            >
              <ul>
                <li
                  @click="editFolderParent(folder)"
                  class="cursor-pointer p-2 hover:bg-gray-100 text-yellow-400"
                >
                  Edit
                </li>
                <li
                  @click="deleteFolderParent(folder)"
                  class="cursor-pointer p-2 hover:bg-gray-100 text-red-400"
                >
                  Delete
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Subfolder Rendering Rekursif -->
        <ul
          v-if="activeFolder === folder"
          class="mt-2 ml-4 space-y-2 border-l-2 border-blue-200 pl-4"
        >
          <folder-tree
            v-for="subfolder in folder.subfolders"
            :key="subfolder.id"
            :folders="[subfolder]"
            :selectedFolder="selectedFolder"
            @select-folder="$emit('select-folder', $event)"
            @edit-folder="$emit('edit-folder', $event)"
            @delete-folder="$emit('delete-folder', $event)"
          />
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
      activeFolder: null,
      showOptions: false,
      optionsFolder: null
    }
  },
  methods: {
    toggleDropdown(folder) {
      this.activeFolder = this.activeFolder === folder ? null : folder
    },
    selectFolder(folder) {
      this.$emit('select-folder', folder)
    },
    toggleOptions(folder) {
      if (this.optionsFolder === folder) {
        this.showOptions = !this.showOptions
      } else {
        this.showOptions = true
        this.optionsFolder = folder
      }
    },
    editFolderParent(folder) {
      this.$emit('edit-folder', folder)
      this.showOptions = false
      this.optionsFolder = null
    },
    deleteFolderParent(folder) {
      this.$emit('delete-folder', folder)
      this.showOptions = false
      this.optionsFolder = null
    },
    closeOptions(event) {
      if (!this.$el.contains(event.target)) {
        this.showOptions = false
        this.optionsFolder = null
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.closeOptions)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeOptions)
  }
}
</script>
