<script setup>
import { formatDate,formatTime } from '@/utils/date'

defineProps({
  payments: {
    type: Array,
    required: true
  }
})

defineEmits(['edit', 'download'])
</script>

<template>
  <div class="hidden md:block overflow-x-auto">
    <table class="min-w-full bg-white">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Client Name</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Payment Type</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Service Name</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Total Amount</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Recieved Amount</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Due</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Admission Date</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Reference</th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Exam date </th>
          <th class="px-6 py-3 text-left text-sm font-medium text-gray-500">Exam Time</th>
          <th class="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="payment in payments" :key="payment.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 text-sm text-gray-900">{{ payment.client_name }}</td>
          <td class="px-6 py-4 text-sm text-gray-900">{{ payment.payment_type_name }}</td>
          <td class="px-6 py-4 text-sm text-gray-900">{{ payment.service_name }}</td>
          <td class="px-6 py-4 text-sm text-gray-900">BDT {{ payment.total_amount }}</td>
          <td class="px-6 py-4 text-sm text-gray-900">BDT {{ payment.given_amount }}</td>
          <td class="px-6 py-4 text-sm text-gray-900">BDT {{ payment.due_amount }}</td>

          <td class="px-6 py-4 text-sm">
            <span 
              class="px-2 py-1 rounded-full text-xs font-medium"
              :class="payment.status === 'Paid' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'"
            >
              {{ payment.status }}
            </span>
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">
            {{ formatDate(payment.admission_date) }}
          </td>
          <td class="px-6 py-4 text-sm text-gray-900">{{ payment.reference }}</td>
          <td class="px-6 py-4 text-sm text-gray-900">{{ formatDate(payment.exam_date) }}</td>
          <td class="px-6 py-4 text-sm text-gray-900">
              {{  formatTime(payment.exam_time)}}
          </td>
          <td class="px-6 py-4 text-right text-sm font-medium">
            <button
              @click="$emit('edit', payment.id)"
              class="text-indigo-600 hover:text-indigo-900 mr-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
            @click="$emit('download', payment.id)"
            class="text-blue-600 hover:text-blue-900"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-5 w-5 inline" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>