
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import App from './App.jsx';

import { CarritoProvider } from './context/CarritoContext.jsx';
import { CategoriasProvider } from './context/CategoriasContext.jsx';
import { ProductosProvider } from './context/ProductosContext.jsx';
import { SesionProvider } from './context/SesionContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SesionProvider>
        <ProductosProvider>
          <CategoriasProvider>
            <CarritoProvider>
              <App />
            </CarritoProvider>
          </CategoriasProvider>
        </ProductosProvider>
      </SesionProvider>
    </BrowserRouter>
  </StrictMode>,
);
