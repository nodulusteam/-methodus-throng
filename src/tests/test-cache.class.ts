import { Cache, Throttle } from '../';
import { EventEmitter } from 'events';

(global as any).TESTHITS = {};

export class TestCacheClass {
    public emitter = new EventEmitter();

    @Cache(10, 10, 3, (data) => {
        return data;
    }) //5 seconds cache  
    public async shouldCache(key1: string, key2: string, key3: number): Promise<any> {

        await this.emitter.emit('hit', 'shouldCache');
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`shouldCache::${key1}-${key2}-${key3}`);
                resolve(`${key1}-${key2}-${key3}`);
            }, 100);
        });
    }



    @Cache(10, 10, () => 2, (data) => {
        return data;
    }) //10 seconds cache
    public async shouldNotCache(key1: string, key2: string, key3: number): Promise<any> {
        await this.emitter.emit('hit', 'shouldNotCache');
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(`shouldNotCache::${key1}-${key2}-${key3}`);
                debugger;
                reject(new Error(`${key1}-${key2}-${key3}`));
            }, 1000 * 5);
        });
    }


}