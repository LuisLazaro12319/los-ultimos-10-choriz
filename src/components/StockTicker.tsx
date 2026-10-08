export function StockTicker() {
  return (
    <div className="stock-ticker">
      <div className="wrap stock-inner">
        <div>
          <span className="stock-lbl">Pedí hoy:</span>{" "}
          <span>Parrilla familiar, choripán, bondiola, vacío, mixtos y platos de arroz con papas.</span>
        </div>
        <a href="#menu" style={{ fontWeight: 700, color: "var(--primary)", textDecoration: "underline" }}>
          Ver el menú →
        </a>
      </div>
    </div>
  );
}
