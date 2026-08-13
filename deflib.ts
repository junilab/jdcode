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
    
    export enum RadioBand {
        //% block="auto"
        Auto = -1,
        //% block="band 0"
        Band0 = 0,
        //% block="band 1"
        Band1 = 1,
        //% block="band 2"
        Band2 = 2,
        //% block="band 3"
        Band3 = 3,
        //% block="band 4"
        Band4 = 4,
        //% block="band 5"
        Band5 = 5,
        //% block="band 6"
        Band6 = 6,
        //% block="band 7"
        Band7 = 7,
        //% block="band 8"
        Band8 = 8,
        //% block="band 9"
        Band9 = 9,
        //% block="band 10"
        Band10 = 10,
        //% block="band 11"
        Band11 = 11,
        //% block="band 12"
        Band12 = 12,
        //% block="band 13"
        Band13 = 13,
        //% block="band 14"
        Band14 = 14,
        //% block="band 15"
        Band15 = 15,
        //% block="band 16"
        Band16 = 16,
        //% block="band 17"
        Band17 = 17,
        //% block="band 18"
        Band18 = 18,
        //% block="band 19"
        Band19 = 19,
        //% block="band 20"
        Band20 = 20,
        //% block="band 21"
        Band21 = 21,
        //% block="band 22"
        Band22 = 22,
        //% block="band 23"
        Band23 = 23,
        //% block="band 24"
        Band24 = 24,
        //% block="band 25"
        Band25 = 25,
        //% block="band 26"
        Band26 = 26,
        //% block="band 27"
        Band27 = 27,
        //% block="band 28"
        Band28 = 28,
        //% block="band 29"
        Band29 = 29,
        //% block="band 30"
        Band30 = 30,
        //% block="band 31"
        Band31 = 31,
        //% block="band 32"
        Band32 = 32,
        //% block="band 33"
        Band33 = 33,
        //% block="band 34"
        Band34 = 34,
        //% block="band 35"
        Band35 = 35,
        //% block="band 36"
        Band36 = 36,
        //% block="band 37"
        Band37 = 37,
        //% block="band 38"
        Band38 = 38,
        //% block="band 39"
        Band39 = 39,
        //% block="band 40"
        Band40 = 40,
        //% block="band 41"
        Band41 = 41,
        //% block="band 42"
        Band42 = 42,
        //% block="band 43"
        Band43 = 43,
        //% block="band 44"
        Band44 = 44,
        //% block="band 45"
        Band45 = 45,
        //% block="band 46"
        Band46 = 46,
        //% block="band 47"
        Band47 = 47,
        //% block="band 48"
        Band48 = 48,
        //% block="band 49"
        Band49 = 49,
        //% block="band 50"
        Band50 = 50,
        //% block="band 51"
        Band51 = 51,
        //% block="band 52"
        Band52 = 52,
        //% block="band 53"
        Band53 = 53,
        //% block="band 54"
        Band54 = 54,
        //% block="band 55"
        Band55 = 55,
        //% block="band 56"
        Band56 = 56,
        //% block="band 57"
        Band57 = 57,
        //% block="band 58"
        Band58 = 58,
        //% block="band 59"
        Band59 = 59,
        //% block="band 60"
        Band60 = 60,
        //% block="band 61"
        Band61 = 61,
        //% block="band 62"
        Band62 = 62,
        //% block="band 63"
        Band63 = 63,
        //% block="band 64"
        Band64 = 64,
        //% block="band 65"
        Band65 = 65,
        //% block="band 66"
        Band66 = 66,
        //% block="band 67"
        Band67 = 67,
        //% block="band 68"
        Band68 = 68,
        //% block="band 69"
        Band69 = 69,
        //% block="band 70"
        Band70 = 70,
        //% block="band 71"
        Band71 = 71,
        //% block="band 72"
        Band72 = 72,
        //% block="band 73"
        Band73 = 73,
        //% block="band 74"
        Band74 = 74,
        //% block="band 75"
        Band75 = 75,
        //% block="band 76"
        Band76 = 76,
        //% block="band 77"
        Band77 = 77,
        //% block="band 78"
        Band78 = 78,
        //% block="band 79"
        Band79 = 79
    }
}
