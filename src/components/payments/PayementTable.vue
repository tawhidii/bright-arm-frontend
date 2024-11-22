<script setup>
import { computed } from 'vue'
import PaymentListDesktop from './PaymentListDesktop.vue';
import PaymentListMobile from './PaymentListMobile.vue';
import Pagination from './Pagination.vue';


const props = defineProps({
  payments: {
    type: Array,
    required: true
  },
  loading: Boolean,
  totalItems: Number,
  currentPage: Number,
  itemsPerPage: Number
})

const emit = defineEmits(['edit', 'download', 'page-change'])

const totalPages = computed(() => 
  Math.ceil(props.totalItems / props.itemsPerPage)
)
</script>

<template>
  <div class="w-full">
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>

    <div v-else>
      <PaymentListDesktop
        :payments="payments"
        @edit="id => emit('edit', id)"
        @download="id => emit('download', id)"
      />
      <PaymentListMobile 
        :payments="payments"
        @edit="id => emit('edit', id)"
        @download="id => emit('download', id)"
      />
      <Pagination
        :total-pages="totalPages"
        :current-page="currentPage"
        @page-change="page => emit('page-change', page)"
      />
    </div>
  </div>
</template>