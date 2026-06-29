const request = require('supertest');
const ioClient = require('socket.io-client');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const { app, server, io } = require('../index');

const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey123';
let socketUrl;

async function waitForDb() {
  if (mongoose.connection.readyState === 1) return;

  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('MongoDB connection timeout')), 15000);
    mongoose.connection.once('connected', () => {
      clearTimeout(timer);
      resolve();
    });
    mongoose.connection.once('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

beforeAll(async () => {
  await waitForDb();

  if (!server.listening) {
    await new Promise((resolve) => server.listen(0, resolve));
  }

  const addr = server.address();
  socketUrl = `http://localhost:${addr.port}`;
});

afterAll(async () => {
  await new Promise((resolve) => io.close(resolve));
  await new Promise((resolve) => server.close(resolve));
  await mongoose.connection.close();
});

describe('=== P0 Security Integration Tests ===', () => {

  test('POST /api/auth/login should reject NoSQL Injection object payloads', async () => {
    const maliciousPayload = {
      username: { '$gt': '' },
      password: 'anypassword',
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(maliciousPayload);

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  test('Socket.io should reject connections missing a valid token', (done) => {
    const clientSocket = ioClient(socketUrl, {
      auth: { token: '' },
      reconnection: false,
    });

    clientSocket.on('connect', () => {
      clientSocket.disconnect();
      done(new Error('Security Boundary Broken: Anonymous socket allowed to connect!'));
    });

    clientSocket.on('connect_error', (err) => {
      expect(err.message).toContain('Authentication required');
      clientSocket.disconnect();
      done();
    });
  }, 10000);

  test('Socket.io should reject expired tokens during handshake', (done) => {
    const expiredToken = jwt.sign(
      { username: 'expired-user' },
      JWT_SECRET,
      { expiresIn: '-1s', algorithm: 'HS256' }
    );

    const clientSocket = ioClient(socketUrl, {
      auth: { token: expiredToken },
      reconnection: false,
    });

    clientSocket.on('connect', () => {
      clientSocket.disconnect();
      done(new Error('Security Boundary Broken: Expired token allowed to connect!'));
    });

    clientSocket.on('connect_error', (err) => {
      expect(err.message).toContain('Token expired');
      clientSocket.disconnect();
      done();
    });
  }, 10000);

  test('Socket.io should override client-supplied sender with token username', (done) => {
    const testToken = jwt.sign({ username: 'ahmad' }, JWT_SECRET, { algorithm: 'HS256' });

    const clientSocket = ioClient(socketUrl, {
      auth: { token: testToken },
      reconnection: false,
    });

    clientSocket.on('connect', () => {
      clientSocket.emit('send-message', {
        text: 'hello world',
        sender: 'hacker',
      }, (ack) => {
        expect(ack).toEqual(expect.objectContaining({ ok: true }));
      });
    });

    clientSocket.on('receive-message', (msg) => {
      try {
        expect(msg.sender).toBe('ahmad');
        expect(msg.sender).not.toBe('hacker');
        clientSocket.disconnect();
        done();
      } catch (error) {
        clientSocket.disconnect();
        done(error);
      }
    });
  }, 10000);
});
