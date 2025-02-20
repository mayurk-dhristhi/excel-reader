let parseXlsx = require("excel");

let entityColumns = [
  "entityName",
  "collectionName",
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

  let workspace = entities.find(e=> e.entity === 'workspace');


  console.log(workspace);
  process.exit();
}
main();



// async function main() {
//   let entitiesArray = await parseXlsx.default("Schema Design Tool (1).xlsx");
//   let propertiesArray = await parseXlsx.default("Schema Design Tool (1).xlsx", "2");

//   let properties = propertiesArray.map((arr) => {
//     let result = {};
//     for (let i = 0; i < arr.length; i++) {
//       result[propertyColumns[i]] = arr[i];
//     }
//     return result;
//   });

//   let entities = entitiesArray.map((arr) => {
//     let result = {};
//     for (let i = 0; i < arr.length; i++) {
//       result[entityColumns[i]] = arr[i];
//     }

//     result.properties = properties.filter((p) => p.entity === result.entity);
//     return result;
//   });

//   let workspace = entities.find(e=> e.entity === 'workspace');


//   console.log(workspace);
//   process.exit();

// }
