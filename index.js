var clone = require('clone');

function resolveArray(schema, definitions){
    if(!schema.items){
        return;
    }

    for(var i = 0; i < schema.items.length; i++) {
        var reference = schema.items[i].$ref;

        if(reference){
            var referenceKey = reference.split(':')[1];
            schema.items[i] = definitions[referenceKey];
        }

        resolve(schema.items[i], definitions);
    }
}

function resolveObject(schema, definitions){
    if(!schema.properties){
        return;
    }

    if(schema.properties.$ref){
        var referenceKey = schema.properties.$ref.split(':')[1];

        schema.properties[referenceKey] = definitions[referenceKey];
        delete schema.properties.$ref;
    }

    for(var key in schema.properties){
        resolve(schema.properties[key], definitions);
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
