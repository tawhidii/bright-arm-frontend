<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import {useRouter} from 'vue-router'

const BASE_URL = import.meta.env.VITE_BASE_URL;

const services = ref([])
const paymentMethods = ref([])



// Fetch services and payment methods on component mount
onMounted(async() => {
  try{
    const [servicesRes,paymentMethodRes ] = await Promise.all([fetch(`${BASE_URL}/services/`),fetch(`${BASE_URL}/payment-methods/`)])
    if(servicesRes.ok && paymentMethodRes.ok){
      services.value =await servicesRes.json()
      paymentMethods.value = await paymentMethodRes.json()
    }
  }catch(error){
    console.log("Error fetching data",error)
  }
})

// Form state
const formData = reactive({
  name: '',
  service: '',
  paymentType: '',
  totalAmount: '',
  amount: '',
  dueAmount: '',
  paymentInWords: '',
  date: new Date().toISOString().split('T')[0], // Sets today's date as default
  reference: '',
  phoneNumber: '',
  examDate : '',
  examTime: ''
})

// Loading state
const isSubmitting = ref(false)

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

// Amount handling methods
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

// Watch for changes in total amount
watch(() => formData.totalAmount, (newValue) => {
  if (parseFloat(formData.amount) > parseFloat(newValue)) {
    formData.amount = newValue
  }
  calculateDueAmount()
})

const router = useRouter()

// Form submission handler
const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    
    // Validate amounts
    if (parseFloat(formData.amount) > parseFloat(formData.totalAmount)) {
      throw new Error('Paid amount cannot exceed total amount')
    }

    // Prepare payload for API call
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
      exam_time: formData.examTime ? examTime : null
    }
    console.log(payload)
  
    // Make API call
    const response = await fetch(`${BASE_URL}/payments/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Log the response or handle it as needed
    const responseData = await response.json();
    console.log('Form submitted successfully:', responseData);

    // Success alert
    alert('Payment submitted successfully!');

    // Redirect to a different page (e.g., '/success')
    router.push("/payments")

    // Optional: Reset form after successful submission
    // Object.keys(formData).forEach(key => formData[key] = '')
    // formData.date = new Date().toISOString().split('T')[0]
    
  } catch (error) {
    console.error('Error submitting form:', error)
    // Handle error (you might want to show an error message to the user)
  } finally {
    isSubmitting.value = false
  }
}
</script>


<template>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
      <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl">
        <!-- Form Header -->
        <div class="px-8 py-6 border-b border-gray-100">
          <h2 class="text-3xl font-semibold text-gray-800">Payment Form</h2>
          <p class="mt-2 text-gray-600">Enter payment details below</p>
        </div>
        
        <form @submit.prevent="handleSubmit" class="p-8">
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
              <!-- Total Amount Field -->
              <div class="form-group">
                <label for="totalAmount" class="form-label">Total Amount</label>
                <div class="relative">
                  <input
                    type="number"
                    id="totalAmount"
                    v-model="formData.totalAmount"
                    @input="handleAmountChange"
                    class="form-input !pl-8"
                    required
                  />
                </div>
              </div>
  
              <!-- Paid Amount Field -->
              <div class="form-group">
                <label for="amount" class="form-label">Paid Amount</label>
                <div class="relative">
                  <input
                    type="number"
                    id="amount"
                    v-model="formData.amount"
                    @input="handlePaidAmountChange"
                    class="form-input !pl-8"
                    required
                  />
                </div>
              </div>
            </div>
  
            <!-- Due Amount Field -->
            <div class="form-group">
              <label for="dueAmount" class="form-label">Due Amount</label>
              <div class="relative">
                <input
                  type="number"
                  id="dueAmount"
                  v-model="formData.dueAmount"
                  class="form-input !pl-8 bg-gray-50"
                  readonly
                />
              </div>
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

             <!--Exam date Date Field -->
             <div class="form-group">
              <label for="date" class="form-label">Exam Date</label>
              <input
                type="date"
                id="examDate"
                v-model="formData.examDate"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label for="examTime" class="form-label">Exam Time</label>
              <input
                type="time"
                id="examTime"
                v-model="formData.examTime"
                class="form-input"
          
              />
            </div>
  
            <!-- Client Phone Number Field -->
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
                Complete Payment
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>


<style>
/* Base styles for form elements */
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