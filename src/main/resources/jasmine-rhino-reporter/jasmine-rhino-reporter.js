importPackage(java.lang);

var RhinoReporter = function() {
	/*
	 * Reporter which reports the number of //expects// checks which
	 * passed/failed at the end of the test run 
	 */
    return {
        reportRunnerStarting: function(runner) {
            if (EnvJasmine.incrementalOutput) {
                print(EnvJasmine.specFile);
            }
        },

        reportRunnerResults: function(runner) {
            var results = runner.results();

            if (EnvJasmine.incrementalOutput) {
                var passed = results.passedCount - EnvJasmine.passedCount,
                    failed = results.failedCount - EnvJasmine.failedCount,
                    total = results.totalCount - EnvJasmine.totalCount;
                print();
                print([
                    EnvJasmine[passed ? 'green' : 'plain']("Passed: " + passed),
                    EnvJasmine[failed ? 'red' : 'plain']("Failed: " + failed),
                    EnvJasmine.plain("Total: " + total)
                ].join(' '));
            }

            EnvJasmine.passedCount = results.passedCount;
            EnvJasmine.failedCount = results.failedCount;
            EnvJasmine.totalCount = results.totalCount;
        },

        reportSuiteResults: function(suite) {
        },

        reportSpecStarting: function(spec) {
        },

        reportSpecResultsVerbose: function(spec) {
            if (spec.suite != EnvJasmine.currentSuite) {
                EnvJasmine.currentSuite = spec.suite;
                print("A " + spec.suite.getFullName());
            }
            var color = (spec.results().passed()) ? 'green' : 'red';
            print(EnvJasmine[color]("  " + spec.description));
        },

        reportSpecResults: function(spec) {
            var verbose = EnvJasmine.printAllSpecs;
            if (verbose) {
                this.reportSpecResultsVerbose(spec);
            }
            if (spec.results().passed()) {
                if (!verbose) {
                    System.out.print(EnvJasmine.green("."));
                }
            } else {
                var i, msg, result,
                    specResults = spec.results().getItems();

                if (!verbose) {
                    System.out.print(EnvJasmine.red("F"));
                }

                msg = [
                    "FAILED",
                    "File : " + EnvJasmine.specFile,
                    "Suite: " + this.getSuiteName(spec.suite),
                    "Spec : " + spec.description
                ];

                for (i = 0; i < specResults.length; i++) {
                    result = specResults[i];
                    if (result.type == 'log') {
                        msg.push(result.toString());
                    } else if (result.type == 'expect' && result.passed && !result.passed()) {
                        msg.push(result.message);

                        if (result.trace.stack) {
                            msg.push(specResults[i].trace.stack);
                        }
                    }
                }

                EnvJasmine.results.push(msg.join("\n"));
            }
        },

        log: function(str) {
        },

        getSuiteName: function(suite) {
            var suitePath = [];

            while (suite) {
                suitePath.unshift(suite.description);
                suite = suite.parentSuite;
            }

            return suitePath.join(' - ');
        }
    };
};

var RhinoSpecReporter = function() {
	/*
	 * Reporter which reports the number of //specs// which passed/failed at the end
	 * of the test run 
	 */
    return {
        reportRunnerStarting: function(runner) {
            if (EnvJasmine.incrementalOutput) {
                print(EnvJasmine.specFile);
            }
            EnvJasmine.runnerPassedCount = 0;
            EnvJasmine.runnerFailedCount = 0;
            EnvJasmine.runnerTotalCount = 0;
        },

        reportRunnerResults: function(runner) {
            var results = runner.results();

            if (EnvJasmine.incrementalOutput) {
                print([
                    EnvJasmine.green("Passed: " + EnvJasmine.runnerPassedCount),
                    EnvJasmine.red("Failed: " + EnvJasmine.runnerFailedCount),
                    EnvJasmine.plain("Total: " + EnvJasmine.runnerTotalCount)
                ].join(' '));
            }
            EnvJasmine.passedCount += EnvJasmine.runnerPassedCount;
            EnvJasmine.failedCount += EnvJasmine.runnerFailedCount;
            EnvJasmine.totalCount += EnvJasmine.runnerTotalCount;
        },

        reportSuiteResults: function(suite) {
        },

        reportSpecStarting: function(spec) {
        },

        reportSpecResultsVerbose: function(spec) {
            if (spec.suite != EnvJasmine.currentSuite) {
                EnvJasmine.currentSuite = spec.suite;
                print("A " + spec.suite.getFullName());
            }
            var color = (spec.results().passed()) ? 'green' : 'red';
            print(EnvJasmine[color]("  " + spec.description));
        },

        reportSpecResults: function(spec) {
            var verbose = EnvJasmine.printAllSpecs;
            if (verbose) {
                this.reportSpecResultsVerbose(spec);
            }
            if (spec.results().passed()) {
                if (!verbose) {
                    System.out.print(EnvJasmine.green("."));
                }
                EnvJasmine.runnerPassedCount += 1;
            } else {
                var i, msg, result,
                    specResults = spec.results().getItems();
                if (!verbose) {
                    System.out.print(EnvJasmine.red("F"));
                }

                msg = [
                    "FAILED",
                    "File : " + EnvJasmine.specFile,
                    "Suite: " + this.getSuiteName(spec.suite),
                    "Spec : " + spec.description
                ];

                for (i = 0; i < specResults.length; i++) {
                    result = specResults[i];
                    if (result.type == 'log') {
                        msg.push(result.toString());
                    } else if (result.type == 'expect' && result.passed && !result.passed()) {
                        msg.push(result.message);

                        if (result.trace.stack) {
                            msg.push(specResults[i].trace.stack);
                        }
                    }
                }
                EnvJasmine.runnerFailedCount += 1;

                EnvJasmine.results.push(msg.join("\n"));
            }
            EnvJasmine.runnerTotalCount += 1;
        },

        log: function(str) {
        },

        getSuiteName: function(suite) {
            var suitePath = [];

            while (suite) {
                suitePath.unshift(suite.description);
                suite = suite.parentSuite;
            }

            return suitePath.join(' - ');
        }
    };
};


