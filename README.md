# resolve-schema-refs

Very naive $ref resolver for JaySchema schemas

# Usage

``` javascript
var resolveReferences = require('resolve-schema-refs');

var schema = {
        '$ref': 'foo:bar'
    };

var definitions = {
        bar: {
            things: 'stuff'
        }
    };

var resolved = resolveReferences(schema, definitions);

console.log(resolved);

//{
//    things: 'stuff'
//}

```
