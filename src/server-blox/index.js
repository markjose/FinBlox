const sleep = require('../utils/sleep');

module.exports = ({
  name = 'New Blox Server'
}) => {
  const blocks = [];
  let shouldStop = false;
  let operationCount = 0;

  const serverProc = async () => {
    while (!shouldStop) {
      while (blocks.length < 1) {
        console.log(`No blocks available to execute`);
        await sleep(1000);
      }

      const blockIndex = operationCount % blocks.length;
      const block = blocks[blockIndex];
      if (!block.execute) {
        throw new Error(`The block '${block.name}' does not expose a generator function named 'execute'`);
      }

      const result = await block.execute(operationCount++);
      if (result.done) {
        blocks.splice(blockIndex, 1).forEach(deletedBlock => {
          console.warn(`Removed block '${deletedBlock.name}' as it is done executing`);
        });
      }
    }
  };

  const add = block => {
    blocks.push(block);
    if (!block.name) {
      throw new Error(`This block does not expose a property named 'name'`);
    }
    console.log(`Adding block '${block.name}' to server '${name}`);
  };

  const run = async () => {
    console.log(`Running server '${name}'`);
    await serverProc();
    console.log(`Server '${name}' stopped`);
  };

  const stop = () => {
    shouldStop = true;
  };

  console.log(`Created server '${name}'`);
  return {
    name,
    add,
    run,
    stop
  };
};
