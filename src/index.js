import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import store from './app/store'
import { fetchUsers } from './features/users/userSlice'
import { worker } from './api/server'

worker.start().then(start);

store.dispatch(fetchUsers())

async function start() {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  )
}
