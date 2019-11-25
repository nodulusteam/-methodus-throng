[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=nodulusteam_-methodus-throng&metric=alert_status)](https://sonarcloud.io/dashboard?id=nodulusteam_-methodus-throng)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=nodulusteam_-methodus-throng&metric=coverage)](https://sonarcloud.io/dashboard?id=nodulusteam_-methodus-throng)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=nodulusteam_-methodus-throng&metric=bugs)](https://sonarcloud.io/dashboard?id=nodulusteam_-methodus-throng)

## Throng

**Throng** decorators enable *caching & throttling* of class methods in your app.

> *meaning:* a large, densely packed crowd of people or animals.
> "he pushed his way through the throng"

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

### Options
`CACHE_CHECK_PERIOD`:number - the interval for cache expiry check.

`CACHE_DELETE_ON_EXPIRE`: boolean-string  - whether to delete the objects as they expire. 

`CACHE_USE_CLONES`: boolean-string - whether to use the original objects in the cache collection or make copies.

> *boolean-string* means 'true' | 'false'

### Disable
pass `THRONG_OFF` to completly disable