process.env.THRONG_OFF = 'false';
import { TestThrottleClass } from './tests/test-throttle.class';
import { throttleLog } from './throttle.decorator';

describe('test throttle', () => {
    it('shouldTrottle', async () => {
        jest.setTimeout(1000 * 1000 * 1000);
        const testArs: any = [];
        let promises: any = [];
        for (let counter = 0; counter < 20; counter++) {
            testArs.push(['1111', '2222', counter]);
        }

        const instance = new TestThrottleClass();
        const TESTHITS = (global as any).TESTHITS;
        instance.emitter.on('hit', (data: any) => {
            TESTHITS[data] = Number(TESTHITS[data]) + 1 || 1;
        });

        for (const test of testArs) {
            promises.push(instance.shouldTrottle(test[0], test[1], test[2]));
            promises.push(instance.shouldTrottle2(test[0], test[1], test[2]));
        }

        const results = await Promise.all(promises);
        expect(results).toEqual(results);
    });

    describe('test logs', () => {
        it('should log throttle', async () => {
            jest.setTimeout(1000 * 5);
            return await new Promise((resolve) => {
                throttleLog.on('message', (args) => {                
                    expect(args[1]).toEqual('methodus:throng:throttle');
                    throttleLog.removeAllListeners();
                    resolve();
                });

                throttleLog.log('ok');
                throttleLog.info('ok');
                throttleLog.error('ok');
            });
        });
    });
});
