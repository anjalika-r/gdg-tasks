import turtle


# ---------- L-System Engine ----------
def expand_lsystem(axiom, rules, iterations):
    current = axiom
    for _ in range(iterations):
        next_string = ""
        for symbol in current:
            next_string += rules.get(symbol, symbol)
        current = next_string
    return current


# ---------- Parser ----------
def draw(instructions, angle):
    turtle.penup()
    turtle.setpos(0, 0)
    turtle.setheading(90)
    turtle.pendown()

    step = 5

    for cmd in instructions:
        if cmd == "F":
            turtle.forward(step)
        elif cmd == "+":
            turtle.right(angle)
        elif cmd == "-":
            turtle.left(angle)


# ---------- Get User Inputs ----------
def get_user_inputs():
    print("L-System Generator")
    print("-" * 30)
    
    axiom = input("Axiom (default: F): ").strip() or "F"
    
    rules_text = input("Rules (e.g. F:F+F-F, default: F:F+F-F): ").strip() or "F:F+F-F"
    rules = {}
    for rule in rules_text.split(","):
        if ":" in rule:
            symbol, replacement = rule.split(":")
            rules[symbol.strip()] = replacement.strip()
    
    angle_text = input("Angle in degrees (default: 90): ").strip() or "90"
    angle = float(angle_text)
    
    iterations_text = input("Iterations (default: 4): ").strip() or "4"
    iterations = int(iterations_text)
    
    return axiom, rules, angle, iterations


if __name__ == "__main__":
    # Get inputs from terminal
    axiom, rules, angle, iterations = get_user_inputs()
    
    # Setup turtle
    screen = turtle.Screen()
    screen.setup(width=800, height=600)
    screen.bgcolor("white")
    turtle.hideturtle()
    turtle.speed(0)
    
    # Generate and draw
    result = expand_lsystem(axiom, rules, iterations)
    print(f"\nGenerated string length: {len(result)}")
    print("Drawing...")
    draw(result, angle)
    
    print("Done! Close the turtle window to exit.")
    turtle.done()
