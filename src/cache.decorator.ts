import 'reflect-metadata';
import NodeCache from 'node-cache';
const memoryCache = new NodeCache({ deleteOnExpire: false, checkperiod: 5 });
memoryCache.on('expired', async (key: string, value: CacheItem) => {
    await value.exec(...value.args);
});


export interface CacheItem {
    exec: Function;
    args: any;
    value: any;
    hits: number;
}

/** the @Cache decorator activates caching using a key, joined from the arguments
 *  @param {ttl} number - the duration of cache in seconds.
 */
export function Cache(ttl: number) {
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        // save a reference to the original method
        const originalMethod = descriptor.value;
        const valueFunction = async function (...args: any[]) {
            const _self = this as any;
            const key = args.join('-');
            const cacheResult: CacheItem | undefined = memoryCache.get<CacheItem>(key);

            if (!cacheResult || !cacheResult.value) {

                const result = await originalMethod.apply(_self, args);
                memoryCache.set(key, {
                    exec: valueFunction.bind(_self),
                    args: args,
                    value: result,
                    hits: 1
                }, ttl);

                return result;
            } else {
                cacheResult.hits++;
                return cacheResult;
            }
        };
        descriptor.value = valueFunction;
        return descriptor;
    };
}
 