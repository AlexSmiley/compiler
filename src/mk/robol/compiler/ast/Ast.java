package mk.robol.compiler.ast;
import java.util.ArrayList;import java.util.Collections;import java.util.List;import mk.robol.compiler.diagnostics.Diagnostic.Span;
/** Small immutable AST model. Concrete parser nodes can be added without changing pipeline contracts. */
public final class Ast {
 private Ast(){}
 public interface Node { Span getSpan(); }
 public interface Statement extends Node {}
 public interface Expression extends Node {}
 public static final class Program implements Node {private final List<Statement> statements;private final Span span;public Program(List<Statement>s,Span p){if(s==null)throw new IllegalArgumentException("Statements required");statements=Collections.unmodifiableList(new ArrayList<Statement>(s));span=p;}public List<Statement> getStatements(){return statements;}public Span getSpan(){return span;}}
 public static final class Command implements Statement {private final String name;private final Span span;public Command(String n,Span s){if(n==null||n.trim().isEmpty())throw new IllegalArgumentException("Command required");name=n;span=s;}public String getName(){return name;}public Span getSpan(){return span;}}
 public static final class Assignment implements Statement {private final String name;private final Expression value;private final Span span;public Assignment(String n,Expression v,Span s){if(n==null||n.trim().isEmpty()||v==null)throw new IllegalArgumentException("Assignment target and value required");name=n;value=v;span=s;}public String getName(){return name;}public Expression getValue(){return value;}public Span getSpan(){return span;}}
 public static final class Literal implements Expression {private final String value;private final Span span;public Literal(String v,Span s){if(v==null)throw new IllegalArgumentException("Value required");value=v;span=s;}public String getValue(){return value;}public Span getSpan(){return span;}}
 public static final class Variable implements Expression {private final String name;private final Span span;public Variable(String n,Span s){if(n==null||n.trim().isEmpty())throw new IllegalArgumentException("Name required");name=n;span=s;}public String getName(){return name;}public Span getSpan(){return span;}}
 public static final class Binary implements Expression {private final Expression left,right;private final String operator;private final Span span;public Binary(Expression l,String o,Expression r,Span s){if(l==null||r==null||o==null||o.trim().isEmpty())throw new IllegalArgumentException("Operands and operator required");left=l;operator=o;right=r;span=s;}public Expression getLeft(){return left;}public String getOperator(){return operator;}public Expression getRight(){return right;}public Span getSpan(){return span;}}
}