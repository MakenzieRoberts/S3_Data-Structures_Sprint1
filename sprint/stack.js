//1. push(), 2.pop(),3.peek(),4.isEmpty(),5.size() 6. clear().7.toString()

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

	isEmpty() {
		return this.count == 0 ? true : false;
	}

	size() {
		console.log(`${this.count} elements in stack`);
		return this.count;
	}

	clear() {
		this.items = [];
		this.count = 0;
	}
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
	console.log("Stack function executed.");
	// This function will return the most recent message

	const stackObject = new Stack();

	// Our records are stored by their message_id by default, so they are in the same
	// order they were submitted. Therefore, we can just iterate through the records and
	// push them onto the stack.
	for (var i in records) {
		stackObject.push(JSON.stringify(records[i]));
	}

	// Now to return the most recent message in the stack to the user we can just pop the
	// top element off the stack and return it.
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
