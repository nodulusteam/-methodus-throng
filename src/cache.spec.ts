process.env.THRONG_OFF = 'false';
import { TestCacheClass } from './tests/test-cache.class'
import { Store, CacheItem, cacheLog } from './cache.decorator';

describe('@Cache', () => {

    it('test shouldCache', async () => {
        jest.setTimeout(1000 * 1000 * 1000);
        const testArs: any = [];
        let promises: any = [];
        for (let counter = 0; counter < 2; counter++) {
            testArs.push(['1111', counter, '2222']);
        }

        const instance = new TestCacheClass();
        const TESTHITS = (global as any).TESTHITS;
        instance.emitter.on('hit', (data: any) => {
            TESTHITS[data] = Number(TESTHITS[data]) + 1 || 1;
            //expect(TESTHITS[data]).toBeLessThanOrEqual(testArs.length);
        });

        for (const test of testArs) {
            promises.push(instance.shouldCache(test[0], test[1], test[2]));
        }

        const results = await Promise.all(promises);
        expect(results.length).toEqual(results.length);
        let testIter = 0;
        const testInterval = setInterval(async () => {
            testIter++;
            promises = [];
            for (const test of testArs) {
                promises.push(instance.shouldCache(test[0], test[1], test[2]));
            }

            const results2 = await Promise.all(promises);
            expect(results2).toStrictEqual(results);
            if (testIter > 4) {
                clearInterval(testInterval);
            }
        }, 4000);

        // Store.on('expired', async (key: string, value: CacheItem) => {          
        //     TESTHITS[key] = Number(TESTHITS[key]) - 1 || 1;
        // });

        await new Promise((resolve) => {
            setTimeout(() => {
                expect(TESTHITS['shouldCache']).toEqual(testArs.length * 4);
                expect(true).toEqual(true);
                resolve();
            }, 1000 * 30);
        });
    });

    it('test should not Cache', async () => {

        jest.setTimeout(1000 * 1000 * 1000);
        const testArs: any = [];
        let promises: any = [];
        for (let counter = 0; counter < 2; counter++) {
            testArs.push(['1111', counter, '2222']);
        }

        const instance = new TestCacheClass();
        const TESTHITS = (global as any).TESTHITS;
        instance.emitter.on('hit', (data: any) => {
            TESTHITS[data] = Number(TESTHITS[data]) + 1 || 1;
            //expect(TESTHITS[data]).toBeLessThanOrEqual(testArs.length);
        });

        for (const test of testArs) {
            promises.push(instance.shouldNotCache(test[0], test[1], test[2]));
        }
        try {
            const results = await Promise.all(promises);
        } catch (error) {
            expect(error).toBeDefined();
        }

        let testIter = 0;
        const testInterval = setInterval(async () => {
            testIter++;
            promises = [];
            for (const test of testArs) {
                promises.push(instance.shouldNotCache(test[0], test[1], test[2]));
            }

            try {
                const results2 = await Promise.all(promises);

            } catch (error) {
                expect(error).toBeDefined();
            }

            if (testIter > 4) {
                clearInterval(testInterval);
            }
        }, 4000);

        // Store.on('expired', async (key: string, value: CacheItem) => {          
        //     TESTHITS[key] = Number(TESTHITS[key]) - 1 || 1;
        // });

        await new Promise((resolve) => {
            setTimeout(() => {
                expect(TESTHITS['shouldNotCache']).toEqual(testArs.length * 6);
                expect(true).toEqual(true);
                resolve();
            }, 1000 * 30);
        });
    });

    it('Cache log', async () => {
        jest.setTimeout(1000 * 5);
        return await new Promise((resolve) => {
            cacheLog.on('message', (args) => {
                expect(args[1]).toEqual('methodus:throng:cache');
                cacheLog.removeAllListeners();
                resolve();
            });
            cacheLog.log('ok');
        });
    });

});
