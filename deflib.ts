namespace deflib {
    export enum direction {
        //% block="앞"
        forward,
        //% block="뒤"
        backward,
        //% block="오른쪽"
        right,
        //% block="왼쪽"
        left,
    }

    export enum RotateDirection {
        //% block="시계방향"
        Clockwise = 0,
        //% block="반시계방향"
        Counterclockwise = 1
    }

    export enum xydir {
        //% block="앞뒤"
        forward_backward = 0,
        //% block="좌우"
        left_right = 1
    }

    export function toSigned8(n: number): number {
        n = n & 0xff
        return (n ^ 0x80) - 0x80
    }

    export function toSigned16(n: number): number {
        n = n & 0xffff
        return (n ^ 0x8000) - 0x8000
    }

    export function constrain(val: number, min: number, max: number): number {
        if (val > max)
            val = max
        if (val < min)
            val = min
        return val
    }
}
