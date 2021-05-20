function NotFound() {
  const URL = window.location.pathname + window.location.search;

  return (
    <div className="API"> Cannot GET {URL} </div>
  )
}

export default NotFound;