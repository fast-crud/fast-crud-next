import { createRouter, createWebHistory } from 'vue-router'
import { adminRouteRecords } from './config'

export const router = createRouter({ history: createWebHistory(), routes: adminRouteRecords })
