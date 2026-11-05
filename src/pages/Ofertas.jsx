import ListaCartas from '../components/ListaCartas.jsx';
import { useCartas } from '../hooks/useCartas.js';

// Página /ofertas : cartas activas marcadas como oferta.
export default function Ofertas({ onAgregar }) {
  const { cartas } = useCartas();
  const ofertas = cartas.filter((carta) => carta.activo && carta.oferta);

  return (
    <main className="container py-4">
      <h1 className="h3 mb-3">Ofertas</h1>
      <ListaCartas cartas={ofertas} onAgregar={onAgregar} />
    </main>
  );
}
