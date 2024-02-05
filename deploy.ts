import { execSync } from 'node:child_process';
import { argv } from 'node:process';
import { ENV } from '../env';

import { main as build_script } from './build_scripts';

const main = async () => 
{  
  await build_script();
  
  console.time(__filename);

  if(argv[2] != 'prod' && argv[2] != 'dev')
  {
    throw new Error();
  }
  
  const [ a, b, type, only_deploy ] = argv;

  const deployment_id = ENV.deployment_id[type];

  console.log(deployment_id);

  try
  {
    const push_stream = execSync(`npx clasp deploy --deploymentId ${deployment_id}`);
    console.log(push_stream + '');
  }
  catch(err)
  {
    // @ts-ignore
    console.log(err.stdout + '');
    // @ts-ignore
    console.log(err.stderr + '');
  }
  
  console.timeEnd(__filename);

};

main();