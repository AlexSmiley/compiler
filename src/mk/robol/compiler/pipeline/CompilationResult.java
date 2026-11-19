package mk.robol.compiler.pipeline;
import java.util.ArrayList;import java.util.Collections;import java.util.List;import mk.robol.compiler.ast.Ast.Program;import mk.robol.compiler.diagnostics.Diagnostic;
public final class CompilationResult {
 private final Program program;private final String code;private final List<Diagnostic> diagnostics;
 public CompilationResult(Program p,String c,List<Diagnostic>d){if(d==null)throw new IllegalArgumentException("Diagnostics required");program=p;code=c;diagnostics=Collections.unmodifiableList(new ArrayList<Diagnostic>(d));}
 public Program getProgram(){return program;}public String getGeneratedCode(){return code;}public List<Diagnostic> getDiagnostics(){return diagnostics;}
 public boolean hasErrors(){for(Diagnostic d:diagnostics)if(d.isError())return true;return false;}public boolean isSuccessful(){return !hasErrors()&&code!=null;}
}