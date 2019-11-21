import { TestClass } from "./test.class"

const testArs: any = [];

for (let counter = 0; counter < 2; counter++) {
    testArs.push(['1111', '2222', counter]);
}

(async () => {
    let promises: any = [];

    const instance = new TestClass();
    const TESTHITS = (global as any).TESTHITS;
    instance.emitter.on('hit', (data: any) => {
        TESTHITS[data] = Number(TESTHITS[data]) + 1 || 1;
    });


    for (const test of testArs) {
        promises.push(instance.shouldCache(test[0], test[1], test[2]));
    }

    await Promise.all(promises);


    // promises = [];
    // for (const test of testArs) {
    //     promises.push(instance.shouldTrottle(test[0], test[1], test[2]));
    // }
    // console.log('promises', promises.length);
    // await Promise.all(promises);
    // console.log(TESTHITS)

    setInterval(async () => {
        promises = [];
        for (const test of testArs) {
            promises.push(instance.shouldCache(test[0], test[1], test[2]));
        }
        console.log('promises', promises.length);
        await Promise.all(promises);
        console.log(TESTHITS);

    }, 1000 * 30)
})();
