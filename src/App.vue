<template>
  <div class="flex flex-col h-screen">
    <!-- Navbar -->
    <nav class="bg-blue-600 text-white p-4 flex items-center justify-between">
      <div class="text-lg font-semibold">WebXplore</div>
      <button
        @click="openAddFolderModal"
        class="bg-white text-blue-600 px-4 py-2 rounded-lg shadow-md hover:bg-gray-100"
      >
        Add Folder
      </button>
    </nav>

    <div class="flex flex-col lg:flex-row flex-grow">
      <!-- Panel FolderTree -->
      <div class="lg:w-1/4 w-full lg:border-r bg-gray-100 p-4 lg:h-full overflow-y-auto">
        <FolderTree
          :folders="folders"
          :selectedFolder="selectedFolder"
          @select-folder="handleFolderSelect"
        />
      </div>

      <!-- Panel FileList -->
      <div class="lg:w-3/4 w-full p-4 lg:h-full overflow-y-auto">
        <div v-if="!selectedFolder" class="mb-4">
          <h2 class="text-xl font-semibold text-gray-800 mb-2">Home</h2>
        </div>
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

          <!-- Tampilkan file -->
          <ul
            v-if="selectedFolder && selectedFolder.files && selectedFolder.files.length"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <li
              v-for="file in selectedFolder.files"
              :key="file.id"
              class="bg-white text-center p-4 rounded-lg shadow-md border border-gray-200"
            >
              <div>
                <p class="font-medium text-blue-600">
                  {{ file.name }}
                </p>
                <p class="text-gray-500 text-sm">({{ file.mime_type }}, {{ file.size }} bytes)</p>
              </div>
            </li>
          </ul>
          <p v-else class="text-gray-600 my-5"><small>No files in this folder.</small></p>

          <!-- Tampilkan subfolder -->
          <div
            v-if="selectedFolder && selectedFolder.subfolders && selectedFolder.subfolders.length"
            class="mt-4"
          >
            <h3 class="text-lg font-semibold text-gray-700">Subfolders:</h3>
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
          </div>

          <p v-else class="text-gray-600 mt-5">
            <small>Select a folder to view its contents.</small>
          </p>
        </div>

        <!-- ModalBox for Adding a Folder -->
        <ModalBox :visible="showModal" title="Add New Folder" @close="showModal = false">
          <form @submit.prevent="addFolder">
            <div class="mb-4">
              <label for="folderName" class="block text-gray-700 mb-2">Folder Name:</label>
              <input
                id="folderName"
                v-model="newFolderName"
                type="text"
                class="border border-gray-300 p-2 rounded-lg w-full"
                required
              />
            </div>
            <div class="mb-4">
              <label for="parentFolder" class="block text-gray-700">Folder</label>
              <select
                v-model="selectedFolderId"
                id="parentFolder"
                class="border border-gray-300 p-2 rounded-lg w-full"
              >
                <option v-for="folder in folders" :key="folder.id" :value="folder.id">
                  {{ folder.name }}
                </option>
              </select>
            </div>
            <div class="flex justify-end">
              <button
                type="submit"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
              >
                Add Folder
              </button>
            </div>
          </form>
        </ModalBox>
      </div>
    </div>
  </div>
</template>

<script>
import FolderTree from './components/FolderTree.vue'
import ModalBox from './components/ModalBox.vue'

export default {
  components: {
    FolderTree,
    ModalBox
  },
  data() {
    return {
      folders: [],
      selectedFolder: null,
      showModal: false,
      newFolderName: '',
      selectedFolderId: null,
      parentFolder: null
    }
  },
  mounted() {
    this.fetchFolders()
  },
  methods: {
    async fetchFolders() {
      try {
        await this.$apiClient
          .get('/folders')
          .then((response) => {
            this.folders = response.data.data.filter((folder) => folder.parent_id === null)
            console.log(response.data.data.filter((folder) => folder.parent_id === null))
          })
          .catch((error) => {
            console.error('Error fetching folders:', error)
          })
      } catch (error) {
        console.error('Unhandled error in fetchFolders:', error)
      }
    },
    handleFolderSelect(folder) {
      if (folder) {
        this.selectedFolder = folder
        this.selectedFolderId = folder.id
        this.parentFolder = this.folders.find((parent) => parent.id === folder.parent_id)
      } else {
        this.selectedFolder = null
        this.parentFolder = null
      }
    },
    openAddFolderModal() {
      this.showModal = true
    },
    addFolder() {
      console.log('Adding folder:', this.newFolderName)
      this.showModal = false
      this.newFolderName = ''
      this.fetchFolders()
    },
    editFolder(folder) {
      console.log('Editing : ', folder.name)

      this.showModal = true
      this.newFolderName = folder.name
      this.selectedFolderId = folder.parent_id || ''
    },
    deleteFolder(folder) {
      console.log('Deleting : ', folder.name)

      if (confirm(`Apakah anda ingin menghapus folder ${folder.name} ?`)) {
        this.folders = this.folders.filter((f) => f.id !== folder.id)
      }
    }
  }
}
</script>
