# Sinon Expect

Sinon expect is a wrapper for the assertions built into sinon.

A quick example is:

```javascript
var object = {
  method: function(){}
};

//Yes we are overriding expect
//You can also save it to another variable but that is ugly
expect = require('sinon-expect').enhance(expect, sinon, 'was');

sinon.spy(object, 'method');

//Assert style
sinon.assert.called(object.method);

//Expect style
//All assertions are found under the .spy namespace/"flag"
expect(object.method).was.called();
```

## List Of Supported Assertions/Matchers

See [Sinon Assertions](http://sinonjs.org/docs/#assertions)
for additional documentation for each of these assertions.


Drop the first argument (the spy) otherwise the method signature
is the same.

  - notCalled
  - called
  - calledOnce
  - calledTwice
  - calledThrice
  - callCount
  - callOrder
  - calledOn
  - alwaysCalledOn
  - calledWith
  - alwaysCalledWith
  - neverCalledWith
  - calledWithExactly
  - alwaysCalledWithExactly
  - threw
  - alwaysThrew

# License 

MIT (see LICENSE)
