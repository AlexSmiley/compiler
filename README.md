# RoboL Compiler

RoboL is an educational compiler for a Macedonian-keyword language with a robot-world simulator.

## Applications

This repository keeps the original Java Swing application and adds a separate Node.js web application:

| Application | Location | Purpose |
|---|---|---|
| Java desktop | `src/` | Original Swing editor, compiler and simulator |
| Node.js web IDE | `node-app/` | HTTP compiler API, browser editor and canvas simulator |

## Run the Node.js web IDE

Requirements: Node.js 18 or newer. The web application uses Node's built-in HTTP server and has no runtime npm dependencies.

```bash
cd node-app
npm test
npm start
```

Open http://localhost:3000.

The browser IDE includes a RoboL editor, environment editor, compile/run controls, diagnostics, token inspection, generated RIMAL output, a robot map and an execution trace.

### HTTP API

- `GET /api/health` – service health.
- `POST /api/compile` – JSON body `{"source":"..."}`; returns tokens, parsed program, RIMAL text and diagnostics.
- `POST /api/run` – JSON body `{"source":"...","environment":"..."}`; compiles and simulates the main procedure.

### Supported Node.js language features

The new implementation currently supports procedure declarations and calls, the main procedure, typed procedure parameters, local variable declarations, assignments and arithmetic expressions, robot commands, teleport, conditional blocks, counted repeat blocks and repeat-until blocks. The environment parser reads dimensions, wall segments, token coordinates and the robot's initial position.

The Node.js parser and simulator are a clean implementation of the language subset above; they do not call the Java classes. Some legacy semantic rules and the exact behavior of all RIMAL instructions still need parity tests against the original Java compiler. In particular, generated control-flow RIMAL should be treated as an initial compatible-format backend until verified against the RIMAL runtime.

## Run the original Java desktop application

Requirements: JDK 8+ and Maven 3.8+.

```bash
mvn clean verify
cd src
java -cp ../target/classes Applikacija
```

The legacy UI reads example and image files relative to its working directory.

## Architecture

```text
node-app/
  src/
    lexer.js          # Unicode-aware Macedonian lexer
    parser.js         # Recursive-descent parser and AST
    compiler.js       # Compile/run orchestration
    codegen.js        # RIMAL-like output
    environment.js    # Robot-world input validation
    simulator.js      # Isolated robot-world interpreter
    server.js         # HTTP API and static frontend hosting
  public/
    index.html        # Browser IDE
    styles.css
    app.js            # API client and canvas renderer
  test/
    compiler.test.js
src/
  # Original Java application and staged Java compiler architecture
tests/
  # Java regression tests
```

The Java and Node.js implementations are deliberately kept side by side during migration. The Node.js web app is independently deployable and does not require a JVM.
