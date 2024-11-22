
<script setup>
defineProps({
  totalPages: Number,
  currentPage: Number
})

defineEmits(['page-change'])
</script>

<template>
  <div class="flex justify-center mt-4 space-x-2">
    <button
      v-for="page in totalPages"
      :key="page"
      @click="$emit('page-change', page)"
      class="px-3 py-1 rounded"
      :class="currentPage === page 
        ? 'bg-indigo-600 text-white' 
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
    >
      {{ page }}
    </button>
  </div>
</template>