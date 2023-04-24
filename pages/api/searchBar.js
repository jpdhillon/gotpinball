import axios from 'axios'

export default async function handler(req, res) {
  const { inputValue } = req.query

  try {
    const response = await axios.get(
      `http://pinballmap.com/api/v1/locations/closest_by_address.json?address=${inputValue}&send_all_within_distance=25`
    )
    const locations = response.data.locations.map((location) => ({
      id: location.id,
      name: location.name,
      lat: location.lat,
      lon: location.lon,
      street: location.street,
      city: location.city,
      state: location.state,
      zip: location.zip,
      phone: location.phone,
      website: location.website,
    }))

    res.status(200).json({ locations })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching locations' })
  }
}
