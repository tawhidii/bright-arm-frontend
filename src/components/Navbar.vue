<script setup>
import logo from '@/assets/img/logo.png'
</script>

<template>
  <nav class="bg-green-700 border-b border-green-500">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <div class="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
          <!-- Logo -->
          <router-link to="/" class="flex flex-shrink-0 items-center mr-4">
            <img class="h-10 w-auto" :src="logo" alt="Vue Jobs" />
            <span class="hidden md:block text-white text-2xl font-bold ml-2"></span>
          </router-link>
          
          <div class="md:ml-auto">
            <div class="flex space-x-2">
              <router-link
                to="/"
                class="text-white hover:bg-green-900 hover:text-white rounded-md px-3 py-2"
                :class="{ 'bg-green-900': $route.path === '/' }"
              >
                Home
              </router-link>

              <router-link
                to="/payments"
                class="text-white hover:bg-green-900 hover:text-white rounded-md px-3 py-2"
                :class="{ 'bg-green-900': $route.path === '/payments' }"
              >
                Payments
              </router-link>

              <router-link
                to="/add-payment"
                class="text-white hover:bg-green-900 hover:text-white rounded-md px-3 py-2"
                :class="{ 'bg-green-900': $route.path === '/add-payment' }"
              >
                Add Payments
              </router-link>
              <router-link
                to="/transactions"
                class="text-white hover:bg-green-900 hover:text-white rounded-md px-3 py-2"
                :class="{ 'bg-green-900': $route.path === '/add-payment' }"
              >
                Income/Expense
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

