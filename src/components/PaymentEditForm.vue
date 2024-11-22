<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const BASE_URL = import.meta.env.VITE_BASE_URL;
const router = useRouter()
const route = useRoute()

const services = ref([])
const paymentMethods = ref([])
const isLoading = ref(true)
// Form state
const formData = reactive({
  name: '',
  service: '',
  paymentType: '',
  totalAmount: '',
  amount: '',
  dueAmount: '',
  paymentInWords: '',
  date: '',
  reference: '',
  phoneNumber: '',
  examDate: '',
  examTime: ''
})

// Fetch existing payment and required data
onMounted(async () => {
  try {
    const [servicesRes, paymentMethodRes, paymentRes] = await Promise.all([
      fetch(`${BASE_URL}/services/`),
      fetch(`${BASE_URL}/payment-methods/`),
      fetch(`${BASE_URL}/payments/${route.params.id}/`)
    ])

    if (servicesRes.ok && paymentMethodRes.ok && paymentRes.ok) {
      services.value = await servicesRes.json()
      paymentMethods.value = await paymentMethodRes.json()
      const payment = await paymentRes.json()
      
      // Populate form with existing data
      formData.name = payment.client_name
      formData.service = payment.service
      formData.paymentType = payment.payment_type
      formData.totalAmount = payment.total_amount
      formData.amount = payment.given_amount
      formData.dueAmount = payment.due_amount
      formData.paymentInWords = payment.payment_in_words
      formData.date = payment.admission_date
      formData.reference = payment.reference
      formData.phoneNumber = payment.phone_number
      formData.examDate = payment.exam_date
      formData.examTime = payment.exam_time
    }
  } catch (error) {
    console.error("Error fetching data", error)
    alert('Error loading payment data')
  } finally {
    isLoading.value = false
  }
})

// Utility functions for number to words conversion
const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']

const convertLessThanThousand = (num) => {
  if (num === 0) return ''
  
  let result = ''
  
  if (num >= 100) {
    result += ones[Math.floor(num / 100)] + ' Hundred '
    num %= 100
  }
  
  if (num >= 20) {
    result += tens[Math.floor(num / 10)] + ' '
    num %= 10
  } else if (num >= 10) {
    result += teens[num - 10] + ' '
    return result
  }
  
  if (num > 0) {
    result += ones[num] + ' '
  }
  
  return result
}

const calculateDueAmount = () => {
  const total = parseFloat(formData.totalAmount) || 0
  const paid = parseFloat(formData.amount) || 0
  formData.dueAmount = Math.max(0, total - paid).toFixed(2)
}

const handleAmountChange = () => {
  if (formData.totalAmount < 0) {
    formData.totalAmount = 0
  }
  calculateDueAmount()
  convertToWords()
}

const handlePaidAmountChange = () => {
  const total = parseFloat(formData.totalAmount) || 0
  const paid = parseFloat(formData.amount) || 0
  
  if (paid < 0) {
    formData.amount = 0
  } else if (paid > total) {
    formData.amount = formData.totalAmount
  }
  
  calculateDueAmount()
  convertToWords()
}

const convertToWords = () => {
  const amount = parseInt(formData.amount)
  if (!amount) {
    formData.paymentInWords = ''
    return
  }

  let result = ''
  
  if (amount >= 1000000) {
    result += convertLessThanThousand(Math.floor(amount / 1000000)) + 'Million '
    result += convertLessThanThousand(Math.floor((amount % 1000000) / 1000)) + 'Thousand '
    result += convertLessThanThousand(amount % 1000)
  } else if (amount >= 1000) {
    result += convertLessThanThousand(Math.floor(amount / 1000)) + 'Thousand '
    result += convertLessThanThousand(amount % 1000)
  } else {
    result = convertLessThanThousand(amount)
  }

  formData.paymentInWords = result.trim() + ' Only'
}

watch(() => formData.totalAmount, (newValue) => {
  if (parseFloat(formData.amount) > parseFloat(newValue)) {
    formData.amount = newValue
  }
  calculateDueAmount()
})

const handleSubmit = async () => {
  try {
    if (parseFloat(formData.amount) > parseFloat(formData.totalAmount)) {
      throw new Error('Paid amount cannot exceed total amount')
    }

    const payload = {
      client_name: formData.name,
      service: formData.service,
      payment_type: formData.paymentType,
      total_amount: parseFloat(formData.totalAmount).toFixed(2),
      given_amount: parseFloat(formData.amount).toFixed(2),
      due_amount: parseFloat(formData.dueAmount).toFixed(2),
      payment_in_words: formData.paymentInWords,
      admission_date: formData.date,
      phone_number: formData.phoneNumber,
      reference: formData.reference,
      exam_date: formData.examDate,
      exam_time: formData.examTime
    }

    const response = await fetch(`${BASE_URL}/payments/${route.params.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    alert('Payment updated successfully!');
    router.push("/payments")
    
  } catch (error) {
    console.error('Error updating payment:', error)
    alert('Error updating payment')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
    <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl">
      <div class="px-8 py-6 border-b border-gray-100">
        <h2 class="text-3xl font-semibold text-gray-800">Edit Payment</h2>
        <p class="mt-2 text-gray-600">Update payment details below</p>
      </div>
      
      <div v-if="isLoading" class="p-8 text-center">
        <p class="text-gray-600">Loading payment data...</p>
      </div>
      
      <form v-else @submit.prevent="handleSubmit" class="p-8">
        <div class="space-y-6">
          <!-- Name Field -->
          <div class="form-group">
            <label for="name" class="form-label">Client Name</label>
            <input
              type="text"
              id="name"
              v-model="formData.name"
              class="form-input"
              required
            />
          </div>

          <!-- Service Dropdown -->
          <div class="form-group">
            <label for="service" class="form-label">Service Name</label>
            <select
              id="service"
              v-model="formData.service"
              class="form-select"
              required
            >
              <option value="">Select service</option>
              <option v-for="service in services" :key="service.id" :value="service.id">
                {{ service.name }}
              </option>
            </select>
          </div>

          <!-- Payment Type Dropdown -->
          <div class="form-group">
            <label for="paymentType" class="form-label">Payment Method</label>
            <select
              id="paymentType"
              v-model="formData.paymentType"
              class="form-select"
              required
            >
              <option value="">Select payment method</option>
              <option v-for="method in paymentMethods" :key="method.id" :value="method.id">
                {{ method.name }}
              </option>
            </select>
          </div>

          <!-- Amount Fields Group -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-group">
              <label for="totalAmount" class="form-label">Total Amount</label>
              <input
                type="number"
                id="totalAmount"
                v-model="formData.totalAmount"
                @input="handleAmountChange"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label for="amount" class="form-label">Paid Amount</label>
              <input
                type="number"
                id="amount"
                v-model="formData.amount"
                @input="handlePaidAmountChange"
                class="form-input"
                required
              />
            </div>
          </div>

          <!-- Due Amount Field -->
          <div class="form-group">
            <label for="dueAmount" class="form-label">Due Amount</label>
            <input
              type="number"
              id="dueAmount"
              v-model="formData.dueAmount"
              class="form-input bg-gray-50"
              readonly
            />
          </div>

          <!-- Payment In Words -->
          <div class="form-group">
            <label for="paymentInWords" class="form-label">Payment In Words</label>
            <input
              type="text"
              id="paymentInWords"
              v-model="formData.paymentInWords"
              class="form-input bg-gray-50"
              readonly
            />
          </div>

          <!-- Date Field -->
          <div class="form-group">
            <label for="date" class="form-label">Admission Date</label>
            <input
              type="date"
              id="date"
              v-model="formData.date"
              class="form-input"
              required
            />
          </div>

          <!-- Reference Field -->
          <div class="form-group">
            <label for="reference" class="form-label">Reference</label>
            <input
              type="text"
              id="reference"
              v-model="formData.reference"
              class="form-input"
              required
            />
          </div>

          <!-- Exam Date Field -->
          <div class="form-group">
            <label for="examDate" class="form-label">Exam Date</label>
            <input
              type="date"
              id="examDate"
              v-model="formData.examDate"
              class="form-input"
              required
            />
          </div>

          <!-- Exam Time Field -->
          <div class="form-group">
            <label for="examTime" class="form-label">Exam Time</label>
            <input
              type="time"
              id="examTime"
              v-model="formData.examTime"
              class="form-input"
            />
          </div>

          <!-- Phone Number Field -->
          <div class="form-group">
            <label for="phoneNumber" class="form-label">Client Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              v-model="formData.phoneNumber"
              class="form-input"
              required
              pattern="^\d{11}$"
              placeholder="01XXXXXXXXX"
            />
          </div>

          <!-- Submit Button -->
          <div class="mt-8">
            <button
              type="submit"
              class="w-full bg-black text-white py-4 px-6 rounded-xl text-lg font-semibold
                     transition-all duration-200 ease-in-out
                     hover:bg-gray-800 hover:shadow-lg
                     focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              Update Payment
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full px-4 py-3 rounded-xl border-2 border-gray-200
         transition-all duration-200 ease-in-out
         focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 focus:outline-none
         hover:border-gray-300;
}

.form-select {
  @apply w-full px-4 py-3 rounded-xl border-2 border-gray-200
         transition-all duration-200 ease-in-out
         focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 focus:outline-none
         hover:border-gray-300
         bg-white;
}
</style>
