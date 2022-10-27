//1. Enqueue 2. Dequeue 3. Peek() 4.isEmpty 5. size()
class Queue {
	constructor() {
		this.items = [];
		this.lowestCount = 0;
		this.count = 0;
	}
	enqueue(element) {
		this.items[this.count] = element;
		this.count++;
	}
	dequeue() {
		if (this.isEmpty()) {
			return undefined;
		}
		let result = this.items[this.lowestCount];
		delete this.items[this.lowestCount];
		this.lowestCount++;
		return result;
	}
	isEmpty() {
		return this.count - this.lowestCount === 0 ? true : false;
	}
	peek() {
		return this.items[this.lowestCount];
	}
	size() {
		return this.count - this.lowestCount;
	}
	clear() {
		this.count = 0;
		this.items = [];
		this.lowestCount = 0;
	}
	toString() {
		if (this.isEmpty()) {
			return "";
		}
		let objString = `${this.items[this.lowestCount]}`;
		for (let i = this.lowestCount + 1; i < this.count; i++) {
			objString = `${objString},${this.items[i]}`;
		}
		return objString;
	}
}

class Dequeue {
	constructor() {
		this.count = 0;
		this.lowestCount = 0;
		this.items = {};
	}
	addFront(element) {}
	addBack() {}
	removeFront() {}
	removeBack() {}
	peekFront() {}
	peekBack() {}
}

function handleQueue(records) {
	console.log("Queue function executed.");

	// This function will return the most recent message
	var queueObject = new Queue();

	for (var i in records) {
		queueObject.enqueue(JSON.stringify(records[i]));
	}

	if (queueObject.isEmpty()) {
		console.log("Queue is empty.");
		return null;
	} else {
		return queueObject.dequeue();
	}
}

module.exports = {
	handleQueue,
};
