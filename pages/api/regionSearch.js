import axios from 'axios'

export default async function handler(req, res) {
  const { name } = req.query

  try {
    const response = await axios.get(
      `http://pinballmap.com/api/v1/region/${name}/locations.json`
    )

    const locations = response.data.locations.map((location) => ({
      id: location.id,
      name: location.name,
      street: location.street,
      state: location.state,
      zip: location.zip,
      lon: location.lon,
      lat: location.lat,
      phone: location.phone,
      website: location.website,
    }))

    res.status(200).json({ locations })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching locations' })
  }
}
