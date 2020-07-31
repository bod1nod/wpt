// META: global=dedicatedworker,sharedworker
setup({ allow_uncaught_exception:true });

const t0 = async_test("WorkerGlobalScope error event: error");
const t1 = async_test("WorkerGlobalScope error event: message");
const t2 = async_test("WorkerGlobalScope error event: filename");
const t3 = async_test("WorkerGlobalScope error event: lineno");

self.addEventListener("error", e => {
    t0.step_func_done(() => {
      assert_true(e.error instanceof SyntaxError, "SyntaxError");
      assert_equals(e.error.name, "SyntaxError");
    })();

    t1.step_func_done(() => {
      assert_not_equals(e.message, "Script error.",
          "e.message should not be muted to 'Script error.'");
    })();

    // filename, lineno etc. are expected to point to the location within
    // `syntax-error.js` because it is same-origin,
    // while this is not explicitly stated in the spec.
    t2.step_func_done(() => {
      assert_equals(e.filename, self.location.origin +
          '/workers/modules/resources/syntax-error.js');
    })();
    t3.step_func_done(() => {
      assert_equals(e.lineno, 1);
    })();

    // Because importScripts() throws, we call done() here.
    done();
  });

importScripts("/workers/modules/resources/syntax-error.js");
