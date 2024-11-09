class LinkNode<T> {
	value: T | null = null;
	next: LinkNode<T> | null = null;

	constructor(value: T | null = null) {
		this.value = value;
	}
}

export class LinkedList<T> {
	head: LinkNode<T> | null = null;

	insertToTail(value: T) {
		const node = new LinkNode(value);
		if (!this.head) {
			this.head = node;
		} else {
			let current = this.head;
			while (current && current.next) {
				current = current.next;
			}
			current.next = node;
		}
	}

	insertToSpecificPostion(value: T, position: number) {
		const node = new LinkNode<T>(value);
		if (!this.head) {
			this.head = node;
		}
		let current = this.head;
		let index = 0;
		let previous = new LinkNode<T>(value);
		while (current && current.next && index < position) {
			previous.next = current;
			previous = previous.next;
			current = current.next;
			index++;
		}

		if (!current) {
			return { error: 'position out of scope' };
		}

		node.next = current;
		previous.next = node;

		return this.head;
	}

	removeSpecificPosition(position: number) {
		if (!this.head) {
			return { error: 'none' };
		}

		let current = this.head;
		let index = 0;
		let previous = new LinkNode<T>();
		if (position === 0) {
			this.head = current.next;
			return this.head;
		}
		while (current.next && index < position) {
			previous.next = current;
			previous = previous.next;
			current = current.next;
			index++;
		}

		if (!current.next) {
			return { error: 'position out of scope' };
		}

		previous.next = current.next;
		return this.head;
	}
}

class DoubleLinkNode<T> {
	value: T | null = null;
	previous: DoubleLinkNode<T> | null = null;
	next: DoubleLinkNode<T> | null = null;
	constructor(value: T | null = null) {
		this.value = value;
	}
}

export class DoubleLinkedList<T> {
	head: DoubleLinkNode<T> | null = null;
	tail: DoubleLinkNode<T> | null = null;

	insert(value: T) {
		const node = new DoubleLinkNode(value);
		if (!this.head) {
			this.head = node;
			this.tail = this.head;
		}

		this.tail!.next = node;
		node.previous = this.tail;
		this.tail = node;
	}

	removeBySpecificPosition(position: number) {
		let current = this.head;
		let index = 0;
		if (position === 0 && this.head && current) {
			this.head = current.next;
			return;
		}
		while (current && index < position) {
			current = current.next;
			index++;
		}

		if (current) {
			if (current.previous) {
				current.previous.next = current.next;
			} else {
				this.tail = current.previous;
			}
		}
	}
}

export class TreeNode<T> {
	value: T | null = null;
	children: TreeNode<T>[] = [];
	constructor(value: T | null = null) {
		this.value = value;
	}

	insertChildNode(node: TreeNode<T>) {
		this.children.push(node);
	}

	deleteChildNode(value: T) {
		this.children = this.children.filter(node => node.value !== value);
	}

	travelDFS(callback: (node: TreeNode<T>) => void) {
		callback(this);
		for (const children of this.children) {
			children.travelDFS(callback);
		}
	}

	BFS(callback: (node: TreeNode<T>) => void, root: TreeNode<T>) {
		const queue = new Queue<TreeNode<T>>();
		queue.enqueue(root);
		while (!queue.isEmpty()) {
			const currentNode = queue.dequeue();
			if (currentNode !== undefined) {
				callback(currentNode);
				for (const node of currentNode.children) {
					queue.enqueue(node);
				}
			}
		}
	}
}

export class Tree<T> {
	root: TreeNode<T> | null = null;
	constructor(value: T | null = null) {
		this.root = new TreeNode(value);
	}

	setRoot(value: T) {
		if (!this.root) {
			this.root = new TreeNode(value);
		}
		if (this.root.value === null) {
			this.root.value = value;
		}
	}

	travelDFS(callback: (node: TreeNode<T>) => void) {
		this.root?.travelDFS(callback);
	}

	travelBFS(callback: (node: TreeNode<T>) => void) {
		this.root?.BFS(callback, this.root);
	}
}

class Queue<T> {
	channel: T[] = [];

	enqueue(node: T) {
		this.channel.push(node);
	}

	dequeue(): T {
		return this.channel.shift() as T;
	}

	isEmpty() {
		return this.channel.length === 0;
	}
}

class BinaryTreeNode<T> {
	value: T;
	left: BinaryTreeNode<T> | null = null;
	right: BinaryTreeNode<T> | null = null;

	constructor(value: T) {
		this.value = value;
	}
}

export class BinaryTree<T> {
	root: BinaryTreeNode<T> | null = null;

	constructor(value?: T) {
		if (value !== undefined) {
			this.root = new BinaryTreeNode<T>(value);
		}
	}

	add(value: T) {
		if (this.root === null) {
			this.root = new BinaryTreeNode(value);
		} else {
			this.insertNode(this.root, value);
		}
	}

	insertNode(node: BinaryTreeNode<T>, value: T) {
		if (node.left === null && value < node.value) {
			node.left = new BinaryTreeNode(value);
		} else if (node.right === null && value > node.value) {
			node.right = new BinaryTreeNode(value);
		} else {
			if (node.left && value < node.value) {
				this.insertNode(node.left, value);
			} else {
				if (node.right) {
					this.insertNode(node.right, value);
				}
			}
		}
	}

	search(value: T) {
		if (this.root) {
			return this.$Search(value, this.root);
		} else {
			return { error: 'empty tree' };
		}
	}

	private $Search(
		value: T,
		node: BinaryTreeNode<T> | null
	): BinaryTreeNode<T> | null {
		if (node === null) {
			return null;
		}

		if (node < node.value) {
			return this.$Search(value, node.left);
		} else if (value > node.value) {
			return this.$Search(value, node.right);
		} else {
			return node;
		}
	}

	removeNode(value: T) {
		return this.$removeNode(value, this.root);
	}

	private $removeNode(
		value: T,
		node: BinaryTreeNode<T> | null
	): BinaryTreeNode<T> | null {
		if (node === null) {
			return null;
		}
		if (value < node.value) {
			node.left = this.$removeNode(value, node.left);
			return node;
		} else if (value > node.value) {
			node.right = this.$removeNode(value, node.right);
			return node;
		} else {
			if (node.left === null && node.right === null) {
				node = null;
				return node;
			}
			if (node.left === null) {
				node = node.right;
				return node;
			}

			if (node?.right === null) {
				node = node.left;
				return node;
			}

			const aux = this.findMinNode(node.right);
			node.value = aux.value;
			node.right = this.$removeNode(aux.value, node.right);

			return node;
		}
	}

	findMinNode(node: BinaryTreeNode<T>) {
		let current = node;
		while (current && current.left) {
			current = current.left;
		}

		return current;
	}

	RLR(callback: (node: BinaryTreeNode<T>) => void) {
		if (this.root) {
			this.$RLR(this.root, callback);
		}
	}

	private $RLR(
		tree: BinaryTreeNode<T>,
		callback: (node: BinaryTreeNode<T>) => void
	): void {
		callback(tree);
		if (tree.left) {
			this.$RLR(tree.left, callback);
		}
		if (tree.right) {
			this.$RLR(tree.right, callback);
		}
	}

	LRR(callback: (node: BinaryTreeNode<T>) => void) {
		if (this.root) {
			this.$LRR(this.root, callback);
		}
	}

	private $LRR(
		tree: BinaryTreeNode<T>,
		callback: (node: BinaryTreeNode<T>) => void
	): void {
		if (tree.left) {
			this.$LRR(tree.left, callback);
		}
		callback(tree);
		if (tree.right) {
			this.$LRR(tree.right, callback);
		}
	}

	RRL(callback: (node: BinaryTreeNode<T>) => void) {
		if (this.root) {
			this.$RRL(this.root, callback);
		}
	}

	private $RRL(
		tree: BinaryTreeNode<T>,
		callback: (node: BinaryTreeNode<T>) => void
	): void {
		if (tree.right) {
			this.$RRL(tree.right, callback);
		}
		callback(tree);
		if (tree.left) {
			this.$RRL(tree.left, callback);
		}
	}
}

class AVLTreeNode<T> {
	value: T;
	left: AVLTreeNode<T> | null = null;
	right: AVLTreeNode<T> | null = null;
	height: number = 0;

	constructor(value: T) {
		this.value = value;
	}

	updateHeight() {
		this.height =
			1 +
			Math.max(
				this.left ? this.left.height : 0,
				this.right ? this.right.height : 0
			);
	}

	getBalanceFactor() {
		return (
			(this.left ? this.left.height : 0) - (this.right ? this.right.height : 0)
		);
	}
}

export class AVLTree<T> {
	root: AVLTreeNode<T> | null = null;

	constructor() {}

	setRoot(value: T) {
		if (this.root === null) {
			this.root = new AVLTreeNode(value);
		}
	}

	addNode(value: T) {
		this.root = this.$addNode(this.root, value);
	}

	private $addNode(node: AVLTreeNode<T> | null, value: T) {
		if (node === null) {
			return new AVLTreeNode(value);
		}

		if (value < node.value) {
			node.left = this.$addNode(node.left, value);
		} else if (value > node.value) {
			node.right = this.$addNode(node.right, value);
		} else {
			return node;
		}

		node.updateHeight();

		return this.balanceNode(node);
	}

	private balanceNode(node: AVLTreeNode<T>) {
		const balanceFactor = node.getBalanceFactor();
		if (balanceFactor > 1) {
			if (node.left && node.left.getBalanceFactor() < 0) {
				this.rotateLeft(node.left);
			}

			this.rotateRight(node);
		} else if (balanceFactor < -1) {
			if (node.right && node.right.getBalanceFactor() < 0) {
				this.rotateRight(node.right);
			}

			this.rotateLeft(node);
		}

		return node;
	}

	private rotateLeft(node: AVLTreeNode<T>) {
		const rightChild = node.right;
		node.right = rightChild?.left || null;
		if (rightChild) {
			rightChild.left = node;
		}
		rightChild?.updateHeight();

		return rightChild;
	}

	private rotateRight(node: AVLTreeNode<T>) {
		const leftChild = node.left;
		node.left = leftChild?.left || null;
		if (leftChild) {
			leftChild.left = node;
		}

		leftChild?.updateHeight();

		return leftChild;
	}

	LRR(callback: (node: AVLTreeNode<T>) => void) {
		if (this.root) {
			this.$LRR(this.root, callback);
		}
	}

	private $LRR(node: AVLTreeNode<T>, callback: (node: AVLTreeNode<T>) => void) {
		if (node.left) {
			this.$LRR(node.left, callback);
		}
		callback(node);
		if (node.right) {
			this.$LRR(node.right, callback);
		}
	}
}
