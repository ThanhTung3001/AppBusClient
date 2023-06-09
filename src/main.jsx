import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from './App'
import './index.css'
import './satoshi.css'
import 'semantic-ui-css/semantic.min.css'
import store from './app/store'



ReactDOM.createRoot(document.getElementById('root')).render(

  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>

)