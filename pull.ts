import { execSync } from 'node:child_process';

class TimeFormat
{
  d = new Date();
  constructor(){}

  private with_zero(num: number)
  {
    if(num > 10)
    {
      return num + '';
    }
    
    return '0' + num;
  }

  get h(){return this.with_zero(this.d.getHours());}
  get m(){return this.with_zero(this.d.getMinutes());}
  get s(){return this.with_zero(this.d.getSeconds());}
  
  toString()
  {
    return `${this.h}:${this.m}:${this.s}`;
  }
  
}

function main() 
{
  console.log(`${__filename} running...`);
  console.time(__filename);
  
  [
    'npx clasp pull',
    'mv -v ./src/*.js ./src/**/*.js ./src/**/**/*.js ./build/ || echo',
    'cp -rv ./src/**/*.html ./build || echo',
    'cp -rv ./src/*.json ./build || echo'
  ].forEach(cmd => 
  {
    const mv_stream = execSync(cmd);
    console.log(mv_stream + '');
  });


  console.timeEnd(__filename);  
  
  console.log(new TimeFormat() + '');
}

main();

