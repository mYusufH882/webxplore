<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-4">
      <label for="folderName" class="block text-gray-700 mb-2">Folder Name:</label>
      <input
        id="folderName"
        v-model="form.name"
        type="text"
        class="border border-gray-300 p-2 rounded-lg w-full"
        required
      />
    </div>
    <div class="mb-4">
      <label for="parentFolder" class="block text-gray-700">Folder</label>
      <select
        v-model="form.parent_id"
        id="parentFolder"
        class="border border-gray-300 p-2 rounded-lg w-full"
      >
        <option :value="null">Pilih</option>
        <option v-for="folder in flattenedFolders" :key="folder.id" :value="folder.id">
          {{ folder.name }}
        </option>
      </select>
    </div>
    <div class="flex justify-end">
      <button
        type="submit"
        class="px-4 py-2 text-white rounded-lg shadow-md"
        :class="isEdit ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'"
      >
        {{ isEdit ? 'Update Folder' : 'Add Folder' }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  props: {
    folders: Array,
    folderData: Object,
    isEdit: Boolean
  },
  data() {
    return {
      form: {
        name: '',
        parent_id: null
      }
    }
  },
  computed: {
    flattenedFolders() {
      const flatten = (folders, parentName = '') => {
        return folders.reduce((acc, folder) => {
          const fullName = parentName ? `${parentName} / ${folder.name}` : folder.name;
          acc.push({ ...folder, name: fullName });
          if (folder.subfolders && folder.subfolders.length) {
            acc.push(...flatten(folder.subfolders, fullName));
          }
          return acc;
        }, []);
      };
      return flatten(this.folders);
    }
  },
  watch: {
    folderData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form.name = newVal.name || ''
          this.form.parent_id = newVal.parent_id || null
        }
      }
    }
  },
  methods: {
    handleSubmit() {
      const folderData = {...this.form};

      this.$emit('submit', folderData)
    
      this.form.name = ''
      this.form.parent_id = null
    }
  }
}
</script>
