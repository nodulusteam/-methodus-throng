import 'reflect-metadata';
import Limit from 'p-limit';


/** the @Throttle decorator activates caching using a key, joined from the arguments
 *  @param {limit} number - the maximum allowed concurrent executions for the method.
 */
export function Throttle(limit: number) {
    const limiter = Limit(limit);

    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        // save a reference to the original method
        const originalMethod = descriptor.value;
        const value = async function (...args: any[]) {
            const _self = this as any;
            const result = await new Promise(async (resolve, reject) => {
                limiter(async () => {
                    const result = await originalMethod.apply(_self, args);
                    resolve(result);
                });
            });
            return result;
        };
        descriptor.value = value;
        return descriptor;
    };
}
