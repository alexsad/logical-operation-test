import { IPosition } from '../interfaces/interfaces';

interface AnimationCallback {
    time: number;
    frame: number;
    animationId: number;
}

interface AnimationConfig {
    callback: (params: AnimationCallback) => void, 
    fps: number,
    steps: number,
    conclusion: () => void;
}

export const AnimationByFPS = ({fps, steps, conclusion, callback}: AnimationConfig) => {
    let time: number | null = null;
    let	delay = 1000 / fps;
    let frame = -1;
    let animationId: number = 0;
    let steepsCount = steps;

    const animation = (timestamp: number) => {
        if (time === null) {
            time = timestamp
        };
        const seg = Math.floor((timestamp - time) / delay);
        if (seg > frame) {
            frame = seg;
            steepsCount--;
            callback({
                time: timestamp,
                frame: frame,
                animationId: animationId
            });  
        }
        if(steepsCount > 0){
            animationId = window.requestAnimationFrame(animation);
        }else{
            window.cancelAnimationFrame(animationId);
            conclusion();
        }
    }

    animationId = window.requestAnimationFrame(animation);
}


export const getTracks = (origin: IPosition, target: IPosition, distance: number) => {
    const pointPerpendicularToMidpoint = (p0: IPosition, p2: IPosition, distance: number) => {
        const dx = p2.x-p0.x;
        const dy = p2.y-p0.y;
        const midpoint = { 
            x:p0.x+dx*0.50,
            y:p0.y+dy*0.50
        };
        const angle=Math.atan2(dy,dx);
        const perpendicularPoint = {
          x: midpoint.x + distance * Math.cos(angle-Math.PI/2),
          y: midpoint.y + distance * Math.sin(angle-Math.PI/2)        
        };
        return perpendicularPoint;
    }

    const getQuadraticBezierXYatT = (startPt: IPosition, controlPt: IPosition, endPt: IPosition,T: number) => {
        const x = Math.pow(1-T,2) * startPt.x + 2 * (1-T) * T * controlPt.x + Math.pow(T,2) * endPt.x; 
        const y = Math.pow(1-T,2) * startPt.y + 2 * (1-T) * T * controlPt.y + Math.pow(T,2) * endPt.y; 
        return {
            x:x,
            y:y
        };
    }

    const plot = (p0: IPosition, p1: IPosition, p2: IPosition) => {
        const pts=[];
        let lastX=p0.x;
        let lastY=p0.y;
        const tracksSteps = 50;
        for(let T=0 ; T < tracksSteps; T++ ){
          const p = getQuadraticBezierXYatT(p0, p1, p2, T/tracksSteps);
          const dx=p.x-lastX;
          const dy=p.y-lastY;
          if(dx*dx+dy*dy>1){
            pts.push({x:p.x,y:p.y});
            lastX=p.x;
            lastY=p.y;
          }
        }
        return pts;
    }

    return plot(
        origin,
        pointPerpendicularToMidpoint(origin, target, distance),
        target
    );
}