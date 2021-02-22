import Vue from 'vue'
import rules from '@/workers/rules'

declare module 'vue/types/vue' {
  interface Vue {
    $rules: typeof rules
  }
}
