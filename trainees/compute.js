'use strict';

const projectId = 'industrial-net-334312';
const zone = 'europe-west1-b';
// const instanceName = 'YOUR_INSTANCE_NAME'
const instanceTemplateUrl = 'global/instanceTemplates/instance-template-1';

const compute = require('@google-cloud/compute');

async function createInstanceFromTemplate(instanceName) {
    const instancesClient = new compute.InstancesClient();

     console.log(
      `Creating the ${instanceName} instance in ${zone} from template ${instanceTemplateUrl}...`
    );

    const [response] = await instancesClient.insert({
      project: projectId,
      zone,
      instanceResource: {
        name: instanceName,
      },
      networkInterfaces: [
        {
          network:'global/networks/gd-vpc' ,
        }
      ],
      sourceInstanceTemplate: instanceTemplateUrl
    });
    let operation = response.latestResponse;
    const operationsClient = new compute.ZoneOperationsClient();

    // Wait for the create operation to complete.
    while (operation.status !== 'DONE') {
      [operation] = await operationsClient.wait({
        operation: operation.name,
        project: projectId,
        zone: operation.zone.split('/').pop(),
      });
    }
    
    console.log('Instance created.');
    return operation;
}

module.exports = {
    createInstanceFromTemplate
  };