import alt from '../../alt';
import playerActions from './actions';


class playerStore {
    constructor() {
        this.bindActions(playerActions);

        this.uri = false;
        this.title = '';
        this.wcjs = false;

        this.playing = false;
        this.paused = false;
        this.position = 0;
        this.buffering = false;
        this.time = 0;
        this.fullscreen = false;
        this.uiShown = true;
    }

    onWcjsInit(wcjs) {
        this.setState({
            wcjs: wcjs
        });
    }

    onUiShown(toggle) {
        this.setState({
            uiShown: toggle
        });
    }

    onFullscreen(state) {
        this.setState({
            fullscreen: state
        });
    }

    onPosition(pos) {
        this.setState({
            position: pos
        });
    }

    onLength(length) {
        console.log(length);
        this.setState({
            length: length
        });
    }

    onTime(time) {
        this.setState({
            time: time
        });
    }

    onOpen(data) {
        this.setState({
            title: data.title,
            uri: data.uri
        });
    }

    onBuffering(perc) {
        if (perc === 100) {
            this.setState({
                buffering: false
            });
        } else {
            this.setState({
                buffering: perc
            })
        }
    }

    onStopped() {
        this.setState({
            buffering: false,
            playing: false,
            paused: false
        })
    }

    onPlaying() {
        this.setState({
            buffering: false,
            playing: true,
            paused: false
        });
    }

    onPlay() {
        this.setState({
            buffering: false,
            playing: true,
            paused: false
        })
        this.wcjs.play();
    }

    onPause() {
        this.setState({
            buffering: false,
            playing: false,
            paused: true
        })
        this.wcjs.pause();
    }

    onClose() {
        this.setState({
            playing: false,
            paused: false,
            buffering: false,
            title: '',
            time: 0,
            position: 0,
            fullscreen: false,
            uiShown: true,
            uri: false
        });
    }

}

export
default alt.createStore(playerStore);