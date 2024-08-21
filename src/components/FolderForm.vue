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
        <option v-for="folder in folders" :key="folder.id" :value="folder.id">
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
      this.$emit('submit', { ...this.form })
    }
  }
}
</script>
