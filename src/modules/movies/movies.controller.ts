import { Router } from "express"
import { SearchRequest } from "./movies.interfaces"
import axios from 'axios'
import * as cheerio from 'cheerio'
import { parse } from 'qs'

const router = Router()

const BASE_SEARCH_URL = 'http://rutor.info/search/1/0/000/0'
const MAGNET_KEY = 'magnet:?xt'
const SPLIT_MAGNET_LINK = 'urn:btih:'

router.get('/search', async ({ query: { searchTerm } }: SearchRequest, res) => {
    try {
        const searhResult = await axios.get(`${BASE_SEARCH_URL}/${searchTerm}`)
        const $ = cheerio.load(searhResult.data);

        const data = $('#index tr').toArray()

        const results = data.map(item => {
            const [_, magnetTag, title] = $(item).find('a').toArray()

            const magnetLink = $(magnetTag).attr('href')
            const parsedMagnetLink = parse(magnetLink)
            const magnet = String(parsedMagnetLink[MAGNET_KEY]).replace(SPLIT_MAGNET_LINK, '') 

            return {
                magnet: magnet,
                title: $(title).text(),
                //TODO: add torrent file ?
            }
        })

        res.status(200).send(results)
    } catch (err) {
        res.send(400).send(err)
    }
})

export default router
