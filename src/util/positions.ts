import {IPosition} from '../interfaces/interfaces';

export const angleDeg = (p1: IPosition, p2: IPosition) => Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;