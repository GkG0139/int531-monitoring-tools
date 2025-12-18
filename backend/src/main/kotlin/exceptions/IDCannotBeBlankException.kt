package exceptions;

public class IDCannotBeBlankException extends RuntimeException {
    public IDCannotBeBlankException(String message) {
        super(message);
    }
}
