var test = require('tape'),
    resolve = require('../'),
    testDefinitions = {
        foo: {
            things: 'stuff'
        }
    };

test('works as root', function(t){
    t.plan(1);

    var result = resolve(
        {
            $ref: 'test:foo'
        },
        testDefinitions
    );

    t.deepEqual(result, testDefinitions.foo, 'works as root');
});

test('works with objects', function(t){
    t.plan(1);

    var result = resolve(
        {
            type: 'object',
            properties: {
                bar: 'majigger',
                $ref: 'test:foo'
            }
        },
        testDefinitions
    );

    t.deepEqual(
        result,
        {
            type: 'object',
            properties: {
                bar: 'majigger',
                foo: testDefinitions.foo
            }
        },
        'works with objects'
    );
});

test('works with arrays', function(t){
    t.plan(1);

    var result = resolve(
        {
            type: 'array',
            items: [
                {$ref: 'test:foo'}
            ]
        },
        testDefinitions
    );

    t.deepEqual(
        result,
        {
            type: 'array',
            items: [
                testDefinitions.foo
            ]
        },
        'works with objects'
    );
});