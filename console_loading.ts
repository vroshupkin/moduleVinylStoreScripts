import { main as buildScript_main } from './build_scripts';
import { EventEmitter } from 'node:events';
// import readline from 'node';


class Clock
{
  tick = 0;
  private timer: ReturnType<typeof setInterval>;
  constructor(private emitter: EventEmitter)
  {
    this.timer = setInterval(() => 
    {
      this.tick++;
      this.tick %= 3;

      emitter.emit('Spinner tick');
    }, 500);
  }

  stop()
  {
    clearInterval(this.timer);
  }
}

enum ESpinnerState{ Message, SpinnerTick}

class Spinner extends EventEmitter 
{
  clock = new Clock(this);

  state: ESpinnerState = 0;

  constructor()
  {
    
    super();

    this.on('Spinner tick', () => 
    {
      if(this.state === ESpinnerState.Message)
      {
        process.stdout.write('\n');      
      }
      this.state = ESpinnerState.SpinnerTick;

      process.stdout.write(`\r${this.clock.tick}`);
    });

    this.on('Message', (str:string ) => 
    {
      this.state === ESpinnerState.SpinnerTick? process.stdout.write('\r\n') : '';
      process.stdout.write('\n' + str);
      
    });
  }

  log(message: string)
  {
    this.emit('Message', message);
    this.state === ESpinnerState.Message;
  }
}

async function main() 
{

  //   readline.emitKeyPressEvent(stdin);

  const spinner = new Spinner();

  let tick = 0;
  const messages = [ 'Run1', 'Run2', 'Run3' ];

  const timer = setInterval(() => 
  {
    
    spinner.log(messages[tick]);
    
    tick++;
    if(tick === 2)
    {
      clearInterval(timer);
        
    }
  }, 2000);

  //   process.stdin.on('data', (chunk) => 
  //   {
  //     process.stdout.write(chunk);
  //   });
    
}

main();