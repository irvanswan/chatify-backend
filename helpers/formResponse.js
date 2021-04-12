const formResponse = (message, res) => {
    res.status(message?.status ?? 200).send(message ?? {'message': 'not exist', data: []})
}

module.exports = formResponse