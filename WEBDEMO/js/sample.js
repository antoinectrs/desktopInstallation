
class Sample {
    constructor(path) {
        this.audio = new (AudioContext || webkitAudioContext || mozAudioContext)(),
            this.binauralFIRNode = null,
            this.path = path;
        this.hrtfs = hrtfs;
        // this.decay = 0;
        this.sampleBuffer; // none functional now 
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
    checkBuffer (buffer) {
        // console.log(`Created newAudioBuffer ${sampleBuffer}`);
        this.sampleBuffer= buffer;
        console.log('Ready to play');
    }

    // Create a new source node and play it
    playSample(decay, e, sampleRate) {
        if (sampleRate === undefined) sampleRate = 1;
        this.hrtf(sampleRate);

        this.binauralFIRNode = new BinauralFIR({
            audioContext: this.audio
        });
        //Set HRTF dataset
        this.binauralFIRNode.HRTFDataset = this.hrtfs;

        let sourceNode = this.audio.createBufferSource();
        sourceNode.buffer =   this.sampleBuffer;
        sourceNode.playbackRate.value = sampleRate;
        sourceNode.connect(this.binauralFIRNode.input);
        this.binauralFIRNode.connect(this.audio.destination);

        this.binauralFIRNode.setPosition(90, 10, 1);
        sourceNode.loop = true;
        // console.log(decay);
      
        // console.log(decay);
        sourceNode.start(0,decay);
        // console.log(sourceNode.buffer);
        // console.log('Played sample via new AudioBufferSourceNode');
    }
    requestTrack() {
        // load sample
        let req = new XMLHttpRequest();
        req.responseType = "arraybuffer";
        req.addEventListener('load', (event) => {
            this.createBufferFromData(req.response);
        });
        req.open('GET', `../examples/sound/urban/${this.path}.mp3`, true);
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