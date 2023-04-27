// /pages/api/events.js
import axios from 'axios'

export default async (req, res) => {
  if (req.method === 'GET') {
    const regionName = req.query.region

    try {
      const response = await axios.get(
        `https://pinballmap.com/api/v1/region/${regionName}/events.json`
      )

      const events = response.data.events.map((event) => {
        return {
          name: event.name,
          long_desc: event.long_desc,
          external_link: event.external_link,
          start_date: event.start_date,
        }
      })

      res.status(200).json({ events })
    } catch (error) {
      res.status(500).json({ error: 'Error fetching events' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ error: `Method ${req.method} not allowed` })
  }
}
