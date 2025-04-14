class Stack {
  constructor() {
      this.items = [];  // Initialize an empty array to hold stack elements
  }

  // Add an element to the top of the stack (O(1))
  push(element) {
      this.items.push(element);
  }

  // Remove and return the top element of the stack (O(1))
  pop() {
      if (this.isEmpty()) {
          console.log("Stack is empty!");
          return null;
      }
      return this.items.pop();
  }

  // Return the top element without removing it (O(1))
  peek() {
      if (this.isEmpty()) {
          console.log("Stack is empty!");
          return null;
      }
      return this.items[this.items.length - 1];
  }

  // Check if the stack is empty (O(1))
  isEmpty() {
      return this.items.length === 0;
  }

  // Return the size of the stack (O(1))
  size() {
      return this.items.length;
  }

  // Clear the stack (O(1))
  clear() {
      this.items = [];
  }

  // Print the stack elements (O(n))
  print() {
      console.log(this.items.join(" -> "));
  }

  toArray(){
    return this.items;
  }
}

export default Stack

// //Example usage
// const stack = new Stack();
// stack.push(10);
// stack.push(20);
// stack.push(30);

// console.log("Top element:", stack.peek());   // Output: 30
// console.log("Stack size:", stack.size());    // Output: 3

// stack.print();                               // Output: 10 -> 20 -> 30

// console.log("Popped:", stack.pop());         // Output: 30
// stack.print();                               // Output: 10 -> 20

// console.log("Is Empty?", stack.isEmpty());   // Output: false
// stack.clear();
// console.log("Is Empty after clearing?", stack.isEmpty());  // Output: true
