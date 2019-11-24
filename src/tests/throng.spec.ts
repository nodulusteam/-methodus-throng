process.env.THRONG_OFF = 'false';
import { TestClass } from './test.class'
import { Store, CacheItem } from '../cache.decorator';

describe('test throng', () => {

    it('test shouldCache', async () => {
        jest.setTimeout(1000 * 1000 * 1000);
        const testArs: any = [];
        let promises: any = [];
        for (let counter = 0; counter < 20; counter++) {
            testArs.push(['1111', '2222', counter]);
        }

        const instance = new TestClass();
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

        promises = [];
        for (const test of testArs) {
            promises.push(instance.shouldCache(test[0], test[1], test[2]));
        }
        await Promise.all(promises);

        Store.on('expired', async (key: string, value: CacheItem) => {          
            TESTHITS[key] = Number(TESTHITS[key]) - 1 || 1;
        });

        await new Promise((resolve) => {
            setTimeout(() => {
                
                expect(TESTHITS['shouldCache']).toEqual(testArs.length * 4);
                expect(true).toEqual(true);
                resolve();
            }, 1000 * 30);
        });
    });


    it('test shouldTrottle', async () => {
        jest.setTimeout(1000 * 1000 * 1000);
        const testArs: any = [];
        let promises: any = [];
        for (let counter = 0; counter < 20; counter++) {
            testArs.push(['1111', '2222', counter]);
        }

        const instance = new TestClass();
        const TESTHITS = (global as any).TESTHITS;
        instance.emitter.on('hit', (data: any) => {
            TESTHITS[data] = Number(TESTHITS[data]) + 1 || 1;
        });

        for (const test of testArs) {
            promises.push(instance.shouldTrottle(test[0], test[1], test[2]));
        }

        const results = await Promise.all(promises);
        expect(results).toEqual(results);
    });

})