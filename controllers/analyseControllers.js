module.exports.analyse = async (req, res) => {
    try {
        console.log('Connection to Gemini', req)
        res.status(201).json('success')
    }
        catch (error) {
            console.log(error)
        }
}