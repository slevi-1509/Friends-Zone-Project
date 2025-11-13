import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import {} from "react-router-dom"
import reducer from "../src/components/redux/reducer.jsx"
import { legacy_createStore as createStore } from "redux"
import { Provider } from "react-redux"
import App from './App.jsx'
const appStore = createStore(reducer);

createRoot(document.getElementById('root')).render(
    <Provider store={appStore}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
)
