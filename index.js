let parseXlsx = require("excel");
let fs = require("fs");

let entityColumns = [
  "entity",
  "collection",
  "description",
  "isCollection",
  "collection-name",
  "isPublished",
  "collectionId",
];

let propertyColumns = [
  "entity",
  "name",
  "type",
  "description",
  "format",
  "pattern",
  "min-length",
  "max-length",
  "min-value",
  "max-value",
  "required",
  "identity",
  "auto-increment",
  "auto-increment-identifier",
  "auto-increment-prefix",
  "isReference",
  "isReference2",
  "isArray",
  "isLookupCode",
  "isLookupLabel",
];

async function main() {
  let entitiesArray = await parseXlsx.default("Schema Design Tool.xlsx");
  let propertiesArray = await parseXlsx.default("Schema Design Tool.xlsx", "2");

  let properties = propertiesArray.map((arr) => {
    let result = {};
    for (let i = 0; i < arr.length; i++) {
      result[propertyColumns[i]] = arr[i];
    }
    return result;
  });

  let entities = entitiesArray.map((arr) => {
    let result = {};
    for (let i = 0; i < arr.length; i++) {
      result[entityColumns[i]] = arr[i];
    }

    result.properties = properties.filter((p) => p.entity === result.entity);
    return result;
  });

  let workspace = entities.find((e) => e.entity === "workspace");

  if (workspace) {
    const jsonSchema = {
      entityName: workspace.entity,
      collectionName: workspace.collection,
      collectionSchema: {
        title:
          workspace.collection.charAt(0).toUpperCase() +
          workspace.collection.slice(1),
        type: "object",
        properties: {},
        required: [],
      },
      listConfiguration: {
        columns: [],
      },
      formSchema: {
        title: workspace.entity,
        type: "object",
        properties: {},
      },
    };

    jsonSchema.collectionSchema.properties = workspace.properties.reduce(
      (acc, prop) => {
        acc[prop.name] = {
          type: prop.type,
          description: prop.description,
          ...(prop.enum && { enum: prop.enum.split(",") }),
          ...(prop.isArray && { type: "array", items: { type: prop.type } }),
        };
        // if required is there
        if (prop.required) {
          jsonSchema.collectionSchema.required.push(prop.name);
        }
        return acc;
      },
      {}
    );
    jsonSchema.listConfiguration.columns = workspace.properties.map((prop) => {
      return {
        field: prop.name,
        headerName: prop.description || prop.name,
        type: prop.type,
      };
    });
    jsonSchema.formSchema.properties = workspace.properties.reduce(
      (acc, prop) => {
        acc[prop.name] = {
          type: prop.type,
          description: prop.description,
          ...(prop.enum && { enum: prop.enum.split(",") }),
          ...(prop.isArray && { type: "array", items: { type: prop.type } }),
        };
        if (prop.required === "TRUE") {
          jsonSchema.collectionSchema.required.push(prop.name);
        }
        return acc;
      },
      {}
    );
    console.log(JSON.stringify(jsonSchema, null, 2));

    //   console.log(workspace);
    process.exit();
  }
}
main();

// let workspaceEntity = entities.find(e => e.entityName === 'workspaces');

//   if (workspaceEntity) {
//     const jsonSchema = {
//       "_id": { "$oid": "<your_oid_here>" },
//       "entityName": workspaceEntity.entityName,
//       "collectionName": workspaceEntity.collectionName,
//       "collectionSchema": {
//         "title": workspaceEntity.collectionName.charAt(0).toUpperCase() + workspaceEntity.collectionName.slice(1),
//         "type": "object",
//         "properties": {},
//         "required": []
//       },
//       "operations": ["INSERT", "GETALL", "GETBYID", "UPDATE", "DELETEBYID"],
//       "isActive": true,
//       "isPagination": true
//     };

//     console.log(JSON.stringify(jsonSchema, null, 2));

//   process.exit();
