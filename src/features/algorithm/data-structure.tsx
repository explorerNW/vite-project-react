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
    this.children = this.children.filter((node) => node.value !== value);
  }

  travelDFS(callback: (node: TreeNode<T>) => void) {
    callback(this);
    for (const children of this.children) {
      children.travelDFS(callback);
    }
  }

  BFS(callback: (node: TreeNode<T>) => void, root: TreeNode<T>) {
    const queue = new Queue<TreeNode<T>>();
    queue.enquee(root);
    while (!queue.isEmpty) {
      const currentNode = queue.dequee();
      if (currentNode !== undefined) {
        callback(this);
        for (const node of currentNode.children) {
          queue.enquee(node);
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

  enquee(node: T) {
    this.channel.push(node);
  }

  dequee(): T {
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
    } else if (node.right === null) {
      node.right = new BinaryTreeNode(value);
    } else {
      if (node.left && value < node.value) {
        this.insertNode(node.left, value);
      } else {
        this.insertNode(node.right, value);
      }
    }
  }

}
