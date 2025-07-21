export default function SessionDisplay({ session, onReset }) {
  return (
    <div id="paired-view">
      <h3>✅ Paired Successfully!</h3>
      <p>Copy your Base64 encoded session ID below.</p>
      <div className="session-container">
        <textarea readOnly rows={5} value={session}></textarea>
        <button
          id="btn-copy"
          onClick={() => {
            navigator.clipboard.writeText(session);
          }}
        >
          Copy ID
        </button>
      </div>
      <button id="btn-new-session" onClick={onReset}>Generate New Session</button>
    </div>
  );
}
