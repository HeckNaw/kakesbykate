import InstagramEmbed from '../components/InstagramEmbed'

function InstaFeature() {
  return (
    <section className="section section-ig-feature">
      <div className="ig-feature reveal">
        <span className="section-num feat-num" data-num="—">latest on instagram</span>
        <InstagramEmbed permalink="https://www.instagram.com/p/DXxAHNvGpO-/?utm_source=ig_embed&utm_campaign=loading" />
      </div>
    </section>
  )
}

export default InstaFeature
