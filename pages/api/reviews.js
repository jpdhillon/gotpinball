// pages/api/reviews.js
import { getSession } from 'next-auth/react'
import prisma from '../../lib/prisma'

export default async function handler(req, res) {
  const session = await getSession({ req })

  if (req.method === 'GET') {
    const { locationName } = req.query

    try {
      const reviews = await prisma.review.findMany({
        where: {
          locationName: locationName,
        },
      })

      res.status(200).json(reviews)
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch reviews.' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' })
  }
}
