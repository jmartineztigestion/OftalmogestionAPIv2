const express = require('express')
const router = express.Router()

const routes = [
    {
        path: 'user'
    },
    {
        path: 'items'
    },
    {
        path: 'auth'
    }, 
    {
        path: 'uploadIngesta'
    },
    {
        path: 'api'
    }
]

routes.forEach(route => {
    return router.use(`/${route.path}`, require(`./${route.path}`))
})

module.exports = router