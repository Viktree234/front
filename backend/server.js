// backend/server.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Boom } from '@hapi/boom';
import fs from 'fs';

import baileys from '@whiskeysockets/baileys';
const makeWASocket = baileys.default?.makeWASocket || baileys.makeWASocket;
const useMultiFileAuthState = baileys.useMultiFileAuthState;
const DisconnectReason = baileys.DisconnectReason;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

const PORT = 5000;
app.use(express.static('frontend'));

io.on('connection', async (socket) => {
  console.log('🔌 Client connected');

  socket.on('start-pair', async ({ mode, phoneNumber }) => {
    if (!phoneNumber || !['qr', 'code'].includes(mode)) {
      return socket.emit('error', 'Invalid request');
    }

    const authFolder = `./auth_info_baileys/${phoneNumber}`;
    const { state, saveCreds } = await useMultiFileAuthState(authFolder);
    const sock = makeWASocket({ auth: state });

    sock.ev.on('creds.update', saveCreds);

    let hasRequestedCode = false;
    let sessionSent = false;

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr && mode === 'qr') {
        socket.emit('qr', qr);
      }

      if (connection === 'open' && !sessionSent) {
        sessionSent = true;
        const sessionFiles = fs.readdirSync(authFolder).map(file => {
          const data = fs.readFileSync(`${authFolder}/${file}`, 'utf8');
          return `${file}:${Buffer.from(data).toString('base64')}`;
        }).join('|');
        socket.emit('paired', { sessionID: sessionFiles });
        console.log('✅ WhatsApp connected');
      }

      if (connection === 'open' && mode === 'code' && !hasRequestedCode) {
        hasRequestedCode = true;
        try {
          const code = await sock.requestPairingCode(phoneNumber);
          socket.emit('code', code);
          console.log('📲 Pairing code sent to frontend.');
        } catch (err) {
          console.error('❌ Pairing code error:', err);
          socket.emit('error', 'Pairing code request failed.');
        }
      }

      if (connection === 'close') {
        const statusCode = (lastDisconnect?.error instanceof Boom)
          ? lastDisconnect.error.output?.statusCode
          : null;
        if (statusCode !== DisconnectReason.loggedOut) {
          console.log('⚠️ Reconnecting...');
        }
      }
    });
  });
});

httpServer.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
