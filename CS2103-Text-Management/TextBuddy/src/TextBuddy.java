import java.util.ArrayList;
import java.util.Collections;
import java.util.Scanner;
import java.io.*;

/**
 * This class is used to manipulate text in a file.
 * When the file name is given, a new file will be created no matter if it has been existed.
 * The file will be updated only when you exit the program.
 * The command format is given by the example interaction below:
 
 Welcome to TextBuddy. kunn.txt is ready for use
 Enter command: add life is short
 Added to kunn.txt: life is short
 Enter command: add when you have teeth
 Added to kunn.txt: when you have teeth
 Enter command: display
 1: life is short
 2: when you have teeth  

 Enter command: add smile ...
 Added to kunn.txt: smile ...
 Enter command: display
 1: life is short
 2: when you have teeth
 3: smile ...

 Enter command: delete 2
 Deleted from kunn.txt: when you have teeth
 Enter command: display
 1: life is short
 2: smile ...

 Enter command: add when you have teeth
 Added to kunn.txt: when you have teeth
 Enter command: display
 1: life is short
 2: smile ...
 3: when you have teeth

 Enter command: clear
 All content deleted from kunn.txt
 Enter command: display
 kunn.txt is empty!!
 Enter command: exit
 See you later!!!
 */
public class TextBuddy {
	// Messages could be shown to user. Magic strings.
	private static final String MESSAGE_WELCOME = "Welcome to TextBuddy. %1$s is ready for use";	
	private static final String MESSAGE_ADDED = "Added to %1$s: %2$s";
	private static final String MESSAGE_DELETED = "Deleted from %1$s: %2$s";
	private static final String MESSAGE_CLEARED = "All content deleted from %1$s";
	private static final String MESSAGE_INVALID_FORMAT = "Invalid command format :%1$s";
	private static final String MESSAGE_EMPTY_FILE = "%1$s is empty!!";
	private static final String MESSAGE_GOODBYE = "See you later!!!";
	private static final String MESSAGE_ENTER = "Enter command: ";
	private static final String MESSAGE_SORTED = "All content was sorted";
	private static final String MESSAGE_SEARCH_NO_RESULT = "No line includes word %1$s";
	
	
	// Magic numbers
	private static final int ERROR_CODE = -1;
	private static final int FIRST_ELEMENT = 0;
	
	// These are the possible command types
	enum CommandType {
		ADD_TEXT, DELETE_TEXT, DISPLAY, CLEAR_TEXT, INVALID, EXIT, SORT, SEARCH
	};

	private static Scanner scanner = new Scanner(System.in);
	private static PrintWriter printer;
	
	/**
	 * Content will be stored in lines.
	 * fileName is the name of the manipulated file. 
	 */
	private static ArrayList<String> lines = new ArrayList<String>();
	private static String fileName;
	
	public static void main(String[] args) {
		fileName = args[FIRST_ELEMENT];
		createFile(fileName);
		interactWithUser();
	}
	
	/** This function will read the command and give feedback to user */
	public static void interactWithUser() {
		showToUserWithNewLine(String.format(MESSAGE_WELCOME, fileName));
		while (true) {
			showToUser(MESSAGE_ENTER);
			String userCommand = enterCommand();
			String feedback = executeCommand(userCommand);
			showToUserWithNewLine(feedback);
		}
	}
	
	public static String enterCommand() {
		return scanner.nextLine();
	}
	
	/** This function is to display text/ feedback to user */
	public static void showToUser(String text) {
		System.out.print(text);
	}
	
	public static void showToUserWithNewLine(String text) {
		System.out.println(text);
	}
	
	/** This function is to process the user command */
	public static String executeCommand(String userCommand) {
		if (userCommand.trim().equals(""))
			return String.format(MESSAGE_INVALID_FORMAT, userCommand);
		
		String commandTypeString = getFirstWord(userCommand);
		CommandType commandType = determineCommandType(commandTypeString);

		switch (commandType) {
		case ADD_TEXT:
			return addText(userCommand);
		case DELETE_TEXT:
			return deleteText(userCommand);
		case DISPLAY:
			return display(userCommand);
		case CLEAR_TEXT:
			return clearText(userCommand);
		case SORT:
			return sortText(userCommand);
		case SEARCH:
			return searchText(userCommand);
		case INVALID:
			return String.format(MESSAGE_INVALID_FORMAT, userCommand);
		case EXIT: {
			exitTextBuddy();
		}
		default:
			throw new Error("Unrecognized command type");
		}
	}
	
	/**
	 * This operation determines which of the supported command types the user
	 * wants to perform
	 */
	private static CommandType determineCommandType(String commandTypeString) {
		if (commandTypeString == null)
			throw new Error("command type string cannot be null!");

		if (commandTypeString.equalsIgnoreCase("add")) {
			return CommandType.ADD_TEXT;
		} else if (commandTypeString.equalsIgnoreCase("delete")) {
			return CommandType.DELETE_TEXT;
		} else if (commandTypeString.equalsIgnoreCase("display")) {
			return CommandType.DISPLAY;
		} else if (commandTypeString.equalsIgnoreCase("clear")) {
			return CommandType.CLEAR_TEXT;
		} else if (commandTypeString.equalsIgnoreCase("sort")) {
			return CommandType.SORT;
		} else if (commandTypeString.equalsIgnoreCase("search")) {
			return CommandType.SEARCH;
		} else if (commandTypeString.equalsIgnoreCase("exit")) {
			return CommandType.EXIT;
		} else {
			return CommandType.INVALID;
		}
	}
	
	/** This function is to add a line to file */
	private static String addText(String userCommand) {
		String text = removeFirstWord(userCommand);
		lines.add(text);
		return String.format(MESSAGE_ADDED, fileName, text);
	}
	
	/** This function is to delete a line of file */
	private static String deleteText(String userCommand) {
		int lineToDelete = determindLineToDelete(userCommand);
		if (lineToDelete == ERROR_CODE) {
			return String.format(MESSAGE_INVALID_FORMAT, userCommand);
		}
		String text = lines.get(lineToDelete);
		lines.remove(lineToDelete);
		return String.format(MESSAGE_DELETED, fileName, text);
	}
	
	/** This function is to extract the information from the command */
	private static int determindLineToDelete(String userCommand) {
		String stringType = removeFirstWord(userCommand);
		try {
			return Integer.parseInt(stringType) - 1;	
		} catch (NumberFormatException e) {
			return ERROR_CODE;		//		cannot parse, this is an invalid command
		}
	}
	
	/** This function is to display all the content of file */
	private static String display(String userCommand) {
		String feedback = "";
		for (int i = 0; i < lines.size(); i ++) {
			feedback += (i+1) + ": " + lines.get(i) + "\n";
		}
		if (lines.isEmpty()) {
			return String.format(MESSAGE_EMPTY_FILE, fileName);
		} else {
			return feedback;
		}
	}
	
	/** This function is to delete all the content of file */
	private static String clearText(String userCommand) {
		lines.clear();
		return String.format(MESSAGE_CLEARED, fileName);
	}
	
	/** This function is to sort all the content */
	private static String sortText(String userCommand) {
		Collections.sort(lines);
		return MESSAGE_SORTED;
	}
	
	/** This function is to search for lines include some words*/
	private static String searchText(String userCommand) {
		String result = "";
		String[] words = splitParameters(removeFirstWord(userCommand));
		
		for (int i = 0; i < lines.size(); i ++) {
			String line = lines.get(i);
			boolean flag = false;
			
			for (int j = 0; j < words.length; j ++) {  
				if (line.contains(words[j])) {
					flag = true; 
				}
			}
			
			if (flag) {
				result += (i + 1) + ": " + line + "\n";
			}
		}
		
		if (result.equals("")) {
			return String.format(MESSAGE_SEARCH_NO_RESULT, removeFirstWord(userCommand));
		}
		return result;
	}
	
	/** This is to exit the program and write content to file*/
	private static void exitTextBuddy() {
		showToUser(MESSAGE_GOODBYE);
		for (int i = 0; i < lines.size(); i ++) {
			printer.println(lines.get(i));
		}
		closeFile();
		System.exit(0);
	}
	
	public static void createFile(String fileName) {
		try {
			printer = new PrintWriter(fileName);
		} catch(FileNotFoundException e) {
			System.out.println(e.getMessage());
		}
	}
	
	public static void closeFile() {
		printer.close();
	}
	
	/** This is to extract the information of the command */
	private static String removeFirstWord(String userCommand) {
		return userCommand.replace(getFirstWord(userCommand), "").trim();
	}

	/** This is to extract the code of the command */
	private static String getFirstWord(String userCommand) {
		String commandTypeString = userCommand.trim().split("\\s+")[FIRST_ELEMENT];
		return commandTypeString;
	}
	
	private static String[] splitParameters(String commandParametersString) {
		String[] parameters = commandParametersString.trim().split("\\s+");
		return parameters;
	}
}
