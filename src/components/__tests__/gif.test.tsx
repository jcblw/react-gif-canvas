import * as React from "react";
import { shallow, mount } from "enzyme";
import { Gif } from "../gif";
import * as fs from "fs";
import * as path from "path";
import { mockFetch } from "../../test-helpers";

const CAT_GIF = fs
  .readFileSync(path.resolve(__dirname, "../../../test-assets/cat.gif"))
  .toString("base64");

describe("Gif component tests", () => {
  describe("snapshot test", () => {
    it("should match the snapshot", () => {
      const component = shallow(<Gif src={CAT_GIF} />);
      expect(component).toMatchSnapshot();
    });
  });

  it("should attempt to fetch a cat gif", () => {
    const fetchMock = jest.fn();
    mockFetch(fetchMock);
    mount(<Gif src={CAT_GIF} />);
    expect(fetchMock).toBeCalledWith(CAT_GIF);
  });

  it("should attempt to fetch get the arrayBuffer of a cat gif", () => {
    const fetchMock = jest.fn().mockResolvedValue({
      arrayBuffer: async () => {
        return Buffer.from(CAT_GIF, "base64");
      }
    });
    mockFetch(fetchMock);
    mount(<Gif src={CAT_GIF} />);
    expect(fetchMock).toBeCalledWith(CAT_GIF);
  });
});
