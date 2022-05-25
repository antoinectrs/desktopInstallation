
class Sample {
    constructor(path, orientation) {
        this.audio = new (AudioContext || webkitAudioContext || mozAudioContext)(),
            this.binauralFIRNode = null,
            this.path = path;
        this.hrtfs = hrtfs;
        this.sampleBuffer;
        this.sourceNode;
        this.onRoad = false;
        this.rack = {
            filter: {
                varFreq: 40,
                audioNode: null,
                actual: 0,
            },
            volume: {
                // varFreq:40,
                audioNode: null,
                actual: 0,
            },
            binaural: {
                orientation: null
            },
            speed: {
                actual: 5
            }
        }
        this.variationRoute;

        this.thresholdLerp = 0.004;
        this.renderStatut = false;
    }
    initVariationRoute(value) {
        this.variationRoute = value;
    }
    initOrientation(value) {
        this.rack.binaural.orientation = value;
        this.binauralFIRNode.setPosition(this.rack.binaural.orientation, 10, 1);
    }

    // Decode the raw sample data into a AudioBuffer
    createBufferFromData(rawData) {
        // console.log('Got raw sample data from XHR');
        // this.audio.decodeAudioData(rawData, this.checkBuffer.bind(this));
        // this.audio.decodeAudioData(rawData, (buffer) => this.checkBuffer(buffer));
        this.audio.decodeAudioData(rawData, (buffer) => {
            this.checkBuffer(buffer)
        });
    }
    checkBuffer(buffer) {
        this.sampleBuffer = buffer;
        // console.log('sample good');
    }
    // Create a new source node and play it
    playSample(decay, e, sampleRate) {
        if (sampleRate === undefined) sampleRate = 1;
        this.hrtf(sampleRate);

        //  -----------------------------------------               //INIT
        this.binauralFIRNode = new BinauralFIR({ audioContext: this.audio });
        this.binauralFIRNode.HRTFDataset = this.hrtfs;
        this.sourceNode = this.audio.createBufferSource();
        this.initEffect(this.sourceNode);
        //  this.rack.filter.audioNode = this.audio.createBiquadFilter();
        this.sourceNode.buffer = this.sampleBuffer;
        this.sourceNode.playbackRate.value = sampleRate;             //SAMPLE
        //  -----------------------------------------               //CONNECT
        this.sourceNode.connect(this.binauralFIRNode.input);        //BINAU
        this.binauralFIRNode.connect(this.rack.filter.audioNode);
        this.rack.filter.audioNode.connect(this.audio.destination);
        // this.binauralFIRNode.connect(this.audio.destination);  //SOURCE  
        this.sourceNode.loop = true;
        this.sourceNode.start(0, decay);
    }
    initEffect(bufferSrc) {
        this.rack.filter.audioNode = this.initFilter();
        this.rack.volume.audioNode = this.initGain();
        this.initSpeed(this.rack.speed.actual);
    }
    initFilter(audioNode) {
        audioNode = this.audio.createBiquadFilter();
        //BAND PASS
        // filter.type = "bandpass";
        // filter.frequency.value = 1000;
        // filter.Q.value = 40;

        // audioNode.type = "lowshelf";
        audioNode.frequency.value = this.rack.filter.varFreq;
        // audioNode.frequency.setValueAtTime(1000, this.audio.currentTime);
        audioNode.gain.setValueAtTime(30, this.audio.currentTime);
        return audioNode
    }
    initGain(audioNode) {
        audioNode = this.audio.createGain();
        return audioNode;
        // audioNode.gain.setValueAtTime(10, this.audio.currentTime);
    }
    initSpeed(speed) { 
        this.sourceNode.playbackRate.value = speed;
        // console.log( this.sourceNode);
    }

    softValue(fxTarget, fxTemp, fxType, index = 0) {
        // console.log(fxTemp);
        new Promise(resolve => {
            const draw = () => {
                // console.log(fxTarget, fxTemp, fxType);
                if (index >= 0.99) {
                    fxType.value = fxTarget
                    this.rack.filter.actual = fxTarget;
                    // resolve("the new value " + effect);
                } else {
                    index += this.thresholdLerp;
                    this.rack.filter.actual = fxTemp;
                    fxTemp = Math.round(myLerp(fxTemp, fxTarget, index));
                    // fxType.value =fxTemp
                    fxType.value = fxTemp
                    // console.log(fxTemp);
                    requestAnimationFrame(() => draw());
                }
            }
            draw()
        });
    }
    async render(eFilter, eVolume) {
        // fxTarget fxTemp                  fxType  
        // console.log(this.rack.volume.audioNode.);
        const filterRender = await this.softValue(eFilter, this.rack.filter.actual, this.rack.filter.audioNode.frequency);
        // const fvolumeRender = await this.softValue(eVolume, this.rack.volume.actual, this.rack.volume.audioNode.gain);
        // const render1 = await this.softValue(eVolume,this.rack.volume.actual);
        // console.log('Message:', render);
    }
    requestTrack() {
        let req = new XMLHttpRequest();
        req.responseType = "arraybuffer";
        req.addEventListener('load', (event) => {
            this.createBufferFromData(req.response);
        });
        // req.open('GET', `../snd/parc/${this.path}.wav`, true);
        req.open('GET', `./snd/track01/${this.path}.wav`, true);
        req.send();
    }
    hrtf(sampleRate) {
        for (var i = 0; i < this.hrtfs.length; i++) {
            var buffer = this.audio.createBuffer(2, 512, this.audio.sampleRate);
            var bufferChannelLeft = buffer.getChannelData(0);
            var bufferChannelRight = buffer.getChannelData(1);
            for (var e = 0; e < this.hrtfs[i].fir_coeffs_left.length; e++) {
                bufferChannelLeft[e] = this.hrtfs[i].fir_coeffs_left[e];
                bufferChannelRight[e] = this.hrtfs[i].fir_coeffs_right[e];
            }
            this.hrtfs[i].buffer = buffer;
        }
    }
}