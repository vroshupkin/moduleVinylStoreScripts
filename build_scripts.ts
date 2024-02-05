import { execSync, exec } from 'node:child_process';
import * as path from 'node:path';
import * as fsPromise from 'node:fs/promises';
import * as fs from 'node:fs';


const working_path = getWorkingDir();

/**
 * Если в этой папке изменился файл, то перекомпилируются файлы. Иначе пропускает
 */
export async function main()
{ 
  console.time('Compare hash');
  const old_hash = await readHash();
  const new_hash = await generateHash();
  console.timeEnd('Compare hash');
  
  if(old_hash != new_hash)
  {
    process.stdout.write('Files is changed\n');
    const write_path = path.join(working_path, 'hash.txt');
    await buildScripts();
    await fsPromise.writeFile(write_path, new_hash);
  }
  else
  {
    console.log('Files is not changed');
  }
 
  
}


async function readHash()
{
  const file_path = path.join(working_path, 'hash.txt');
  
  
  if(!fs.existsSync(file_path))
  {
    return '';
  }
  
  const file_text = await fsPromise.readFile(file_path);
  
  return file_text + '';
}

async function generateHash()
{
  
  const ts_files_names = ((await fsPromise.readdir(working_path))
    .filter(str => /.*\.ts/.test(str)));

  let hash_str = '';
  for (const filename of ts_files_names) 
  {
    const path_ts = path.join(working_path, `${filename}`);

    const buffer = execSync(`sha1sum ${path_ts}`);
    
    hash_str += buffer + '';
  }
  
  return hash_str;
}

async function buildScripts()
{ 
  
  console.time('buildScripts');
  const path_str = path.join(working_path);

  execSync(`npx tsc --project ${path_str}`);

  console.timeEnd('buildScripts');
  

}

/** Получает папку в которой нужно компилироваться */
function getWorkingDir()
{
  const path_arr = __dirname.split('\\');
  
  if(path_arr[path_arr.length - 2] === 'build')
  {
    return path.resolve(__dirname, '../..');
  }
  
  return __dirname;
  
}

main();