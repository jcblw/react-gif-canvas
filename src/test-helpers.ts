interface MockCache {
  mockResponseFN?: (url: string) => FetchMock;
}

interface FetchMock {
  arrayBuffer: () => Promise<Buffer>;
}

interface UrlMock {
  createObjectURL: (blob: Blob) => string;
}

const cache: MockCache = {};

export const fetchHelper = async (url: string): Promise<FetchMock> => {
  if (typeof cache.mockResponseFN === "function") {
    const mock = cache.mockResponseFN(url);
    if (mock) {
      return mock;
    }
  }
  return {
    arrayBuffer() {
      return new Promise(resolve => {
        resolve(Buffer.from(url, "base64"));
      });
    }
  };
};

export const urlHelper: UrlMock = {
  createObjectURL(buffer) {
    return buffer.toString();
  }
};

export const mockFetch = (fn: () => FetchMock) => {
  cache.mockResponseFN = fn;
  return fn;
};
