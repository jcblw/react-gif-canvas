const globalAny: any = global;

import { configure } from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import { fetchHelper, urlHelper } from "./test-helpers";
globalAny.fetch = fetchHelper;
globalAny.URL = urlHelper;

configure({ adapter: new Adapter() });
