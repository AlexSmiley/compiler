# RoboL Compiler

RoboL is an educational compiler project for a Macedonian-keyword programming language. The application combines a Swing-based editor with a compiler pipeline and a small robot-world simulator.

## What is included

- **RoboL source lexer** – recognizes Macedonian keywords, identifiers, numeric literals, operators and punctuation.
- **Predictive parser** – uses grammar productions and a parse table to validate RoboL programs.
- **Semantic checks** – tracks variables and procedures and reports declaration/type/argument errors.
- **RIMAL code generation** – translates accepted RoboL token streams into the project's RIMAL-like instruction format.
- **Environment parser and lexer** – reads the robot-world description (dimensions, walls, tokens and robot position).
- **Swing UI and animation** – provides the desktop editor and visual robot simulation.

The original language implementation and sample programs are retained. The current refactoring deliberately avoids changing the language grammar or generated instruction semantics.

## Requirements

- JDK 8 or newer
- Apache Maven 3.8+

## Build and test

From the repository root:

```bash
mvn clean test
mvn package
```

The Maven build compiles the existing Java sources in `src/` and runs the regression tests in `tests/`.

## Run the desktop application

The legacy UI loads its sample programs and image assets from the working directory. Build first, then run with `src/` as the working directory:

**Linux / macOS**

```bash
cd src
java -cp ../target/classes Applikacija
```

**Windows PowerShell**

```powershell
Set-Location src
java -cp ..\target\classes Applikacija
```

Keep the terminal open while using the application. Generated files such as `rimal.rml` and `greski.txt` are written relative to the working directory.

## Repository layout

```text
.
├── src/                 # Existing compiler, parser, UI, simulator and sample assets
├── tests/               # Automated regression tests
├── .github/workflows/   # Continuous integration
├── pom.xml              # Maven build
└── README.md
```

## Notes on the modernization

This first refactoring step establishes a reproducible build, automated checks and clearer project documentation without a risky all-at-once rewrite of the legacy parser and GUI. Lexer token collections are now instance-scoped, so creating a second lexer no longer reuses tokens left by a previous compilation. Empty input is handled safely by the RoboL lexer.

Further work should extract the compiler stages behind small interfaces, replace stringly-typed token kinds with an enum, introduce structured diagnostics with source spans, and isolate robot-world state from static fields.

## Language and sample files

The language examples and simulator assets are kept under `src/`. The source files use UTF-8 and include Macedonian Cyrillic keywords. Preserve UTF-8 when editing or processing them.
