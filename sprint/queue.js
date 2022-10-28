class Queue {
	constructor() {
		this.items = [];
		this.lowestCount = 0;
		this.count = 0;
	}

	// Adds element to the queue
	enqueue(element) {
		this.items[this.count] = element;
		this.count++;
	}

	// Returns element from the queue (FIFO)
	dequeue() {
		if (this.isEmpty()) {
			return undefined;
		}
		let result = this.items[this.lowestCount];
		delete this.items[this.lowestCount];
		this.lowestCount++;
		return result;
	}

	// Returns true or false depending on if the queue is empty
	isEmpty() {
		return this.count - this.lowestCount === 0 ? true : false;
	}

	// Returns (but doesn't remove) the element from the queue
	peek() {
		return this.items[this.lowestCount];
	}

	// Returns a count of all elements in the queue
	size() {
		return this.count - this.lowestCount;
	}

	// Removes all elements from the queue
	clear() {
		this.count = 0;
		this.items = [];
		this.lowestCount = 0;
	}

	// Returns a string representation of the queue
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

function handleQueue(records) {
	// This function is called when the user chooses '2' as the data structure ID they'd
	// like to receive the data from. Only the records that have a data structure ID of 2
	// will be passed to this function - Which will then be used to create a queue.

	// Queues operate in a FIFO (First In First Out) manner, so this function will return
	// the oldest record with a structure ID of 2.

	// Create a new queue
	var queueObject = new Queue();

	// Loop through the records and add them to the queue. Our records are stored in the same
	// order they were submitted. Therefore, we can just iterate through the records and
	// add them to the queue in the order.
	for (let i in records) {
		queueObject.enqueue(JSON.stringify(records[i]));
	}

	// Some error handling - If the queue is empty, this returns null, which is caught by
	// an if-statement in app.js that will return an error message to the user.
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
