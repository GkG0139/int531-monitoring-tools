package exceptions;

public class TextCannotBeBlankException extends RuntimeException {
    public TextCannotBeBlankException(String message) {
        super(message);
    }
}
