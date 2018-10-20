import * as React from "react";
import { parseGIF } from "../lib/parse-gif";

export interface GifProps extends React.HTMLProps<any> {
  src: string;
  width?: number;
  height?: number;
}

export interface GifState {
  frames: HTMLImageElement[];
  delays: number[];
  dpr: number;
  isPlaying: boolean;
}

export class Gif extends React.Component<GifProps, GifState> {
  canvas = React.createRef<HTMLCanvasElement>();
  frame: number;
  loop: number;

  constructor(props: GifProps) {
    super(props);
    this.onProcess = this.onProcess.bind(this);
    this.startLoop = this.startLoop.bind(this);
    this.stopLoop = this.stopLoop.bind(this);
    this.canvas = React.createRef();
    this.state = {
      frames: [],
      delays: [],
      dpr: 1,
      isPlaying: false
    };
    this.frame = 0;
    this.loop = 0;
  }

  play() {
    if (this.state.isPlaying) {
      return;
    }
    this.startLoop();
  }

  pause() {
    this.stopLoop();
  }

  fetchGIF(src: string): Promise<ArrayBuffer> {
    return fetch(src).then(resp => {
      return resp.arrayBuffer();
    });
  }

  loadFrame(frame: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = frame;
    });
  }

  setupGIF() {
    this.fetchGIF(this.props.src)
      .then(buffer => {
        return parseGIF(new Uint8Array(buffer));
      })
      .then(({ delays, frames }) => {
        this.setState({ delays });
        return Promise.all(frames.map(frame => this.loadFrame(frame)));
      })
      .then(frames => {
        this.setState({ frames });
        this.startLoop();
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.setupGIF();
    this.setState({
      dpr: window.devicePixelRatio || 1
    });
  }

  componentWillUnmount() {
    this.stopLoop();
  }

  startLoop() {
    const delay = this.state.delays[this.frame] || 0;
    clearTimeout(this.loop);
    this.loop = window.setTimeout(
      () =>
        requestAnimationFrame(() => {
          this.onProcess();
          this.startLoop();
        }),
      delay
    );
    if (!this.state.isPlaying) {
      this.setState({ isPlaying: true });
    }
  }

  stopLoop() {
    clearTimeout(this.loop);
    if (this.state.isPlaying) {
      this.setState({ isPlaying: false });
    }
  }

  onProcess() {
    const { width = 0, height = 0 } = this.props;
    const { dpr } = this.state;
    const mainCanvas = this.canvas.current;
    if (!mainCanvas) {
      return;
    }
    const context = mainCanvas.getContext("2d");
    if (!context) {
      return;
    }
    const frame = this.frame;
    mainCanvas.width = width * dpr;
    mainCanvas.height = height * dpr;

    context.scale(dpr, dpr);
    context.clearRect(0, 0, width, height);
    context.drawImage(this.state.frames[frame], 0, 0, width, height);
    this.frame = this.frame + 1;
    if (this.frame === this.state.frames.length) {
      this.frame = 0;
    }
  }

  render() {
    const { width, height, ...props } = this.props;
    const size = { width, height };
    return <canvas ref={this.canvas} style={size} {...props} />;
  }
}
