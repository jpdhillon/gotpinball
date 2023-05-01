import prisma from '../../lib/prisma'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return await getLatestReviews(req, res)
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
}

async function getLatestReviews(req, res) {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    })

    return res.status(200).json(reviews)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Error reading from database' })
  }
}
