import {Check} from './Check';

/**
 * A table with checks and closed checks.
 */
export interface Table {
    id: string;
    number: number;
    check?: Check;
    closedChecks: Check[];
}