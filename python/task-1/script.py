import tkinter as tk
import turtle

# ---------- THE L-SYSTEM ENGINE ----------
def expand_string(axiom, rules, iterations):
    current = axiom
    for _ in range(iterations):
        next_string = ""
        for symbol in current:
            # If symbol has a rule, replace it; otherwise, keep it
            next_string += rules.get(symbol, symbol)
        current = next_string
    return current

# ---------- THE MAIN APP CLASS ----------
class LSystemApp:
    def __init__(self, root):
        self.root = root
        self.root.title("L-System Fractal Architect")

        # 1. Dashboard (Sidebar)
        self.sidebar = tk.Frame(root, padx=10, pady=10, bg="#f0f0f0")
        self.sidebar.pack(side=tk.RIGHT, fill=tk.Y)

        # UI Elements
        tk.Label(self.sidebar, text="Axiom:", bg="#f0f0f0").pack(anchor="w")
        self.entry_axiom = tk.Entry(self.sidebar)
        self.entry_axiom.insert(0, "F")
        self.entry_axiom.pack(fill="x", pady=5)

        tk.Label(self.sidebar, text="Rules (e.g., F:F+F-F):", bg="#f0f0f0").pack(anchor="w")
        self.entry_rules = tk.Entry(self.sidebar)
        self.entry_rules.insert(0, "F:F[+F]-F")
        self.entry_rules.pack(fill="x", pady=5)

        tk.Label(self.sidebar, text="Angle (degrees):", bg="#f0f0f0").pack(anchor="w")
        self.entry_angle = tk.Entry(self.sidebar)
        self.entry_angle.insert(0, "30")
        self.entry_angle.pack(fill="x", pady=5)

        tk.Label(self.sidebar, text="Iterations:", bg="#f0f0f0").pack(anchor="w")
        self.entry_iterations = tk.Entry(self.sidebar)
        self.entry_iterations.insert(0, "4")
        self.entry_iterations.pack(fill="x", pady=5)

        self.btn_generate = tk.Button(self.sidebar, text="Generate Fractal", 
                                      command=self.execute, bg="#4CAF50", fg="white")
        self.btn_generate.pack(fill="x", pady=20)

        # 2. Canvas & Turtle Setup
        self.canvas = tk.Canvas(root, width=800, height=800, bg="white")
        self.canvas.pack(side=tk.LEFT, expand=True, fill="both")

        # Use RawTurtle to draw inside the Tkinter Canvas
        self.t = turtle.RawTurtle(self.canvas)
        self.t.hideturtle()
        
    def execute(self):
        # --- 1. Get Inputs ---
        axiom = self.entry_axiom.get().strip()
        angle = float(self.entry_angle.get())
        iters = int(self.entry_iterations.get())
        
        # Parse Rules Safely (fixing the "unpack" error)
        rules_text = self.entry_rules.get().split(",")
        rules_dict = {}
        for r in rules_text:
            if ":" in r:
                key, val = r.split(":")
                rules_dict[key.strip()] = val.strip()

        # --- 2. Expand String ---
        final_string = expand_string(axiom, rules_dict, iters)

        # --- 3. Draw with Optimization ---
        self.t.screen.tracer(0, 0) # Turn off animation (Speed Optimization)
        self.t.clear()
        self.t.penup()
        self.t.home()              # Go to (0,0) center
        self.t.setheading(90)      # Point up
        self.t.pendown()

        stack = [] # The "Memory" for branching [ ]

        for cmd in final_string:
            if cmd == "F" or cmd == "G":
                self.t.forward(10)
            elif cmd == "+":
                self.t.right(angle)
            elif cmd == "-":
                self.t.left(angle)
            elif cmd == "[":
                # Save spot: position and angle
                stack.append((self.t.position(), self.t.heading()))
            elif cmd == "]":
                # Return to spot
                if stack:
                    pos, head = stack.pop()
                    self.t.penup()
                    self.t.goto(pos)
                    self.t.setheading(head)
                    self.t.pendown()

        self.t.screen.update() # Refresh screen to show drawing

# ---------- RUN THE PROGRAM ----------
if __name__ == "__main__":
    root = tk.Tk()
    app = LSystemApp(root)
    root.mainloop()
