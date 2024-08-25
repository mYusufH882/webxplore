<template>
  <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-4 rounded-lg shadow-lg w-11/12 sm:w-1/3">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">{{ title }}</h3>
        <button @click="close" class="text-gray-600 hover:text-gray-900">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalBox',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>
