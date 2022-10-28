class Stack {
	constructor() {
		this.items = [];
		this.count = 0;
	}

	// Adds elements to the top of the stack
	push(element) {
		this.items[this.count] = element;
		// console.log(`${element} added to the position ${this.count}`)
		this.count += 1;
		return this.count - 1;
	}

	// Returns (and removes) the top element from the stack
	pop() {
		if (this.count == 0) {
			return undefined;
		}
		let deleteItem = this.items[this.count - 1];
		this.count -= 1;
		// console.log(`${deleteItem} deleted from stack`)
		return deleteItem;
	}

	// Returns (but doesn't remove) the top element from the stack
	peek() {
		console.log(`Top element is ${this.items[this.count - 1]}`);
		return this.items[this.count - 1];
	}

	// Returns true or false depending on if the stack is empty
	isEmpty() {
		return this.count == 0 ? true : false;
	}

	// Returns a count of all elements in the stack
	size() {
		console.log(`${this.count} elements in stack`);
		return this.count;
	}

	// Removes all elements from the stack
	clear() {
		this.items = [];
		this.count = 0;
	}

	// Returns a string representation of the stack
	toString() {
		if (this.isEmpty) {
			return "";
		}
		let objString = `${this.items[0]}`;
		for (let i = 1; i < this.count; i++) {
			objString = `${objString}, ${this.items[i]}`;
		}
		return objString;
	}
}

function handleStack(records) {
	// This function is called when the user chooses '1' as the data structure ID they'd
	// like to receive the data from. Only the records that have a data structure ID of 1
	// will be passed to this function - Which will then be used to create a stack.

	// Stacks operate in a LIFO (Last In First Out) manner, so this function will return
	// the most recent record with a structure ID of 1.
	const stackObject = new Stack();

	// Our records are stored by their message_id by default, and message_id increments
	// automatically whenever a new record is added - so they are in the same order they
	// were submitted. Therefore, we can just iterate through the records and push them
	// onto the stack.
	for (let i in records) {
		stackObject.push(JSON.stringify(records[i]));
	}

	// Now to return the most recent message in the stack to the user we can pop the top
	// element off the stack and return it.
	if (stackObject.isEmpty()) {
		console.log("Stack is empty.");
		return null;
	} else {
		return stackObject.pop();
	}
}

module.exports = {
	handleStack,
};
