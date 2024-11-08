export function findItemOfSum(array: number[], target: number) {
    const map = new Map();
    const result = [];
    for (let i = 0; i < array.length; i++) {
        const left = target - array[i];
        if (map.has(left)) {
            result.push([array[map.get(left)], array[i]]);
        } else {
            map.set(array[i], i);
        }
    }

    return result;
}

export function addTowNumbers(numb1: string, numb2: string) {
    const maxlength = Math.max(numb1.length, numb2.length);
    if (numb1.length < numb2.length) {
        numb1 =
            Array(numb2.length - numb1.length)
                .fill(0)
                .toString()
                .replace(/,/g, '') + numb1;
    } else {
        numb2 =
            Array(numb1.length - numb2.length)
                .fill(0)
                .toString()
                .replace(/,/g, '') + numb2;
    }
    let upAdd = 0;
    const result = [];
    for (let i = maxlength - 1; i > -1; i--) {
        let temp = Number(numb1[i] || 0) + Number(numb2[i] || 0) + upAdd;
        if (temp > 9) {
            upAdd = 1;

            temp -= 10;
        } else {
            upAdd = 0;
        }
        result.unshift(temp);
    }
    if (upAdd > 0) {
        result.unshift(upAdd);
    }

    return result.toString().replace(/,/g, '');
}

export function lengthOfLongestSubstring(s: string): number {
    const pre: number[] = [];
    let [sofar, end] = [0, 0];

    for (let i = 0; i < s.length; i++) {
        const ascii = s[i].charCodeAt(0);
        const last = pre[ascii] ?? -1;
        end = last + end >= i ? i - last : end + 1;

        sofar = Math.max(sofar, end);
        pre[ascii] = i;
    }

    return sofar;
}

export function maxLenghtOfOne(list: number[]) {
    let temp = [];
    for (let i = 0; i < list.length; i++) {
        if (list[i + 1] === list[i] || i === list.length - 1) {
            temp.push(i);
        } else {
            temp = [];
        }
    }

    return temp;
}

export function moveZero(numbers: number[]) {
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] === 0) {
            numbers.push(numbers[i]);
            if (numbers[i - 1] !== undefined) {
                numbers = numbers.slice(0, i).concat(numbers.slice(i + 1));
            } else {
                numbers = numbers.slice(i + 1);
            }
        }
    }

    return numbers;
}

export function removeDuplicate(numbers: number[]) {
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i + 1] !== undefined) {
            if (numbers[i] === numbers[i + 1]) {
                numbers = numbers.slice(0, i + 1).concat(numbers.slice(i + 2));
            }
        } else {
            if (numbers.find(number => number === numbers[i]) === numbers[i]) {
                numbers = numbers.slice(0, i);
            }
        }
    }

    return numbers;
}
