import axios from 'axios'

export default async function handler(req, res) {
  const { id } = req.query

  try {
    const response = await axios.get(
      `https://pinballmap.com/api/v1/locations.json?by_machine_id=${id}&no_details=0`
    )
    const locations = response.data.locations.map((location) => {
      return {
        id: location.id,
        name: location.name,
        street: location.street,
        city: location.city,
        state: location.state,
        zip: location.zip,
        lat: location.lat,
        lon: location.lon,
      }
    })

    res.status(200).json({ locations })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching locations' })
  }
}
