import React from 'react'
import ReactDOM from 'react-dom'

const App = React.lazy(() => import('./HostApp'))

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback={<div>Loading...</div>}>
      <App />
    </React.Suspense>
  </React.StrictMode>,
  document.querySelector('#app')
)
