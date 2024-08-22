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

    <!-- Main Content -->
    <div class="flex flex-col lg:flex-row flex-grow">
      <!-- Sidebar Panel -->
      <div
        class="lg:w-1/4 md:w-1/4 w-full lg:border-r bg-gray-100 p-4 lg:h-full overflow-y-auto fixed lg:relative"
      >
        <FolderTree
          :folders="folders"
          :selectedFolder="selectedFolder"
          @select-folder="handleFolderSelect"
          @deleteFolder="deleteFolder"
          @editFolder="editFolder"
        />
      </div>

      <!-- Panel FileList -->
      <div class="lg:w-3/4 w-full p-4 lg:h-full overflow-y-auto">
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
                <p class="font-medium text-blue-600">{{ file.name }}</p>
                <p class="text-gray-500 text-sm">({{ file.mime_type }}, {{ file.size }} bytes)</p>
              </div>
            </li>
          </ul>
          <p v-else class="text-gray-600 my-5"><small>No files in this folder.</small></p>

          <!-- Show SubFolder -->
          <div
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
          </div>
        </div>

        <ModalBox
          :visible="showModal"
          :title="isEdit ? 'Edit Folder' : 'Add new Folder'"
          @close="showModal = false"
        >
          <FolderForm
            :folders="folders"
            :folderData="formFolderData"
            :isEdit="isEdit"
            @submit="handleFormSubmit"
          />
        </ModalBox>
      </div>
    </div>
  </div>
</template>

<script>
import FolderForm from './FolderForm.vue'
import FolderTree from './FolderTree.vue'
import ModalBox from './ModalBox.vue'

export default {
  name: 'FileExplorer',
  components: {
    FolderTree,
    ModalBox,
    FolderForm
  },
  data() {
    return {
      folders: [],
      selectedFolder: null,
      showModal: false,
      formFolderData: null,
      isEdit: false,
      parentFolder: null,
      isSubmitting: false
    }
  },
  mounted() {
    this.fetchFolders()
  },
  methods: {
    handleFolderSelect(folder) {
      this.selectedFolder = folder
      this.parentFolder = this.folders.find((parent) => parent.id === folder.parent_id) || null
    },
    openAddFolderModal() {
      this.formFolderData = null
      this.isEdit = false
      this.showModal = true
    },
    editFolder(folder) {
      this.formFolderData = folder
      this.isEdit = true
      this.showModal = true
    },
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
    async handleFormSubmit(form) {
      if (this.isSubmitting) return
      this.isSubmitting = true

      try {
        if (this.isEdit) {
          await this.$apiClient
            .put(`/folders/${this.formFolderData.id}`, {
              name: form.name,
              parent_id: form.parent_id
            })
            .then((response) => {
              console.log('Folder updated successfully:', response.data)

              const updatedFolder = response.data.data

              if (this.selectedFolder) {
                // Jika subfolder diperbarui
                if (Array.isArray(this.selectedFolder.subfolders)) {
                  const subfolderIndex = this.selectedFolder.subfolders.findIndex(
                    (subfolder) => subfolder.id === updatedFolder.id
                  )

                  if (subfolderIndex !== -1) {
                    this.$set(this.selectedFolder.subfolders, subfolderIndex, updatedFolder)
                  }
                }

                // Jika folder yang diperbarui adalah folder yang dipilih
                if (this.selectedFolder.id === updatedFolder.id) {
                  this.selectedFolder.name = updatedFolder.name

                  // Update juga parentFolder jika ada
                  if (this.parentFolder) {
                    const folderIndex = this.parentFolder.subfolders.findIndex(
                      (subfolder) => subfolder.id === updatedFolder.id
                    )
                    if (folderIndex !== -1) {
                      this.$set(this.parentFolder.subfolders, folderIndex, updatedFolder)
                    }
                  }
                }
              }

              this.showModal = false
              this.fetchFolders()
            })
            .catch((error) => {
              console.error('Error updating folder:', error)
            })
        } else {
          await this.$apiClient
            .post('/folders', {
              name: form.name,
              parent_id: form.parent_id
            })
            .then((response) => {
              console.log('Folder created successfully:', response.data)
              this.showModal = false
              this.fetchFolders()
            })
        }
        this.showModal = false
        this.fetchFolders()
      } catch (error) {
        console.error('Error in handleFormSubmit:', error)
      } finally {
        this.isSubmitting = false
      }
    },
    async deleteFolder(folder) {
      if (confirm(`Apakah anda ingin menghapus folder ${folder.name} ?`)) {
        try {
          await this.$apiClient
            .delete(`/folders/${folder.id}`)
            .then(() => {
              console.log(`Folder ${folder.name} deleted successfully`)

              if (this.selectedFolder && this.selectedFolder.id === folder.id) {
                this.selectedFolder = null
                this.parentFolder = null
              }

              this.folders = this.folders.filter((f) => f.id !== folder.id)

              if (this.selectedFolder && Array.isArray(this.selectedFolder.subfolders)) {
                this.selectedFolder.subfolders = this.selectedFolder.subfolders.filter(
                  (subfolder) => subfolder.id !== folder.id
                )
              }

              this.fetchFolders()
            })
            .catch((error) => {
              console.error(`Error deleting folder ${folder.name}:`, error)
            })
        } catch (error) {
          console.error('Error in deleteFolder:', error)
        }
      }
    }
  }
}
</script>
