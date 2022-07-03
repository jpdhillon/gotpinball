const axios = require('axios');

const fetchMachineLocations = async (machineId) => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/locations.json?by_machine_id=' + machineId + '&no_details=0');
    const machineLocations = res.data.locations;
    return machineLocations;
  } catch (e) {
    console.log("Error:", e);
  }
};

module.exports.getMachineLocations = async (req, res) => {
  const machineId = req.params.id;
  const machineLocations = await fetchMachineLocations(machineId);
  res.render('machine/machineLocations', { machineLocations });
}