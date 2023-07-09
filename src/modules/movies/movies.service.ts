import axios from 'axios'
import * as cheerio from 'cheerio'
import { BASE_SEARCH_URL } from './movies.const'
import { extractMagnetFromQuery } from './movies.util'

export const movieSearch = async (searchTerm: string) => {
  const searhResult = await axios.get(`${BASE_SEARCH_URL}/${searchTerm}`)
  const $ = cheerio.load(searhResult.data)

  const data = $('#index tr').toArray()

  return data.map(item => {
    const [_, magnetTag, title] = $(item).find('a').toArray()
    const magnetLink = $(magnetTag).attr('href')

    return {
      magnet: extractMagnetFromQuery(magnetLink),
      title: $(title).text()
      //TODO: add torrent file ?
    }
  })
}
