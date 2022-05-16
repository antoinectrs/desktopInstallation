
class Sample {
    constructor(path) {
        this.audio = new (AudioContext || webkitAudioContext || mozAudioContext)(),
            this.binauralFIRNode = null,
            this.path = path;
        this.hrtfs = hrtfs;
        // this.decay = 0;
        this.sampleBuffer;

        this.onRoad = false;
        this.filterNode;
        this.varFreq = 40;
    }
    // Decode the raw sample data into a AudioBuffer
    createBufferFromData(rawData) {
        console.log('Got raw sample data from XHR');
        // this.audio.decodeAudioData(rawData, this.checkBuffer.bind(this));
        // this.audio.decodeAudioData(rawData, (buffer) => this.checkBuffer(buffer));
        this.audio.decodeAudioData(rawData, (buffer) => {
            this.checkBuffer(buffer)
        });
    }
    checkBuffer(buffer) {
        this.sampleBuffer = buffer;
        console.log('sample good');
    }

    // Create a new source node and play it
    playSample(decay, e, sampleRate) {
        if (sampleRate === undefined) sampleRate = 1;
        this.hrtf(sampleRate);

        //  -----------------------------------------               //INIT
        this.binauralFIRNode = new BinauralFIR({ audioContext: this.audio });
        this.binauralFIRNode.HRTFDataset = this.hrtfs;
        let sourceNode = this.audio.createBufferSource();
        this.filterNode = this.initFilter();
        // this.filterNode = this.audio.createBiquadFilter();
        sourceNode.buffer = this.sampleBuffer;
        sourceNode.playbackRate.value = sampleRate;             //SAMPLE
        //  -----------------------------------------               //CONNECT
        sourceNode.connect(this.binauralFIRNode.input);        //BINAU
        this.binauralFIRNode.connect(this.filterNode);
        this.filterNode.connect(this.audio.destination);
        // this.binauralFIRNode.connect(this.audio.destination);  //SOURCE  
        this.binauralFIRNode.setPosition(90, 10, 1);
        sourceNode.loop = true;
        sourceNode.start(0, decay);
    }
    initFilter(audioNode) {
        audioNode=  this.audio.createBiquadFilter();
        //BAND PASS
        // filter.type = "bandpass";
        // filter.frequency.value = 1000;
        // filter.Q.value = 40;

        // audioNode.type = "lowshelf";
        // this.filterValue()
        audioNode.frequency.value =  this.varFreq;
        // audioNode.frequency.setValueAtTime(1000, this.audio.currentTime);
        // audioNode.gain.setValueAtTime(10, this.audio.currentTime);
        return audioNode
    }
    filterValue(value){
        // console.log(value);
        this.filterNode.frequency.value = value;
    }
    requestTrack() {
        // load sample
        let req = new XMLHttpRequest();
        req.responseType = "arraybuffer";
        req.addEventListener('load', (event) => {
            this.createBufferFromData(req.response);
        });
        req.open('GET', `../snd/${this.path}.wav`, true);
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