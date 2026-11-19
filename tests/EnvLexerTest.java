import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.Test;

public class EnvLexerTest {

    @Test
    public void environmentLexerInstancesDoNotShareTokens() throws Exception {
        Path source = Files.createTempFile("robol-environment", ".env");
        Path empty = Files.createTempFile("robol-environment-empty", ".env");
        try {
            Files.write(source, "робот".getBytes(StandardCharsets.UTF_8));

            EnvLexer populated = new EnvLexer(source.toString());
            EnvLexer clean = new EnvLexer(empty.toString());

            assertEquals(1, populated.getLista().size());
            assertTrue(clean.getLista().isEmpty());
        } finally {
            Files.deleteIfExists(source);
            Files.deleteIfExists(empty);
        }
    }
}
