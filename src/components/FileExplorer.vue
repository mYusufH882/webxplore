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
    <div class="flex-grow flex flex-col lg:flex-row">
      <!-- Sidebar Panel -->
      <div
        class="lg:w-1/4 md:w-1/4 w-full bg-gray-100 p-4 h-full overflow-y-auto lg:relative fixed lg:fixed"
      >
        <FolderTree
          :folders="folders"
          :selectedFolder="selectedFolder"
          @select-folder="handleFolderSelect"
          @delete-folder="deleteFolder"
          @edit-folder="editFolder"
        />
      </div>

      <!-- Panel FileList -->
      <div class="lg:w-3/4 md:w-3/4 w-full p-4 ml-auto lg:mt-0">
        <div v-if="selectedFolder">
          <h3 class="text-xl font-semibold text-gray-800 mb-2">
            <span v-for="(breadcrumb, index) in getBreadcrumbs()" :key="breadcrumb.id">
              <a
                v-if="index < getBreadcrumbs().length - 1"
                @click="handleFolderSelect(breadcrumb)"
                class="text-blue-600 cursor-pointer hover:underline"
              >
                {{ breadcrumb.name }}
              </a>
              <span v-else>{{ breadcrumb.name }}</span>
              <span v-if="index < getBreadcrumbs().length - 1"> > </span>
            </span>
            <button 
              @click="openAddFolderModal('add', selectedFolder)"
              class="ml-2 bg-blue-500 text-white px-1 py-0.5 text-sm rounded shadow hover:bg-blue-600">
              Add
            </button>
            <button
              @click="editFolder(selectedFolder)"
              class="ml-2 bg-yellow-500 text-white px-1 py-0.5 text-sm rounded shadow hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              @click="deleteFolder(selectedFolder)"
              class="ml-2 bg-red-500 text-white px-1 py-0.5 text-sm rounded shadow hover:bg-red-600"
            >
              Delete
            </button>
          </h3>
          <p v-if="selectedFolder && selectedFolder.subfolders && selectedFolder.subfolders.length">
            <ul class="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4 gap-4 my-5">
              <li v-for="subfolder in selectedFolder.subfolders" :key="subfolder.id" class="bg-white text-center p-4 rounded-lg shadow-md border border-gray-200">
                <div>
                  <a 
                    @click="handleFolderSelect(subfolder)" 
                    class="font-medium text-blue-600 cursor-pointer"
                  >
                    <font-awesome-icon :icon="['fas', 'folder']" />
                    {{ subfolder.name }}
                  </a>
                </div>
              </li>
            </ul>
          </p>
          <p
            v-else-if="
              !selectedFolder.files || !selectedFolder.subfolders || !selectedFolder.folders
            "
            class="text-gray-600 my-5"
          >
            <small>No subfolder in this folder.</small>
          </p>
        </div>

        <FileList
          :selectedFolder="selectedFolder"
          :parentFolder="parentFolder"
          @select-folder="handleFolderSelect"
          @edit-folder="editFolder"
          @delete-folder="deleteFolder"
          @open-add-folder="openAddFolderModal"
        />
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
</template>

<script>
import FileList from './FileList.vue'
import FolderForm from './FolderForm.vue'
import FolderTree from './FolderTree.vue'
import ModalBox from './ModalBox.vue'

export default {
  name: 'FileExplorer',
  components: {
    FolderTree,
    FileList,
    ModalBox,
    FolderForm
  },
  data() {
    return {
      folders: [],
      deleteFolderAction: null,
      selectedFolder: null,
      showModal: false,
      formFolderData: null,
      isEdit: false,
      parentFolder: null,
      isSubmitting: false
    }
  },
  mounted() {
    this.setupDeleteFolderAction()
    this.fetchFolders()
  },
  methods: {
    findFolderById(id, folders) {
      for (const folder of folders) {
        if (folder.id === id) {
          return folder;
        }
        if (folder.subfolders) {
          const found = this.findFolderById(id, folder.subfolders);
          if (found) return found;
        }
      }
      return null;
    },
    getBreadcrumbs() {
      const breadcrumbs = [];
      let currentFolder = this.selectedFolder;
      
      while (currentFolder) {
        breadcrumbs.unshift(currentFolder);
        currentFolder = this.findFolderById(currentFolder.parent_id, this.folders);
      }
      
      return breadcrumbs;
    },
    handleFolderSelect(folder) {
      this.selectedFolder = folder
      this.parentFolder = this.findFolderById(folder.parent_id, this.folders);
    },
    openAddFolderModal(mode, folder) {
      if(mode == "add") {
        this.formFolderData = {
          parent_id: folder ? folder.id : null,
        };        
      } else {
        this.formFolderData = null
      }

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
        // const response = await this.$apiClient.get('/folders');
        // this.folders = response.data.data;
        // console.log(response.data.data);
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
                    this.selectedFolder.subfolders.splice(subfolderIndex, 1, updatedFolder);
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
                      this.parentFolder.subfolders.splice(folderIndex, 1, updatedFolder);
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
          const response = await this.$apiClient
            .post('/folders', {
              name: form.name,
              parent_id: form.parent_id
            })

          const newFolder = response.data.data

          if (this.selectedFolder) {
            // If there is a selected folder, add new folder to its subfolders
            if (!this.selectedFolder.subfolders) {
              this.selectedFolder.subfolders = [];
            }
            this.selectedFolder.subfolders.push(newFolder);
          } else if (this.parentFolder) {
            // If there is a parent folder, add new folder to its subfolders
            if (!this.parentFolder.subfolders) {
              this.parentFolder.subfolders = [];
            }
            this.parentFolder.subfolders.push(newFolder);
          } else {
            // If no selected folder or parent folder, add to top-level folders
            if (!this.folders) {
              this.folders = [];
            }
            this.folders.push(newFolder);
          }
          
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
      event.preventDefault()

      if (confirm(`Apakah anda ingin menghapus folder ${folder.name} ?`)) {
        try {
          await this.$apiClient.delete(`/folders/${folder.id}`);

          console.log(`Folder ${folder.name} deleted successfully`);

          // Hapus folder dari daftar folder utama
          this.folders = this.folders.filter((f) => f.id !== folder.id);

          // Jika folder yang dipilih adalah folder yang dihapus
          if (this.selectedFolder && this.selectedFolder.id === folder.id) {
            this.selectedFolder = null;
            this.parentFolder = null;
          }

          // Perbarui subfolders dari selectedFolder jika ada
          if (this.selectedFolder && Array.isArray(this.selectedFolder.subfolders)) {
            this.selectedFolder.subfolders = this.selectedFolder.subfolders.filter(
              (subfolder) => subfolder.id !== folder.id
            );
          }

          // Perbarui subfolders dari parentFolder jika ada
          if (this.parentFolder && Array.isArray(this.parentFolder.subfolders)) {
            this.parentFolder.subfolders = this.parentFolder.subfolders.filter(
              (subfolder) => subfolder.id !== folder.id
            );
          }

          this.fetchFolders()

        } catch (error) {
          console.error(`Error deleting folder ${folder.name}:`, error);
        }
      }
    },
    setupDeleteFolderAction() {
      this.deleteFolderAction = this.deleteFolder.bind(this)
    },
  }
}
</script>
