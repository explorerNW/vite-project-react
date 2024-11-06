export class ListNode {
    value;
    next: ListNode | null;
    constructor(value: number = 0, next: ListNode | null = null) {
        this.value = value;
        this.next = next || null;
    }
    
    of(array: number[]) {
       const head = new ListNode();
       let tial = head;

       array.forEach((value)=>{
            const node = new ListNode(value);
            tial.next = node;
            tial = tial.next;
       });

       return head.next;
    }
}

export function lengthOfLongestSubstring( s: string ): number {

    const pre: number[] = [];
    let [sofar, end] = [0,0];
  
    for( let i = 0; i < s.length; i++ ){
      const ascii = s[i].charCodeAt( 0 );
      const last = pre[ascii] ?? -1;
      end = last + end >= i ? ( i - last ) : ( end + 1 );
  
      sofar = Math.max( sofar, end );
      pre[ascii] = i;
    }
  
    return sofar;
  }