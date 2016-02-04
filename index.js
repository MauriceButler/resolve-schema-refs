var clone = require('clone');

function resolveArray(schema, definitions){
    if(!schema.items){
        return;
    }

    processArray(schema.items, definitions);
}

function processArray(array, definitions){
    for(var i = 0; i < array.length; i++) {
        var reference = array[i].$ref;

        if(reference){
            var referenceKey = reference.split(':')[1];
            array[i] = definitions[referenceKey];
        }

        resolve(array[i], definitions);
    }
}

function resolveObject(schema, definitions){
    if(schema.properties){
        if(schema.properties.$ref){
            var referenceKey = schema.properties.$ref.split(':')[1];

            schema.properties[referenceKey] = definitions[referenceKey];
            delete schema.properties.$ref;
        }

        for(var key in schema.properties){
            resolve(schema.properties[key], definitions);
        }
    }

    if(schema.anyOf){
        processArray(schema.anyOf, definitions);
    }
}

function resolve(schema, definitions){
    if(schema){
        if(schema.type === 'array'){
            resolveArray(schema, definitions);
        }

        if(schema.type === 'object'){
            resolveObject(schema, definitions);
        }

        if(schema.$ref){
            schema = definitions[schema.$ref.split(':')[1]];
        }
    }

    return schema;
}

module.exports = function(schema, definitions){
    return resolve(clone(schema), definitions);
};
