<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const BASE_URL = import.meta.env.VITE_BASE_URL
const router = useRouter()
const isSubmitting = ref(false)

const transactionTypes = [
  { id: 'income', name: 'Income' },
  { id: 'expense', name: 'Expense' }
]

const formData = reactive({
  type: '',
  amount: '',
  note: '',
  date: new Date().toISOString().split('T')[0] // Set today as default date
})

const handleSubmit = async () => {
  try {
    isSubmitting.value = true

    // Validate amount is positive
    if (parseFloat(formData.amount) <= 0) {
      throw new Error('Amount must be greater than 0')
    }

    const payload = {
      transaction_type: formData.type,
      amount: parseFloat(formData.amount).toFixed(2),
      notes: formData.note,
      date: formData.date
    }
    
    const response = await fetch(`${BASE_URL}/transactions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error('Failed to save transaction')
    }

    alert('Transaction recorded successfully!')
    router.push('/transactions')

  } catch (error) {
    console.error('Error submitting transaction:', error)
    alert(error.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
    <div class="max-w-md mx-auto bg-white rounded-2xl shadow-xl">
      <!-- Form Header -->
      <div class="px-8 py-6 border-b border-gray-100">
        <h2 class="text-3xl font-semibold text-gray-800">Record Transaction</h2>
        <p class="mt-2 text-gray-600">Enter transaction details below</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-8 space-y-6">
        <!-- Transaction Type -->
        <div class="form-group">
          <label for="type" class="form-label">Transaction Type</label>
          <select
            id="type"
            v-model="formData.type"
            class="form-select"
            required
          >
            <option value="">Select type</option>
            <option 
              v-for="type in transactionTypes" 
              :key="type.id" 
              :value="type.id"
              :class="type.id === 'income' ? 'text-green-600' : 'text-red-600'"
            >
              {{ type.name }}
            </option>
          </select>
        </div>

        <!-- Amount -->
        <div class="form-group">
          <label for="amount" class="form-label">Amount</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
            <input
              type="number"
              id="amount"
              v-model="formData.amount"
              class="form-input !pl-8"
              step="0.01"
              min="0.01"
              required
              placeholder="0.00"
            />
          </div>
        </div>
        <!-- Date and Note Fields -->
        <div class="space-y-6">
        <!-- Date Field -->
        <div class="form-group">
            <label for="date" class="form-label">Date</label>
            <input
            type="date"
            id="date"
            v-model="formData.date"
            class="form-input"
            :max="new Date().toISOString().split('T')[0]"
            required
            />
        </div>

        <!-- Note -->
        <div class="form-group">
            <label for="note" class="form-label">Note</label>
            <textarea
            id="note"
            v-model="formData.note"
            class="form-textarea"
            rows="3"
            required
            placeholder="Enter transaction details..."
            ></textarea>
        </div>
        </div>
        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isSubmitting"
          :class="[
            'w-full py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-200 ease-in-out',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            formData.type === 'income' 
              ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white'
              : formData.type === 'expense'
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white'
                : 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white'
          ]"
        >
          {{ isSubmitting ? 'Recording...' : 'Record Transaction' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-select {
  @apply w-full px-4 py-3 rounded-xl border-2 border-gray-200
         transition-all duration-200 ease-in-out
         focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 focus:outline-none
         hover:border-gray-300
         bg-white;
}

.form-input {
  @apply w-full px-4 py-3 rounded-xl border-2 border-gray-200
         transition-all duration-200 ease-in-out
         focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 focus:outline-none
         hover:border-gray-300;
}

.form-textarea {
  @apply w-full px-4 py-3 rounded-xl border-2 border-gray-200
         transition-all duration-200 ease-in-out
         focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 focus:outline-none
         hover:border-gray-300
         resize-none;
}
</style>