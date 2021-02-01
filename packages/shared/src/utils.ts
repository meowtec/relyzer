import _pick from 'lodash/pick';
import { Loc } from './types';

export const stringifyLoc = (loc: Loc) => loc.join(',');

export const parseLoc = (loc: string) => loc.split(',').map(Number) as Loc;

/**
 * the tiny id generator
 */
export const randomId = () => (Date.now().toString(36) + Math.floor(Math.random() * 36 ** 6).toString(36)).toUpperCase();

/**
 * the typed well pick
 */
export const pick: <T, S extends keyof T>(obj: T, ...props: S[]) => Pick<T, S> = _pick;
