import 'reflect-metadata';
import Limit from 'p-limit';
const debug = require('debug')('methodus:throng:throttle');

/** the @Throttle decorator activates caching using a key, joined from the arguments
 *  @param {limit} number - the maximum allowed concurrent executions for the method.
 */
export function Throttle(limit: number) {
    const limiter = Limit(limit);

    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {

        debug(`${propertyKey}::created a limitter for (${limit})`);

        // save a reference to the original method
        const originalMethod = descriptor.value;
        const value = async function (...args: any[]) {

            debug(`${propertyKey}:: >> limits activeCount:(${limiter.activeCount})`);
            debug(`${propertyKey}:: >> limits pendingCount:(${limiter.pendingCount})`);

            const _self = this as any;
            const result = await new Promise(async (resolve, reject) => {
                limiter(async () => {
                    debug(`${propertyKey}::executing`);
                    const result = await originalMethod.apply(_self, args);
                    debug(`${propertyKey}::complete`);


                    debug(`${propertyKey}:: << limits activeCount:(${limiter.activeCount})`);
                    debug(`${propertyKey}:: << limits pendingCount:(${limiter.pendingCount})`);

                    resolve(result);
                });
            });
            return result;
        };
        descriptor.value = value;
        return descriptor;
    };
}
