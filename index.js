var clone = require('clone-deep');

function resolveArray(schema, definitions){
    if(!schema.items){
        return;
    }

    if(Array.isArray(schema.items)){
        processArray(schema.items, definitions);
    } else {
        schema.items = resolve(schema.items, definitions);
    }
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
            schema.properties[key] = resolve(schema.properties[key], definitions);
        }
    }
}

function resolve(schema, definitions){
    if(schema){
        if(schema.$ref){
            schema = definitions[schema.$ref.split(':')[1]];
        }

        if(schema.anyOf){
            processArray(schema.anyOf, definitions);
        }

        if(schema.type === 'array'){
            resolveArray(schema, definitions);
        }

        if(schema.type === 'object'){
            resolveObject(schema, definitions);
        }
    }

    return schema;
}

module.exports = function(schema, definitions){
    return resolve(clone(schema), definitions);
};
