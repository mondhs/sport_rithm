import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class AudioPlayer extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        player: null
      }
  }

  componentDidMount() {
    console.info('[AudioPlayer] componentDidMount...');
    var element = ReactDOM.findDOMNode(this);
    this.setState({player: element})

  }

  play(){
    console.log("Play");
    this.state.player.play();
    console.info('audio set set', this.state.player);
  }

  render() {
      return (
          <audio id="audio_tag" src="/alarm.wav" preload="auto"></audio>
      );
  }
}

class View extends React.Component {

    constructor(props) {
        super(props);

        //: getInitialState() method
        this.state = {
            minutes: 0,
            seconds: 0,
            millis: 0,
            running: false,
            workoutTime: 8,
            relaxTime: 5,
            alarmCountdown: 0,
            workoutState: false,
            workoutCycles: 0
        };

        this._handleStartClick = this._handleStartClick.bind(this);
        this._handleStopClick = this._handleStopClick.bind(this);
        this._handleResetClick = this._handleResetClick.bind(this);
    }


    _handleStartClick(event) {


        if (!this.state.running) {
          if(this.state.alarmCountdown === 0){
            this.setState({alarmCountdown: this.state.relaxTime});
          }

            this.interval = setInterval(() => {
                this.tick();
            }, 100)

            this.setState({running: true})
        }
    }

    _handleStopClick(event) {
        if (this.state.running) {
            clearInterval(this.interval);
            this.setState({running: false})
        }
    }

    _handleResetClick(event) {
        this._handleStopClick();
        this.update(0, 0, 0);
    }

    tick() {
        let millis = this.state.millis + 1;
        let seconds = this.state.seconds;
        let minutes = this.state.minutes;
        let alarmCountdown = this.state.alarmCountdown
        let workoutState = this.state.workoutState;
        let workoutCycles = this.state.workoutCycles;

        if (millis === 10) {
            millis = 0;
            seconds = seconds + 1;
            if (alarmCountdown === 3){
              this._player.play();
            }
            if (alarmCountdown === 0){
              //if it was workOut then relax and vice versa
              if(workoutState){
                alarmCountdown = this.state.relaxTime;
                workoutState = false;
                workoutCycles = workoutCycles +1;
              }else{
                alarmCountdown = this.state.workoutTime;
                workoutState = true;
              }
            }
            alarmCountdown  = alarmCountdown - 1;
        }

        if (seconds === 60) {
            millis = 0;
            seconds = 0;
            minutes = minutes + 1;
        }


        this.update(millis, seconds, minutes, alarmCountdown, workoutState, workoutCycles);
    }

    zeroPad(value) {
        return value < 10 ? `0${value}` : value;
    }

    update(millis, seconds, minutes, alarmCountdown, workoutState, workoutCycles) {
        this.setState({
            millis: millis,
            seconds: seconds,
            minutes: minutes,
            alarmCountdown: alarmCountdown,
            workoutState: workoutState,
            workoutCycles: workoutCycles
        });
    }

    componentDidMount() {
        //TODO
    }

    componentWillUnMount() {
        //TODO
    }

    render() {
        let run = this.state.running === true;
        return (
            <div className="app">
                <header className="header">
                    <div className="title">Sporto Ritmas</div>
                </header>
                <main className="main">
                    <div className="display">
                        <AudioPlayer  ref={(player) => { this._player = player; }}/>
                        <div className={this.state.alarmCountdown < 3? "alarm" : "workout"}>{run ? this.state.workoutState?'Sportuojam':"Ilsimės": 'Stop'} {this.zeroPad(this.state.alarmCountdown)}</div>
                        <div className="segments">
                            <span className="mins">{this.zeroPad(this.state.minutes)}:</span>
                            <span className="secs">{this.zeroPad(this.state.seconds)} </span>
                            <span className="millis">.0{this.state.millis}</span>
                            <span className="millis">. Ciklų: {this.state.workoutCycles}</span>

                        </div>
                    </div>

                    <div className="actions">
                        <button className={"btn start " + (run ? 'disabled' : '')}
                            onClick={this._handleStartClick}>Start</button>

                        <button className={"btn stop " + (false === run ? 'disabled' : '')}
                            onClick={this._handleStopClick}>Stop</button>

                        <button className={"btn reset " + ( (this.state.seconds > 0 && false === run) ? '' : 'disabled')}
                            onClick={this._handleResetClick}>Reset</button>
                    </div>
                </main>
            </div>);
    }
}


const app = document.getElementById('root');
ReactDOM.render(<View/>, app);
