import 'reflect-metadata';
const NodeCache = require('node-cache');
const debug = require('debug')('methodus:throng:cache');
const crypto = require('crypto');
const Limit = require('p-limit');


const CACHE_CHECK_PERIOD = process.env.CACHE_CHECK_PERIOD || 60;
const CACHE_DELETE_ON_EXPIRE = process.env.CACHE_DELETE_ON_EXPIRE !== 'false' ? true : false;
const CACHE_USE_CLONES = process.env.CACHE_USE_CLONES === 'true' ? true : false;


const memoryCache = new NodeCache({
    deleteOnExpire: CACHE_DELETE_ON_EXPIRE,
    checkperiod: CACHE_CHECK_PERIOD,
    useClones: CACHE_USE_CLONES
});

memoryCache.on('expired', async (key: string, value: CacheItem) => {
    debug(`expired key: ${key}, at ${new Date()}`);
    value.limiter(async () => {
        debug(`executing refresh at: ${new Date()}`);
        return await value.exec(...value.args);
    });
});
debug('Cache initiated.');

export const Store = memoryCache;
export interface CacheItem {
    exec: Function;
    args: any;
    value: any;
    hits: number;
    limiter: any;
}

/** the @Cache decorator activates caching using a key, joined from the arguments
 *  @param {ttl} number - the duration of cache in seconds.
 */
export function Cache(ttl: number, expireThrottle: number = 1, keyLength?: number) {
    const limiter = Limit(expireThrottle);
    return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
        if (process.env.THRONG_OFF && process.env.THRONG_OFF === 'true') {
            debug(`Throng is off`);
            return;
        } else {
            debug(`Throng cache applied to ${target.name}.${propertyKey}`);
        }

        // save a reference to the original method
        const originalMethod = descriptor.value;
        const valueFunction = async function (...args: any[]) {
            const _self = this;
           
            let keyArgs = args;
            if (keyLength) {
                keyArgs = args.slice(0, keyLength);
            }

            let hash = crypto.createHash('md5').update(keyArgs.join('-')).digest('hex');
            const key = `${propertyKey}-${hash}`;
            debug(`Getting key ${key}`);

            let cacheResult: CacheItem | undefined = undefined;
            try {
                cacheResult = memoryCache.get(key);
            } catch (error) {
                debug(`error getting from cache`);
                debug(error);
            }

            if (!cacheResult || !cacheResult.value) {
                debug(`Cache empty for  cache key ${key}`);
                debug(`applying method ${propertyKey}`);
                let result = originalMethod.apply(_self, args);
                //
                if (result.then) {
                    debug(`resolving promise ${propertyKey}`);
                    result = await result;
                }

                debug(`method ${propertyKey} completed`);
                debug(`set to cache ${key}`);

                memoryCache.set(key, {
                    exec: valueFunction.bind(_self),
                    args: args,
                    value: result,
                    limiter: limiter,
                    hits: 1
                }, ttl);

                debug(`set to cache ${key} ok`);
                debug(`return`);
                return result;
            } else {
                debug(`Got record for cache ${key}`);
                debug(`increment hits. current value:  ${cacheResult.hits}`);
                cacheResult.hits++;
                return cacheResult.value;
            }
        };
        descriptor.value = valueFunction;
        return descriptor;
    };
}
