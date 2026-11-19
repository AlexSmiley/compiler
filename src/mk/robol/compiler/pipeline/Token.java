package mk.robol.compiler.pipeline;
import mk.robol.compiler.diagnostics.Diagnostic.Span;
public final class Token {
 public enum Kind { KEYWORD, IDENTIFIER, INTEGER, STRING, OPERATOR, PUNCTUATION, UNKNOWN, EOF }
 private final Kind kind;private final String lexeme;private final Span span;
 public Token(Kind k,String l,Span s){if(k==null||l==null)throw new IllegalArgumentException("Token kind and lexeme required");kind=k;lexeme=l;span=s;}
 public Kind getKind(){return kind;}public String getLexeme(){return lexeme;}public Span getSpan(){return span;}
}