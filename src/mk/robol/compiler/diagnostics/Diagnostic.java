package mk.robol.compiler.diagnostics;
/** Structured diagnostic with source coordinates; coordinates are one-based. */
public final class Diagnostic {
 public enum Severity { INFO, WARNING, ERROR }
 public static final class Position { public final int line,column; public Position(int line,int column){if(line<1||column<1)throw new IllegalArgumentException("Coordinates are one-based");this.line=line;this.column=column;} }
 public static final class Span { public final Position start,end; public Span(Position start,Position end){if(start==null||end==null)throw new IllegalArgumentException("Span endpoints required");if(end.line<start.line||(end.line==start.line&&end.column<start.column))throw new IllegalArgumentException("Invalid span");this.start=start;this.end=end;} }
 private final String code,message; private final Severity severity; private final Span span;
 public Diagnostic(String code,String message,Severity severity,Span span){if(code==null||code.trim().isEmpty()||message==null||severity==null)throw new IllegalArgumentException("Code, message and severity required");this.code=code;this.message=message;this.severity=severity;this.span=span;}
 public String getCode(){return code;} public String getMessage(){return message;} public Severity getSeverity(){return severity;} public Span getSpan(){return span;} public boolean isError(){return severity==Severity.ERROR;}
}