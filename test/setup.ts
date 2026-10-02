import { afterEach, beforeEach } from "vitest";
import { start, stop } from "./stimulus.ts";

beforeEach(start);
afterEach(stop);
