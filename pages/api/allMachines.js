import axios from 'axios'

export default async function handler(req, res) {
  try {
    const response = await axios.get(
      'http://pinballmap.com/api/v1/machines.json'
    )
    const machines = response.data.machines.map((machine) => ({
      id: machine.id,
      name: machine.name,
      ipdb_link: machine.ipdb_link,
      year: machine.year,
      manufacturer: machine.manufacturer,
      opdb_img: machine.opdb_img,
    }))

    res.status(200).json({ machines })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch machines' })
  }
}
