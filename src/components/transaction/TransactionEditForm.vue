<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const BASE_URL = import.meta.env.VITE_BASE_URL
const router = useRouter()
const route = useRoute()

const isLoading = ref(true)
const isSubmitting = ref(false)

const transactionTypes = [
  { id: 'income', name: 'Income' },
  { id: 'expense', name: 'Expense' }
]

const formData = reactive({
  transaction_type: '',
  amount: '',
  date: '',
  notes: ''
})

// Fetch existing transaction data
const fetchTransaction = async () => {
  try {
    const response = await fetch(`${BASE_URL}/transactions/${route.params.id}/`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch transaction')
    }

    const data = await response.json()
    
    // Populate form with existing data
    formData.transaction_type = data.transaction_type
    formData.amount = data.amount
    formData.date = data.date
    formData.notes = data.notes
    
  } catch (error) {
    console.error('Error fetching transaction:', error)
    alert('Error loading transaction data')
    router.push('/transactions')
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  try {
    isSubmitting.value = true

    if (parseFloat(formData.amount) <= 0) {
      throw new Error('Amount must be greater than 0')
    }

    const payload = {
      transaction_type: formData.transaction_type,
      amount: parseFloat(formData.amount).toFixed(2),
      date: formData.date,
      notes: formData.notes
    }

    const response = await fetch(`${BASE_URL}/transactions/${route.params.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error('Failed to update transaction')
    }

    alert('Transaction updated successfully!')
    router.push('/transactions')
    
  } catch (error) {
    console.error('Error updating transaction:', error)
    alert(error.message)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchTransaction()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
    <div class="max-w-md mx-auto bg-white rounded-2xl shadow-xl">
      <!-- Form Header -->
      <div class="px-8 py-6 border-b border-gray-100">
        <h2 class="text-3xl font-semibold text-gray-800">Edit Transaction</h2>
        <p class="mt-2 text-gray-600">Update transaction details below</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="p-8 text-center">
        <p class="text-gray-600">Loading transaction data...</p>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="p-8 space-y-6">
        <!-- Transaction Type -->
        <div class="form-group">
          <label for="type" class="form-label">Transaction Type</label>
          <select
            id="type"
            v-model="formData.transaction_type"
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

        <!-- Notes -->
        <div class="form-group">
          <label for="notes" class="form-label">Notes</label>
          <textarea
            id="notes"
            v-model="formData.notes"
            class="form-textarea"
            rows="3"
            required
            placeholder="Enter transaction details..."
          ></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4">
          <button
            type="button"
            @click="router.push('/transactions')"
            class="flex-1 py-4 px-6 rounded-xl text-lg font-semibold
                   border-2 border-gray-200 text-gray-700
                   transition-all duration-200 ease-in-out
                   hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            :disabled="isSubmitting"
            :class="[
              'flex-1 py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-200 ease-in-out',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              formData.transaction_type === 'income' 
                ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white'
                : formData.transaction_type === 'expense'
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white'
                  : 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white'
            ]"
          >
            {{ isSubmitting ? 'Updating...' : 'Update Transaction' }}
          </button>
        </div>
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