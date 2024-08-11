import path from 'path'

export const routes = [
  {
    name: 'basescript',
    path: '/basescript/:collectionId/script/:scriptId',
    component: path.resolve(__dirname, 'pages/script.vue'),
  },
]
