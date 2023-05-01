import prisma from '../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return await addReview(req, res)
  } else if (req.method === 'GET') {
    return await readReviews(req, res)
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
}

async function readReviews(req, res) {
  const { locationName } = req.query
  try {
    const reviews = await prisma.review.findMany({
      where: {
        locationName: locationName,
      },
    })
    return res.status(200).json(reviews)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Error reading from database' })
  }
}

async function addReview(req, res) {
  const { userReview, locationName } = req.body
  try {
    const newReview = await prisma.review.create({
      data: {
        userReview: userReview,
        locationName: locationName,
      },
    })
    return res.status(200).json(newReview)
  } catch (error) {
    console.error('Request error', error)
    res.status(500).json({ error: 'Error adding review' })
  }
}
