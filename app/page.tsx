import Link from "next/link";

export default function Home() {
  return (
    <div className="app app--warm">
      <div className="screen">
        {/* Brand */}
        <div className="brand mb-20" style={{ marginTop: "8px" }}>
          <span className="mark">&#10084;</span>
          <span className="name">Presente Especial</span>
        </div>

        {/* Hero photo placeholder */}
        <div
          className="photo"
          style={{
            height: "172px",
            borderRadius: "22px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
            background:
              "repeating-linear-gradient(135deg, #f9f3ee 0px, #f9f3ee 10px, #f4ebe3 10px, #f4ebe3 20px)",
          }}
        />

        {/* Heading */}
        <h1 className="h1" style={{ fontSize: "38px", margin: "22px 0 12px" }}>
          Um presente que vale por mil
        </h1>
        <p className="lead mb-24">
          Reúna mensagens e fotos de quem ama e entregue um álbum que emociona.
        </p>

        {/* CTAs */}
        <Link className="btn btn-primary mb-12" href="/criar">
          Criar presente
        </Link>

        {/* How it works */}
        <div className="eyebrow mb-16">Como funciona</div>
        <div className="stack gap-14">
          {/* Step 1 */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#fff1f2",
                color: "#e11d48",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "15px",
                flexShrink: 0,
              }}
            >
              1
            </div>
            <div>
              <strong>Crie e personalize</strong>
              <p style={{ margin: "2px 0 0", opacity: 0.7 }}>
                Monte a capa e proteja com senha.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#fff1f2",
                color: "#e11d48",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "15px",
                flexShrink: 0,
              }}
            >
              2
            </div>
            <div>
              <strong>Compartilhe o link</strong>
              <p style={{ margin: "2px 0 0", opacity: 0.7 }}>
                Todos enviam mensagens e fotos.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#fff1f2",
                color: "#e11d48",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "15px",
                flexShrink: 0,
              }}
            >
              3
            </div>
            <div>
              <strong>Revele a surpresa</strong>
              <p style={{ margin: "2px 0 0", opacity: 0.7 }}>
                Entregue o álbum pronto pra emocionar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
