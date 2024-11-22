// Option API


<script>

export default {
  data(){
    return {
      message: "Hello from GG",
      status: 'active',
      orders: ['AA','BB','CC','DD','EE'],
      url:"https://www.facebook.com"
    }
  },
  methods:{
    updateStatus(){
      if (this.status === "active"){
        this.status = "pending"
      }
    }
  }
}

</script>



<template>
  <h1>{{ message }}</h1>
  <br>
  <p v-if="status === 'active'">Order is active</p>
  <p v-else-if="status === 'pending'">Order is pending</p>
  <p v-else>Order is Inactive</p>
  <br>
  <button @click="updateStatus">Update Order Status </button>
  <br>


  <h1>Orders</h1>
  <br>
  <ul>
    <li v-for="order in orders" :key="order">{{ order }}</li>
  </ul>
  <br>
  <a v-bind:href="url"> Open facebook</a>
</template>



<style scoped>
h1{
  color: yellow;
}

</style>



// Composition API


<script setup>
import { ref,onMounted } from 'vue';

    const message = ref("Hello from Comp")
    const status = ref('active')
    const orders = ref(['AA','BB','CC','DD','EE'])
    const newOrder = ref("")
    console.log(newOrder)

    const updateStatus = ()=>{
      if (status.value === "active"){
        status.value = "pending"
      }
    }
    const addOrder = () => {
      if(newOrder.value.trim() !== ''){
        orders.value.push(newOrder.value)
        newOrder.value = ''
      }
    }
    const cancelOrder = ()=> {
      console.log("Clicked")
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos')
        if (!response.ok) throw new Error('Failed to fetch users')
        const data = await response.json()
        orders.value = data.map((task)=> task.title)
      } catch (e) {
        console.log(e)
  }
}
    onMounted(()=>{
      fetchUsers()
    })
</script>



<template>
  <h1>{{ message }}</h1>
  <br>
  <p v-if="status === 'active'">Order is active</p>
  <p v-else-if="status === 'pending'">Order is pending</p>
  <p v-else>Order is Inactive</p>
  <br>
  <button @click="updateStatus">Update Order Status </button>
  <br>


  <h1>Orders</h1>
  <br>
  <ul>
    
      <li v-for="order in orders" :key="order"><span>{{ order }} <button @click="cancelOrder">cancel</button></span></li>
    
  </ul>
  <br>
  <br>
  <form @submit.prevent="addOrder">
    <label for="newTask"> Add Order </label> 
    <br>
    <input type="text" id="newOrder" name="newOrder" v-model="newOrder"/>
    <button type="submit">Add Order</button>
  </form>
</template>



<style scoped>
h1{
  color: yellow;
}

</style>