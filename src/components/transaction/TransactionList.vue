<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const BASE_URL = import.meta.env.VITE_BASE_URL
const router = useRouter()

const transactions = ref([])
const pagination = ref({
  count: 0,
  next: null,
  previous: null,
  currentPage: 1
})
const isLoading = ref(true)

// Filter states
const filterDate = ref({
  startDate: '',
  endDate: ''
})
const selectedMonth = ref('')

// Summary statistics
const summary = computed(() => {
  const totalIncome = transactions.value
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpense = transactions.value
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
    
  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense
  }
})

// Generate months for filter
const months = [
  { value: '', label: 'All Months' },
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
]

const buildFilterQuery = () => {
  const params = new URLSearchParams()
  
  if (filterDate.value.startDate) {
    params.append('start_date', filterDate.value.startDate)
  }
  if (filterDate.value.endDate) {
    params.append('end_date', filterDate.value.endDate)
  }
  if (selectedMonth.value) {
    params.append('month', selectedMonth.value)
  }
  
  return params.toString()
}

// Fetch transactions with filters
const fetchTransactions = async (url = `${BASE_URL}/transactions/`) => {
  try {
    isLoading.value = true
    const filterQuery = buildFilterQuery()
    const finalUrl = filterQuery ? `${url}${url.includes('?') ? '&' : '?'}${filterQuery}` : url
    
    const response = await fetch(finalUrl)
    
    if (!response.ok) {
      throw new Error('Failed to fetch transactions')
    }

    const data = await response.json()
    
    transactions.value = data.results
    pagination.value = {
      count: data.count,
      next: data.next,
      previous: data.previous,
      currentPage: finalUrl.includes('page=') ? parseInt(finalUrl.split('page=')[1]) : 1
    }
  } catch (error) {
    console.error('Error fetching transactions:', error)
    alert('Error loading transactions')
  } finally {
    isLoading.value = false
  }
}

const handleFilter = () => {
  fetchTransactions(`${BASE_URL}/transactions/`)
}

const resetFilters = () => {
  filterDate.value.startDate = ''
  filterDate.value.endDate = ''
  selectedMonth.value = ''
  fetchTransactions(`${BASE_URL}/transactions/`)
}

// Rest of the existing functions...
const handleDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this transaction?')) {
    return
  }

  try {
    const response = await fetch(`${BASE_URL}/transactions/${id}/`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Failed to delete transaction')
    }

    fetchTransactions(`${BASE_URL}/transactions/?page=${pagination.value.currentPage}`)
    alert('Transaction deleted successfully')
  } catch (error) {
    console.error('Error deleting transaction:', error)
    alert('Error deleting transaction')
  }
}

const handleEdit = (id) => {
  router.push(`/transactions/${id}/edit`)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT'
  }).format(amount)
}

onMounted(() => {
  fetchTransactions()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-semibold text-gray-800">Transactions</h2>
          <p class="mt-2 text-gray-600">Manage your income and expenses</p>
        </div>
        <button
          @click="router.push('/add-transaction')"
          class="bg-black text-white px-6 py-3 rounded-xl font-semibold
                 hover:bg-gray-800 transition-colors duration-200"
        >
          Add Transaction
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-md p-6">
          <h3 class="text-sm font-medium text-gray-500">Total Income</h3>
          <p class="mt-2 text-2xl font-semibold text-green-600">
            {{ formatAmount(summary.totalIncome) }}
          </p>
        </div>
        
        <div class="bg-white rounded-xl shadow-md p-6">
          <h3 class="text-sm font-medium text-gray-500">Total Expense</h3>
          <p class="mt-2 text-2xl font-semibold text-red-600">
            {{ formatAmount(summary.totalExpense) }}
          </p>
        </div>
        
        <div class="bg-white rounded-xl shadow-md p-6">
          <h3 class="text-sm font-medium text-gray-500">Balance</h3>
          <p class="mt-2 text-2xl font-semibold" :class="summary.balance >= 0 ? 'text-green-600' : 'text-red-600'">
            {{ formatAmount(summary.balance) }}
          </p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 class="text-lg font-medium text-gray-800 mb-4">Filters</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="form-group">
            <label class="form-label">Start Date</label>
            <input
              type="date"
              v-model="filterDate.startDate"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">End Date</label>
            <input
              type="date"
              v-model="filterDate.endDate"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Month</label>
            <select v-model="selectedMonth" class="form-select">
              <option v-for="month in months" :key="month.value" :value="month.value">
                {{ month.label }}
              </option>
            </select>
          </div>
          
          <div class="flex items-end gap-2">
            <button
              @click="handleFilter"
              class="flex-1 bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800"
            >
              Apply Filters
            </button>
            <button
              @click="resetFilters"
              class="flex-1 border border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <p class="text-gray-600">Loading transactions...</p>
      </div>

      <!-- Transactions Table -->
      <div v-else-if="transactions.length > 0" class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Existing table code... -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50">
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600">Type</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600">Amount</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-600">Notes</th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="transaction in transactions" :key="transaction.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm text-gray-800">
                  {{ formatDate(transaction.date) }}
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-medium',
                      transaction.transaction_type === 'income'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1) }}
                  </span>
                </td>
                <td 
                  class="px-6 py-4 text-sm"
                  :class="transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'"
                >
                  {{ formatAmount(transaction.amount) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-800">
                  {{ transaction.notes }}
                </td>
                <td class="px-6 py-4 text-right space-x-2">
                  <button
                    @click="handleEdit(transaction.id)"
                    class="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <!-- <button
                    @click="handleDelete(transaction.id)"
                    class="text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button> -->
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
          <p class="text-sm text-gray-600">
            Total {{ pagination.count }} transaction{{ pagination.count !== 1 ? 's' : '' }}
          </p>
          <div class="space-x-2">
            <button
              v-if="pagination.previous"
              @click="fetchTransactions(pagination.previous)"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              v-if="pagination.next"
              @click="fetchTransactions(pagination.next)"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 bg-white rounded-2xl shadow-xl">
        <p class="text-gray-600">No transactions found</p>
        <button
          @click="router.push('/transactions/new')"
          class="mt-4 text-blue-600 hover:text-blue-800 font-medium"
        >
          Add your first transaction
        </button>
      </div>
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
</style>
