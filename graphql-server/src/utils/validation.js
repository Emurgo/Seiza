// @flow
import { ConsistencyError } from "./errors";

export const validate = (cond: boolean, message: string, ctx: any) => {
  if (!cond) {
    const err = new ConsistencyError(message);
    // $FlowFixMe we are creating new property. That is fine ...
    err.ctx = ctx;
    throw err;
  }
};

export const getRunConsistencyCheck = (reportError: Function) => async (
  callback: Function
) => {
  if (process.env.NODE_ENV === "development") {
    return await callback();
  } else {
    // In production fire a runaway promise
    Promise.resolve()
      .then(() => callback())
      .catch(err => reportError(err));
    // And return early
    return Promise.resolve();
  }
};
