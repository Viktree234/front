export default function PhoneInput({ phone, setPhone, onSubmit }) {
  return (
    <div id="phone-input-container">
      <label>Enter Phone Number (starting with 234)</label>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="e.g. 2348012345678"
      />
      <button
        id="btn-get-code"
        onClick={() => {
          if (!/^234\d{10,}$/.test(phone)) {
            alert('Phone must start with 234 and be at least 13 digits.');
          } else {
            onSubmit();
          }
        }}
      >
        Get Pairing Code
      </button>
    </div>
  );
}
