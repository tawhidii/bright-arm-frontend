<script setup>
import PaymentTable from './payments/PayementTable.vue'
import axios from 'axios'
import { ref, onMounted } from 'vue'
import {useRouter} from 'vue-router'

const BASE_URL = import.meta.env.VITE_BASE_URL

const payments = ref([])
const loading = ref(false)
const totalItems = ref(0)
const currentPage = ref(1)
const itemsPerPage = 10

const router = useRouter()

// Fetch payments data
const fetchPayments = async (page = 1) => {
  loading.value = true
  try {
    const response = await axios.get(`${BASE_URL}/payments/?page=${page}`)
    payments.value = response.data.results.map(payment => ({
      ...payment,
      status: payment.due_amount > 0 ? 'Due' : 'Paid'
    }))
    totalItems.value = response.data.count
    currentPage.value = page
  } catch (error) {
    console.error('Error fetching payments:', error)
  } finally {
    loading.value = false
  }
}



// Handle pagination
const handlePageChange = (page) => {
  fetchPayments(page)
}

const handleEdit = (id) => {
  router.push(`/payments/${id}/edit`)
}

const handlePdfDownload = async (id) => {
  try {
    window.location.href = `${BASE_URL}/payments/${id}/pdf/`;
  } catch (error) {
    console.error('Error downloading PDF:', error);
  }
}

onMounted(() => {
  fetchPayments()
})
</script>

<template>
  <PaymentTable
    :payments="payments"
    :loading="loading"
    :total-items="totalItems"
    :current-page="currentPage"
    :items-per-page="itemsPerPage"
    @edit="handleEdit"
    @download="handlePdfDownload"
    @page-change="handlePageChange"
  />
</template>