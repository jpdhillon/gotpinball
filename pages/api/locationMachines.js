import axios from 'axios'

export default async function handler(req, res) {
  const { id } = req.query

  try {
    const response = await axios.get(
      `http://pinballmap.com/api/v1/locations/${id}/machine_details.json`
    )
    const machines = response.data.machines.map((machine) => ({
      id: machine.id,
      name: machine.name,
      manufacturer: machine.manufacturer,
      year: machine.year,
      ipdb_link: machine.ipdb_link,
    }))
    res.status(200).json({ machines })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching machine locations' })
  }
}
