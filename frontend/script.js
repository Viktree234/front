// Handles button selection and showing/hiding inputs
const qrBtn = document.getElementById('qrModeBtn');
const codeBtn = document.getElementById('codeModeBtn');
const pairBtn = document.getElementById('pairBtn');
const phoneContainer = document.getElementById('phoneContainer');
const phoneInput = document.getElementById('phone');

let selectedMode = null;

qrBtn.onclick = () => {
  selectedMode = 'qr';
  qrBtn.classList.add('active');
  codeBtn.classList.remove('active');
  phoneContainer.classList.add('hidden');
  pairBtn.classList.remove('hidden');
};

codeBtn.onclick = () => {
  selectedMode = 'code';
  codeBtn.classList.add('active');
  qrBtn.classList.remove('active');
  phoneContainer.classList.remove('hidden');
  pairBtn.classList.remove('hidden');
};
