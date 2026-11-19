# RoboL Compiler

RoboL is an educational compiler for a Macedonian-keyword language, with a Swing editor and robot-world simulator.

## Requirements
- JDK 8+
- Apache Maven 3.8+

## Build and test
```bash
mvn clean test
mvn package
```

## Run
The legacy UI loads assets relative to its working directory. Run from `src/`:
```bash
cd src
java -cp ../target/classes Applikacija
```

## Modernization
The legacy grammar, parser, generator and Swing UI remain available. A new `mk.robol.compiler` migration boundary now contains:
- `diagnostics`: structured diagnostic codes, severity and source spans.
- `ast`: immutable program, command, assignment and expression nodes.
- `pipeline`: typed tokens and injected lexer/parser/semantic/code-generation phase contracts. The orchestrator stops after errors and only generates code for semantically valid programs.

The new pipeline is not yet wired to the legacy parser/generator. Their current implementations mix parsing, semantic checks, console output and code generation; adapting them safely requires separate grammar and RIMAL golden-file regression tests.

Robot-world map, dimensions, walls, tokens and player state are instance-owned by each `Matrica`. Map access returns a defensive copy so simulations do not share mutable grids.

Next steps: adapt the lexer to typed tokens, implement an AST-producing parser, move semantic checks into a dedicated pass, replace token-window generation with AST visitors, and move UI assets to classpath resources. Legacy classes remain in the default package during migration; keep source files UTF-8 encoded.
