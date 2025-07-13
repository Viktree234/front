const socket = io();

function startPairing() {
  const phoneNumber = document.getElementById('phone').value.trim();
  const mode = document.getElementById('mode').value;
  if (!phoneNumber) return alert('Enter phone number');

  socket.emit('start-pair', { mode, phoneNumber });

  document.getElementById('qr-code').innerHTML = '';
  document.getElementById('code-display').innerText = '';
  document.getElementById('session-display').innerText = 'Waiting for connection...';
}

socket.on('qr', (qr) => {
  const qrDiv = document.getElementById('qr-code');
  qrDiv.innerHTML = '';
  new QRCode(qrDiv, qr);
});

socket.on('code', (code) => {
  document.getElementById('code-display').innerText = 'Pairing Code: ' + code;
});

socket.on('paired', ({ sessionID }) => {
  document.getElementById('session-display').innerText = 'Session ID:\n' + sessionID;
});

socket.on('error', (err) => {
  alert(err);
});
