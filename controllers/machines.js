const axios = require('axios');

const fetchMachines = async () => {
  try {
    const res = await axios.get('https://pinballmap.com/api/v1/machines.json');
    const machines = res.data.machines;
    machines.sort((a, b) => a.name.localeCompare(b.name));
    return machines;
  } catch (e) {
    console.log("Error:", e);
  }
}

module.exports.getMachines = async (req, res) => {
  // Declaring variable
  const resPerPage = 100; // results per page
  const page = req.params.page || 1; // page number
  const skip = (resPerPage * page) - resPerPage; // value
  const limit = resPerPage; // limit value
  const machines = await fetchMachines(); // all machines results from API
  const totalMachines = machines.length;
  const machinesPerPage = machines.slice(skip, (skip+limit)); // the results per page
  res.render('machines/machines', { 
    machinesPerPage: machinesPerPage,
    currentPage: page,
    pages: Math.ceil(totalMachines / resPerPage)
   });
}