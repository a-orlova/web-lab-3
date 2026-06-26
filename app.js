export default function appSrc(express, bodyParser, createReadStream, crypto, http) {
    const app = express()

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader(
            'Access-Control-Allow-Methods',
            'GET,POST,PUT,PATCH,OPTIONS,DELETE'
        )

        if (!req.path.endsWith('/')) {
            return res.redirect(301, req.path + '/' + (req.url.includes('?') 
            ? req.url.substring(req.url.indexOf('?')) : ''))
        }

        next()
    })

    const login = 'alenaorlova'

    app.get('/login/', (req, res) => {
        res.send(login)
    })

    // app.get('/code/', (req, res) => {
    //     createReadStream(import.meta.url.substring(10)).pipe(res)
    // })
    app.get('/code/', (req, res) => {
        createReadStream(new URL(import.meta.url)).pipe(res)
    })

    app.get('/sha1/:input/', (req, res) => {
        const hash = crypto
            .createHash('sha1')
            .update(req.params.input)
            .digest('hex')

        res.send(hash)
    })

    const handleReq = (req, res) => {
        const addr = req.query.addr || req.body.addr

        http.get(addr, response => {
            let data = ''

            response.on('data', chunk => {
                data += chunk
            })

            response.on('end', () => {
                res.send(data)
            })
        })
    }

    app.get('/req/', handleReq)
    app.post('/req/', handleReq)

    app.all('*', (req, res) => {
        res.send(login)
    })

    return app
}

