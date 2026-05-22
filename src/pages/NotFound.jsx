import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="lede">That link didn't lead anywhere sweet. Let's get you back home.</p>
        <Link to="/" className="btn btn-primary">Back to home</Link>
      </header>
    </section>
  )
}

export default NotFound
