export interface GifInterface {
  frames: string[]; // will be urls
  delays: number[];
}

type ParseGIFFunction = (gif: Uint8Array) => Promise<GifInterface>;

export const parseGIF: ParseGIFFunction = async gif => {
  let pos = 0;
  const delays = [];
  let graphicControl = null;
  const frames = [];
  let loopCnt = 0;
  if (
    gif[0] === 0x47 &&
    gif[1] === 0x49 &&
    gif[2] === 0x46 && // 'GIF'
    gif[3] === 0x38 &&
    gif[4] === 0x39 &&
    gif[5] === 0x61
  ) {
    // '89a'
    pos += 13 + +!!(gif[10] & 0x80) * Math.pow(2, (gif[10] & 0x07) + 1) * 3;
    const gifHeader = gif.subarray(0, pos);
    while (gif[pos] && gif[pos] !== 0x3b) {
      const offset = pos;
      const blockId = gif[pos];
      if (blockId === 0x21) {
        const label = gif[++pos];
        if ([0x01, 0xfe, 0xf9, 0xff].indexOf(label) !== -1) {
          label === 0xf9 &&
            delays.push((gif[pos + 3] + (gif[pos + 4] << 8)) * 10);
          label === 0xff && (loopCnt = gif[pos + 15] + (gif[pos + 16] << 8));
          while (gif[++pos]) pos += gif[pos];
          label === 0xf9 && (graphicControl = gif.subarray(offset, pos + 1));
        } else {
          throw new Error("parseGIF: unknown label");
        }
      } else if (blockId === 0x2c) {
        pos += 9;
        pos +=
          1 + +!!(gif[pos] & 0x80) * (Math.pow(2, (gif[pos] & 0x07) + 1) * 3);
        while (gif[++pos]) pos += gif[pos];
        const imageData = gif.subarray(offset, pos + 1);
        frames.push(
          URL.createObjectURL(new Blob([gifHeader, graphicControl, imageData]))
        );
      } else {
        throw new Error("parseGIF: unknown blockId");
      }
      pos++;
    }
  } else {
    throw new Error("parseGIF: no GIF89a");
  }
  return { frames, delays };
};
