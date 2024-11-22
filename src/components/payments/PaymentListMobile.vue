<script setup>
import { formatDate } from '@/utils/date'

defineProps({
  payments: {
    type: Array,
    required: true
  }
})

defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="md:hidden space-y-4">
    <div
      v-for="payment in payments"
      :key="payment.id"
      class="bg-white p-4 rounded-lg shadow space-y-2"
    >
      <div class="flex justify-between items-start">
        <div>
          <h3 class="font-medium">{{ payment.client_name }}</h3>
          <p class="text-sm text-gray-500"> Payment Method : {{ payment.payment_type_name }}</p>
          <p class="text-sm text-gray-500">Service : {{ payment.service_name }}</p>
          <p class="text-sm text-gray-500">Amount: BDT{{ payment.total_amount }}</p>
          <p class="text-sm text-gray-500">Due: BDT{{ payment.due_amount }}</p>
          <div class="mt-2 flex items-center space-x-2">
            <span  
              class="px-2 py-1 rounded-full text-xs font-medium"
              :class="payment.status === 'Paid' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'"
            >
              {{ payment.status }}
            </span>
            <span class="text-sm text-gray-500">
              Admission Date : {{ formatDate(payment.admission_date) }}
            </span>
          </div>
        </div>
        <div class="flex space-x-3">
          <button
            @click="$emit('edit', payment.id)"
            class="text-indigo-600 hover:text-indigo-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            @click="$emit('delete', payment.id)"
            class="text-red-600 hover:text-red-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>