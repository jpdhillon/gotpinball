import dynamic from 'next/dynamic'

const PureCSSLoader = dynamic(
  () => {
    return new Promise((resolve) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href =
        'https://cdn.jsdelivr.net/npm/purecss@3.0.0/build/pure-min.css'
      link.integrity =
        'sha384-X38yfunGUhNzHpBaEBsWLO+A0HDYOQi8ufWDkZ0k9e0eXz/tH3II7uKZ9msv++Ls'
      link.crossOrigin = 'anonymous'
      link.onload = () => resolve()
      document.head.appendChild(link)
    })
  },
  { ssr: false }
)

export default PureCSSLoader
