const items = [
  { title: 'Buttercream Bloom', tag: 'Wedding' },
  { title: 'Chocolate Drip', tag: 'Birthday' },
  { title: 'Lemon Lavender', tag: 'Spring' },
  { title: 'Tiered Vanilla', tag: 'Anniversary' },
  { title: 'Funfetti Stack', tag: 'Kids' },
  { title: 'Earl Grey Honey', tag: 'Specialty' },
]

function Gallery() {
  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Gallery</p>
        <h1>A taste of recent work</h1>
        <p className="lede">A few of our favorite cakes from this season. Swap photos in once you've got the shots you love.</p>
      </header>

      <div className="gallery-grid">
        {items.map((item) => (
          <figure key={item.title} className="gallery-card">
            <div className="gallery-img" aria-hidden="true" />
            <figcaption>
              <strong>{item.title}</strong>
              <span>{item.tag}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export default Gallery
