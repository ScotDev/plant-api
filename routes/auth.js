const express = require('express')
const router = express.Router()

const { v4: uuidv4 } = require('uuid');

// const app = express()
// const port = 3000


router.post("/login", (req, res) => {
    console.log(req.body)
    res.send("ok")
})

router.post("/register", (req, res) => {
    console.log(req.body)
    res.send("ok")
})

module.exports = router;