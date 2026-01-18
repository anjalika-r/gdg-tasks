# Minimal IRC Client (Raw Sockets)

A minimal IRC client implemented using **raw TCP sockets only**.  
No IRC libraries, no TLS, no reconnection logic — just the core IRC protocol over a socket.

This client connects to a real IRC server, joins a single channel, and allows real-time message exchange via the terminal.

---

## Features

- Raw TCP socket connection
- IRC handshake (`NICK`, `USER`)
- Handles core IRC commands:
  - `PING` → `PONG`
  - `PRIVMSG`
  - `JOIN`
  - `QUIT`
- Single server, single channel
- Real-time send & receive
- Color-coded output
- Timestamps
- CLI flag configuration

---

## Requirements

- Python 3.8+
- No external dependencies (standard library only)

---

## File Structure

```
.
├── script.py
└── README.md
```

---

## Running the Client

### Basic usage

```bash
python3 script.py --nick yournick --channel #testchannel
```

### Example (Libera.Chat)

```bash
python3 script.py --nick hrdk123 --channel #libera
```

### Specify server and port explicitly

```bash
python3 script.py \
  --server irc.libera.chat \
  --port 6667 \
  --nick hrdk123 \
  --channel #libera
```

---

## Testing with Two Terminals

Open two terminals and run:

**Terminal 1**
```bash
python3 script.py --nick user1 --channel #demo
```

**Terminal 2**
```bash
python3 script.py --nick user2 --channel #demo
```

You should observe:
- JOIN notifications
- Real-time message delivery
- Stable connection without disconnects

---

## In-Client Commands

| Command | Description |
|------|------------|
| `/join #channel` | Join or switch channel |
| `/quit` | Quit the IRC server cleanly |
| `message text` | Send message to current channel |

---

## What to Verify When Testing

- Successful connection (no immediate disconnect)
- JOIN events propagate to both clients
- Messages appear instantly across terminals
- No echo of your own messages
- Client stays connected while idle (PING/PONG works)
- Unknown IRC messages do not crash the client

---

## Limitations

- No TLS
- Single server connection
- Single active channel
- No message history
- No reconnection logic
- No nickname change support

---

## Notes

- The server is authoritative; the client reacts to server messages
- Unsupported IRC commands are ignored safely
- CRLF line endings are respected per RFC 1459

---

## License

MIT — use, modify, and break it freely.
