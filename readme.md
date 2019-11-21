## Throng

*Throng* decorators enable caching & throttling of class methods in your app.


### Install
`npm i @methodus/throng`


### Install
`npm i @methodus/throng`



### Usage
```javascript
import {Cache, Throttle} from '@methodus/throng';

export class TestClass{

    @Cache(120, 2) // 120 is the cache TTL, 2 is the number of concurrent executions for the expire rerun
    public async cacheMethod(){
        /// function code
        return;
    }

    @Throttle(3) // 3 in the number of concurrent operations
    public async throttledMethod(){
        /// function code
        return;
    }

    @Cache(120) // 120 is the cache TTL
    @Throttle(3) // 3 in the number of concurrent operations
    public async combinedMethod(){
        /// function code
        return;
    }

}
```

### Debug
set "DEBUG" env variable to:
```bash
methodus:throng:*
methodus:throng:cache
methodus:throng:throttle
```