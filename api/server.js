const express = require('express')

const User = require('./users/model')

const server = express()

server.use(express.json())

server.get('/', (req, res) => {
    res.status(200).json({ api: 'operational'})
})

server.get('/api/users', (req, res) => {
    User.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).json({
                message: err.message
            })
        })
})

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id
    User.findById(id)
        .then(user => {
            if (!user) {
                res.status(404).json({
                    message: 'The user with the specified ID does not exist'
                })
            } else {
                res.status(200).json(user)
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'The user information could not be retrieved',
                error: err.message
            })
        })
})

server.post('/api/users', (req, res) => {
    if (!req.body.name || !req.body.bio) {
        res.status(400).json({
            message: 'Please provide name and bio for the user'
        })
    } else {
        const { name, bio } = req.body
        User.insert({ name, bio })
            .then(user => {
                res.status(201).json(user)
            })
            .catch(err => {
                res.status(500).json({
                    message: 'There was an error while saving the user to the database',
                    error: err.message
                })
            })
    }
})

server.put('/api/users/:id', (req, res) => {
    const { id } = req.params
    const { name, bio } = req.body
    if (!name || !bio) {
        res.status(400).json({ message: 'Please provide name and bio for the user' })
    } else {
        User.update(id, { name, bio })
            .then(updated => {
                if (!updated) {
                    res.status(404).json({ message: 'The user with the specified ID does not exist' })
                } else {
                    res.json(updated)
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: 'The user information could not be modified',
                    error: err.message,
                })
            })
    }
  })

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id
    User.remove(id)
        .then(user => {
            if (!user) {
                res.status(404).json({
                    message: 'The user with the specified ID does not exist'
                })
            } else {
                res.status(200).json(user)
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'The user could not be removed',
                error: err.message
            })
        })
})

module.exports = server
