## Throng

*Throng* decorators enables caching & throttling of class methods in your app.


### Install
`npm i @methodus/throng`


### Install
`npm i @methodus/throng`



### Usage
```javascript
import {Cache, Throttle} from '@methodus/throng';

export class TestClass{

    @Cache(120) // 120 is the cache TTL
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
