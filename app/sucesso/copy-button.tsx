'use client';

export default function CopyButton({ text, label }: { text: string; label: string }) {
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      const el = document.getElementById('toast');
      if (el) {
        el.textContent = 'Copiado!';
        el.style.opacity = '1';
        setTimeout(() => { el.style.opacity = '0'; }, 2000);
      }
    } catch {
      // fallback
    }
  }

  return (
    <>
      <button className="btn btn-secondary" onClick={handleCopy} style={{ width: '100%' }}>
        {label}
      </button>
      <div id="toast" className="toast" style={{ opacity: 0 }}>Copiado!</div>
    </>
  );
}
