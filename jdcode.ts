
/**
* Control JDCode
*/

/**
 * packet[0] = 20
 * packet[1] = checksum
 * packet[2-3] = roll
 * packet[4-5] = pitch
 * packet[6-7] = yaw
 * packet[8-9] = throttle
 * packet[10-11] = option
 */


/**
 * JDCode blocks
 */
//% block="제이디코드" weight=100 color=#376db5 icon="\uf1b0"
namespace jdcode {
    let packet = pins.createBuffer(16);
    let xmitBuf = pins.createBuffer(17);
    let serialBuf = pins.createBuffer(20);
    let watchDogCnt = 0;
    let radioInit = false;
    let connectionState = false;
    let readyState = false;
    let battery = 0;
    let drone_roll = 0;
    let drone_pitch = 0;
    let altitude = 0;
    let drone_xpos = 0;
    let drone_ypos = 0;
    let g_rfband = -1;

    function checksum(start:number, buf: Buffer): number {
        let sum = 0;
        for (let i = start; i < buf.length; i++) {
            sum += buf[i];
        }
        return sum & 0xFF;
    }


    radio.onReceivedBuffer(function (receivedBuffer) {
        if (checksum(6, receivedBuffer) != receivedBuffer[5]){
            return;
        }
        
        if (receivedBuffer[3] == 0xA4){
            g_rfband = receivedBuffer[6];
            return;
        }
        
        let option1 = receivedBuffer.getNumber(NumberFormat.UInt8LE, 7);
        let option2 = receivedBuffer.getNumber(NumberFormat.UInt8LE, 8);

        connectionState = true;
        readyState = ((option1 & 0xC0) == 0xC0);
        readyState = readyState && !((option2 & 0x40) == 0x40);
        battery = receivedBuffer.getNumber(NumberFormat.UInt8LE, 9);
        drone_roll = receivedBuffer.getNumber(NumberFormat.Int8LE, 11);
        drone_pitch = receivedBuffer.getNumber(NumberFormat.Int8LE, 12);
        altitude = receivedBuffer.getNumber(NumberFormat.UInt8LE, 13);
        drone_xpos = receivedBuffer.getNumber(NumberFormat.Int16LE, 14);
        drone_ypos = receivedBuffer.getNumber(NumberFormat.Int16LE, 16);
        
        if (!readyState)
            packet.setNumber(NumberFormat.UInt16LE, 10, 0x00);
        watchDogCnt = 0;
    })


    loops.everyInterval(50, function () {

        if (!radioInit)
            return;
            
        xmitBuf.write(1, packet);
        xmitBuf[0] = 0xB1;
        xmitBuf[1] = 0x14;
        xmitBuf[2] = checksum(2, xmitBuf);
        radio.sendBuffer(xmitBuf)

        watchDogCnt += 1;
        if(watchDogCnt > 40)
            connectionState = false;
        let option1 = packet.getNumber(NumberFormat.UInt8LE, 11);
        if((option1&0x03) !=0){
            option1 &= 0xFC;
            packet.setNumber(NumberFormat.UInt8LE, 11, option1);
        }
    });

    //% block="라디오 밴드를 $band 로 설정"
    //% band.defl=deflib.RadioBand.Auto
    //% group="Connection"
    //% weight=109
    export function rfBand(band: deflib.RadioBand): void {
        if (radioInit)
            return;
        band = deflib.constrain(band, -1, 79);
        radio.setGroup(14)
        if(band == deflib.RadioBand.Auto){
            radio.setFrequencyBand(80);
            while(g_rfband == -1){
                basic.pause(100);
            }
            radio.setFrequencyBand(g_rfband);
            basic.showNumber(g_rfband);
            basic.pause(1000);
            basic.showNumber(g_rfband);
            basic.pause(1000);
        }
        else{
            radio.setFrequencyBand(band);
        }
        radioInit = true;
    }

    //% block="이륙하기"
    //% group="Motion"
    //% weight=100
    export function takeoff(): void {
        packet.setNumber(NumberFormat.UInt16LE, 8, 70);
        packet.setNumber(NumberFormat.UInt16LE, 10, 0x2F);
    }

    //% block="착륙하기"
    //% group="Motion"
    //% weight=99
    export function landing(): void {
        packet.setNumber(NumberFormat.UInt16LE, 8, 0);
        let option = packet.getNumber(NumberFormat.UInt16LE, 10);
        option &= ~0x40;
        packet.setNumber(NumberFormat.UInt16LE, 10, option);
    }


    //% block="$alt cm 높이로 비행하기"
    //% group="Motion"
    //% alt.min=0 alt.max=200 alt.defl=100
    //% weight=98
    export function height(alt: number): void {
        alt = deflib.constrain(alt, 0, 200);
        packet.setNumber(NumberFormat.UInt16LE, 8, alt);
        
        let option = packet.getNumber(NumberFormat.UInt16LE, 10);
        option |= 0x0E;
        option &= ~0x40;
        packet.setNumber(NumberFormat.UInt16LE, 10, option);   
    }

    //% block="$vel 속력으로 상승/하강하기"
    //% group="Motion"
    //% vel.min=-100 vel.max=100 vel.defl=0
    //% weight=97
    export function alt_vel(vel: number): void {
        vel = deflib.constrain(vel, -200, 200);
        packet.setNumber(NumberFormat.Int16LE, 8, vel);
        let option = packet.getNumber(NumberFormat.UInt16LE, 10);
        option |= 0x4E;
        packet.setNumber(NumberFormat.UInt16LE, 10, option);
    }


    //% block="$dir (으)로 $vel 속도(cm/s)로 비행하기"
    //% group="Motion"
    //% vel.min=-200 vel.max=200 vel.defl=0
    //% weight=96
    export function move_velocity(dir: deflib.direction, vel:number): void {
        vel = deflib.constrain(vel, -200, 200);
        if (dir == deflib.direction.forward) 
            packet.setNumber(NumberFormat.Int16LE, 4, vel);
        if (dir == deflib.direction.backward)
            packet.setNumber(NumberFormat.Int16LE, 4, -vel);
        if (dir == deflib.direction.right)
            packet.setNumber(NumberFormat.Int16LE, 2, vel);
        if (dir == deflib.direction.left)
            packet.setNumber(NumberFormat.Int16LE, 2, -vel);

        let option = packet.getNumber(NumberFormat.UInt16LE, 10);
        option &= ~0x20;
        packet.setNumber(NumberFormat.UInt16LE, 10, option);
    }

    //% block="$dir (으)로 $distance cm 거리를 비행하기"
    //% group="Motion"
    //% distance.min=-1000 distance.max=1000 distance.defl=100
    //% weight=95
    export function move_distance(dir: deflib.direction, distance: number): void {
        distance = deflib.constrain(distance, -1000, 1000);
        
        if (dir == deflib.direction.forward){
            let position = packet.getNumber(NumberFormat.Int16LE, 4);
            packet.setNumber(NumberFormat.Int16LE, 4, position + distance);
        }
        if (dir == deflib.direction.backward){
            let position = packet.getNumber(NumberFormat.Int16LE, 4);
            packet.setNumber(NumberFormat.Int16LE, 4, position - distance);
        }
        if (dir == deflib.direction.right){
            let position = packet.getNumber(NumberFormat.Int16LE, 2);
            packet.setNumber(NumberFormat.Int16LE, 2, position + distance);
        }
        if (dir == deflib.direction.left){
            let position = packet.getNumber(NumberFormat.Int16LE, 2);
            packet.setNumber(NumberFormat.Int16LE, 2, position - distance);
        }
        let option = packet.getNumber(NumberFormat.UInt16LE, 10);
        option |= 0x2E;
        packet.setNumber(NumberFormat.UInt16LE, 10, option);
    }

    //% block="$dir (으)로 $degree 도 회전하기"
    //% group="Motion"
    //% degree.min=-180 degree.max=180 degree.defl=90
    //% weight=94
    export function rotate(dir: deflib.RotateDirection, degree: number): void {
        degree = deflib.constrain(degree, -180, 180);
        degree = degree==180? -180 : degree==-180? 180 : degree;
        if (dir == deflib.RotateDirection.Clockwise){
            let cur_deg = packet.getNumber(NumberFormat.Int16LE, 6);
            packet.setNumber(NumberFormat.Int16LE, 6, cur_deg + degree);
        }
        if (dir == deflib.RotateDirection.Counterclockwise) {
            let cur_deg = packet.getNumber(NumberFormat.Int16LE, 6);
            packet.setNumber(NumberFormat.Int16LE, 6, cur_deg - degree);
        }
    }


    //% block="드론 비행을 즉시 멈추기"
    //% group="Motion"
    //% weight=93
    export function emergency(): void {
        packet.setNumber(NumberFormat.UInt16LE, 10, 0x400);
        basic.pause(500)
    }


    //% block="연결상태"
    //% group="센서"
    //% weight=59
    export function get_connectionState(): boolean {
        return connectionState;
    }


    //% block="준비상태"
    //% group="센서"
    //% weight=58
    export function get_readyState(): boolean {
        return readyState;
    }


    //% block="배터리"
    //% group="센서"
    //% weight=57
    export function get_battery(): number {
        return battery;
    }

    //% block="드론높이"
    //% group="센서"
    //% weight=56
    export function get_altitude(): number {
        return altitude;
    }

    //% block="드론 $dir 기울기"
    //% group="센서"
    //% weight=55
    export function get_drone_tilt(dir: deflib.xydir): number {
        if(dir == deflib.xydir.forward_backward)
            return drone_pitch;
        else if (dir == deflib.xydir.left_right)
            return drone_roll;
        else
            return 0;
    }


    //% block="드론 $dir 이동"
    //% group="센서"
    //% weight=54
    export function get_drone_distance(dir: deflib.xydir): number {
        if (dir == deflib.xydir.forward_backward)
            return drone_ypos;
        else if (dir == deflib.xydir.left_right)
            return drone_xpos;
        else
            return 0;
    }
}
