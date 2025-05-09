module.exports.analyse = async (req, res) => {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.API_KEY}`, {
            method: 'POST',
            body: JSON.stringify({
                "contents": [{
                    "parts": [{"text": "What is the most famous quote from Shakespeare's Hamlet?"}]
                }]
            }
)        })
        const data = await response.json()
        res.status(201).json('success')
        console.log(...data.candidates.map(c => c.content))
        return 
    }
        catch (error) {
            console.log(error)
        }
}