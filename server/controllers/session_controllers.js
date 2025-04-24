const Session = require ("../models/session_models")

async function index(req, res) {
    try {
        const session = await Session.getAll()
        res.status(200).json(session)
    } catch(err){
        res.status(500).json({ error: err.message})
    }
}

async function show(req, res) {
    try {
        const id = parseInt(req.params.id)
        const session = await Session.getOneById(id)
        res.status(200).json(session)
    } catch(err) {
        res.status(404).json({ error: err.message })
    }
}

async function create(req, res) {
    try {
        const data = req.body
        const session = await Session.create(data)
        res.status(201).json(session)
    } catch(err) {
        res.status(404).json({ error: err.message})
    }
}

async function destroy(req, res) {
    try{
    const id = parseInt(req.params.id)
    const session = await Session.getOneById(id)
    const result = await session.destroy({id})
    res.status(204).json(result)
    } catch(err) {
        res.status(404).json({ error: err.message })
    }
}

module.exports = {
    index, show, create, destroy
}








