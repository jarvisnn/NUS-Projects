import static org.junit.Assert.*;

import org.junit.Test;


public class TextBuddyTest {

	@Test
	public void testExecuteCommand() {
		// making tests for sortText() method.
		TextBuddy.executeCommand("add hulk");
		TextBuddy.executeCommand("add iron man");
		TextBuddy.executeCommand("add black widow");
		assertEquals("All content was sorted", TextBuddy.executeCommand("sort"));
		assertEquals("1: black widow\n2: hulk\n3: iron man\n", TextBuddy.executeCommand("display"));
		TextBuddy.executeCommand("delete 2");
		TextBuddy.executeCommand("add captain america");
		assertEquals("All content was sorted", TextBuddy.executeCommand("sort"));
		assertEquals("1: black widow\n2: captain america\n3: iron man\n", TextBuddy.executeCommand("display"));
		
		// making test for searchText method.
		assertEquals("2: captain america\n", TextBuddy.executeCommand("search captain"));
		TextBuddy.executeCommand("add captain singapore");
		TextBuddy.executeCommand("add pirate king");
		TextBuddy.executeCommand("add hello captain");
		assertEquals("2: captain america\n4: captain singapore\n6: hello captain\n", TextBuddy.executeCommand("search captain"));
		TextBuddy.executeCommand("add hello vietnam");
		assertEquals("2: captain america\n4: captain singapore\n6: hello captain\n7: hello vietnam\n", TextBuddy.executeCommand("search captain hello"));
		assertEquals("No line includes word 2103", TextBuddy.executeCommand("search 2103"));
	}

}
