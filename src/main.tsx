import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router} from 'react-router-dom'
import App from './pages/App.tsx'
import './tailwind.css'
import Loading from './components/Loading/Loading.tsx'

import i18n from './i18n.ts'; // Import the i18n instance

// Initialize the i18n instance. The i18n settings are located at './i18n.ts'
i18n.init();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Router>
          <Suspense fallback={<Loading />}>
            <App />
          </Suspense>
        </Router>
    </React.StrictMode>,
)
