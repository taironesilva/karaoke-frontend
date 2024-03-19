import express from 'express'
const app = express()
import { createPool } from 'mysql2'
import cors from 'cors'
import forerunnerdb from 'forerunnerdb'
import { readFile } from 'fs/promises'

app.use(cors())
app.use(express.json())

const es_host = '0.0.0.0'
const es_port = 3001

app.get('/', (request, response) => {
  res.send('OK')
})

app.listen(es_port, es_host, () => {
  console.log('Servidor rodando no host: ' + es_host + ' e porta:', +es_port)
})

const catalogo_json = JSON.parse(
  await readFile(new URL('../assets/catalogo_karaoke.json', import.meta.url))
)

var ForerunnerDB = forerunnerdb

var fdb = new ForerunnerDB()
var db = fdb.db('karaoke')
var itemCollection = db.collection('karaoke')

app.post('/realizarConsulta', function (request, response) {
  itemCollection.insert(catalogo_json)

  const radio = request.body.radio
  const text = request.body.text
  const myRegExp = new RegExp(text)
  let result
  if (radio == 'musica') {
    console.log('entrou no if', radio, myRegExp)
    result = itemCollection.find(
      {},
      {
        $elemsMatch: {
          registros: {
            música: myRegExp
          }
        }
      }
    )
  } else {
    //console.log('entrou no else', radio, myRegExp)
    result = itemCollection.find(
      {},
      {
        $elemsMatch: {
          registros: {
            artista: myRegExp
          }
        }
      }
    )
  }
  response.responseType = 'json'
  response.send(result)
  //console.log(JSON.stringify(result))
})
