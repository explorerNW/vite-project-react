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
        numb1 = Array(numb2.length - numb1.length).fill(0).toString().replace(/,/g, '') + numb1;
    } else {
        numb2 = Array(numb1.length - numb2.length).fill(0).toString().replace(/,/g, '') + numb2;
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