//1. push(), 2.pop(),3.peek(),4.isEmpty(),5.size() 6. clear().7.toString()

class Stack {
	constructor() {
		this.items = [];
		this.count = 0;
	}

	//arr = [2,3,4,5]
	//arr[2]=10
	//Adding an element to the stack
	push(element) {
		this.items[this.count] = element;
		// console.log(`${element} added to the position ${this.count}`)
		this.count += 1;
		return this.count - 1;
	}

	//Removing an element from the stack
	pop() {
		if (this.count == 0) {
			return undefined;
		}
		let deleteItem = this.items[this.count - 1];
		this.count -= 1;
		// console.log(`${deleteItem} deleted from stack`)
		return deleteItem;
	}

	//checking the element at the top of the stack
	peek() {
		console.log(`Top element is ${this.items[this.count - 1]}`);
		return this.items[this.count - 1];
	}

	isEmpty() {
		// console.log(this.count == 0 ? `stack is empty`: `stack is not Empty`);
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
	var stackObject = new Stack();

	for (var i in records) {
		stackObject.push(JSON.stringify(records[i]));
	}
	return stackObject.pop();
}

module.exports = {
	handleStack,
};
