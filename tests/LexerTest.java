import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.Test;

public class LexerTest {

    @Test
    public void lexerInstancesDoNotShareTokens() throws Exception {
        Path source = Files.createTempFile("robol-source", ".rbl");
        Path empty = Files.createTempFile("robol-empty", ".rbl");
        try {
            Files.write(source, "број".getBytes(StandardCharsets.UTF_8));

            Lexer populated = new Lexer(source.toString());
            Lexer clean = new Lexer(empty.toString());

            assertEquals(1, populated.getLista().size());
            assertTrue(clean.getLista().isEmpty());
            assertTrue(clean.imaGreski());
        } finally {
            Files.deleteIfExists(source);
            Files.deleteIfExists(empty);
        }
    }
}
