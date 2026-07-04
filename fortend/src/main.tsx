
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";

// 🔴 IMPORTANT: Register AG Grid modules
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

// Import AG Grid styles globally
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

createRoot(document.getElementById('root')!).render(
   <BrowserRouter>
    <App />
  </BrowserRouter>
)




