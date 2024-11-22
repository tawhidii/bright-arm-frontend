import { createRouter, createWebHistory } from 'vue-router'
import PaymentList from '@/components/PaymentList.vue'
import PaymentForm from '@/components/PaymentForm.vue'
import PaymentEditForm from '@/components/PaymentEditForm.vue'
import TransactionAdd from '@/components/transaction/TransactionAdd.vue'
import TransactionList from '@/components/transaction/TransactionList.vue'
import TransactionEditForm from '@/components/transaction/TransactionEditForm.vue'




const routes = [
    {
        path: '/payments',
        name: 'PaymentList',
        component: PaymentList
    },
    {
        path: '/add-payment',
        name: 'AddPayment',
        component: PaymentForm
    },
    {
        path: '/payments/:id/edit',
        name: 'EditPayment',
        component: PaymentEditForm
    },
    {
        path: '/transactions/',
        name: 'Transactions',
        component: TransactionList
    },
    {
        path:"/add-transaction",
        name: "Transactions Add",
        component: TransactionAdd
    },
    {
        path: '/transactions/:id/edit',
        name: 'EditTransaction',
        component: TransactionEditForm
      }
    

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router