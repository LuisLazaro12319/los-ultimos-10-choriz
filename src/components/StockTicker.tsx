export function StockTicker() {
  return (
    <div className="stock-ticker">
      <div className="wrap stock-inner">
        <div>
          <span className="stock-lbl">Tanda en la Parrilla:</span>{" "}
          <span>¡Quedan 7 de los últimos 10 chorizos! Pedí ahora antes de que se apaguen las brasas.</span>
        </div>
        <a href="#menu" style={{ fontWeight: 700, color: "var(--primary)", textDecoration: "underline" }}>
          Asegurar mi pedido →
        </a>
      </div>
    </div>
  );
}
