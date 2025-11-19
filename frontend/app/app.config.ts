// import { defineAppConfig } from 'nuxt/app'

export default defineAppConfig({
    menu: [
        { label: 'Главная', to: '/' },
        { label: 'CRUD', to: '/crud' },
        { label: 'Relation', to: '/relation' },
    ],
})
