import socket
import sys
import threading
import argparse
from datetime import datetime

# --------- ANSI COLORS ----------
RESET = "\033[0m"
GREEN = "\033[92m"
BLUE = "\033[94m"
YELLOW = "\033[93m"
RED = "\033[91m"
GRAY = "\033[90m"

# --------- UTILS ----------
def ts():
    return datetime.now().strftime("%H:%M:%S")

def log(msg, color=GRAY):
    print(f"{color}[{ts()}] {msg}{RESET}")

# --------- IRC CLIENT ----------
class IRCClient:
    def __init__(self, server, port, nick, channel):
        self.server = server
        self.port = port
        self.nick = nick
        self.channel = channel
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.connected = False

    def connect(self):
        log(f"Connecting to {self.server}:{self.port} as {self.nick}", YELLOW)
        self.sock.connect((self.server, self.port))

        self.send_cmd(f"NICK {self.nick}")
        self.send_cmd(f"USER {self.nick} 0 * :{self.nick}")

        self.connected = True
        threading.Thread(target=self.listen, daemon=True).start()

        if self.channel:
            self.join(self.channel)

    def send_cmd(self, cmd):
        self.sock.sendall((cmd + "\r\n").encode())

    def join(self, channel):
        self.channel = channel
        self.send_cmd(f"JOIN {channel}")
        log(f"Joined {channel}", GREEN)

    def send_message(self, msg):
        if not self.channel:
            log("Not in a channel", RED)
            return
        self.send_cmd(f"PRIVMSG {self.channel} :{msg}")

    def quit(self):
        self.send_cmd("QUIT :bye")
        self.sock.close()
        self.connected = False
        log("Disconnected", RED)
        sys.exit(0)

    def listen(self):
        buffer = ""
        while self.connected:
            try:
                data = self.sock.recv(4096).decode(errors="ignore")
                if not data:
                    break

                buffer += data
                while "\r\n" in buffer:
                    line, buffer = buffer.split("\r\n", 1)
                    self.handle_line(line)
            except Exception as e:
                log(f"Error: {e}", RED)
                break

    def handle_line(self, line):
        if line.startswith("PING"):
            self.send_cmd(f"PONG {line.split()[1]}")
            return

        parts = line.split()
        if len(parts) < 2:
            return

        prefix = parts[0]
        cmd = parts[1]

        if cmd == "PRIVMSG":
            nick = prefix.split("!")[0][1:]
            channel = parts[2]
            message = " ".join(parts[3:])[1:]
            print(f"{BLUE}[{ts()}] <{nick}> {message}{RESET}")

        elif cmd == "JOIN":
            nick = prefix.split("!")[0][1:]
            channel = parts[2] if len(parts) > 2 else self.channel
            log(f"{nick} joined {channel}", GREEN)

        else:
            # ignore everything else safely
            pass


# --------- CLI ----------
def main():
    parser = argparse.ArgumentParser(description="Minimal IRC Client (raw sockets)")
    parser.add_argument("--server", default="irc.libera.chat")
    parser.add_argument("--port", type=int, default=6667)
    parser.add_argument("--nick", required=True)
    parser.add_argument("--channel", default=None)

    args = parser.parse_args()

    client = IRCClient(
        server=args.server,
        port=args.port,
        nick=args.nick,
        channel=args.channel,
    )

    client.connect()

    while True:
        try:
            user_input = input()
            if user_input.startswith("/join"):
                _, ch = user_input.split(maxsplit=1)
                client.join(ch)
            elif user_input.startswith("/quit"):
                client.quit()
            else:
                client.send_message(user_input)
        except KeyboardInterrupt:
            client.quit()

if __name__ == "__main__":
    main()
