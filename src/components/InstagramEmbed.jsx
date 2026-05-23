import { useEffect } from 'react'

const SCRIPT_ID = 'instagram-embed-script'
const SCRIPT_SRC = 'https://www.instagram.com/embed.js'

function loadInstagramScript() {
  if (window.instgrm?.Embeds) {
    window.instgrm.Embeds.process()
    return
  }
  if (document.getElementById(SCRIPT_ID)) return
  const script = document.createElement('script')
  script.id = SCRIPT_ID
  script.src = SCRIPT_SRC
  script.async = true
  document.body.appendChild(script)
}

function InstagramEmbed({ permalink }) {
  useEffect(() => {
    loadInstagramScript()
  }, [permalink])

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-captioned=""
      data-instgrm-permalink={permalink}
      data-instgrm-version="14"
      style={{
        background: '#FFF',
        border: 0,
        borderRadius: '3px',
        boxShadow:
          '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
        margin: '1px',
        maxWidth: '540px',
        minWidth: '326px',
        padding: 0,
        width: 'calc(100% - 2px)',
      }}
    >
      <div style={{ padding: '16px' }}>
        <a
          href={permalink}
          target="_blank"
          rel="noreferrer"
          style={{
            background: '#FFFFFF',
            lineHeight: 0,
            padding: 0,
            textAlign: 'center',
            textDecoration: 'none',
            width: '100%',
          }}
        >
          View this post on Instagram
        </a>
      </div>
    </blockquote>
  )
}

export default InstagramEmbed
