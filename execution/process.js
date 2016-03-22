var child_proc = require('child_process'),
	fs = require('fs');
var sandbox = require('./sandbox');

function spawn (inputData, cback) {
	var proc,
		path = "./user/",
		codefile = "code.cpp",
		execfile = "./a.out";

	function forkReady () {
		proc = child_proc.fork('./execution/sandbox.js', [], { silent: true });
		proc.send({ lang: lang, execfile: execfile, testfiles: testfiles });
	}

	function executeReady() {
		sandbox.executeTests(path, execfile, codefile, inputData.testCases, cback);
	}

	function compileReady() {
		child_proc.exec(
				'g++'.concat(' ', codefile, ' -o ', execfile),
				{ cwd : path }, function (err, stdout, stderr) {
					if (stderr) {
						return cback(stderr);
					}
					if (err) {
						return cback(err);
					}
					//cback("success");
					setImmediate(executeReady);
				});
	}

	function customTestCaseStatus() {
		if (!inputData.customTest) return setImmediate(compileReady);
		inputData.testCases.push("customTest");
		fs.writeFile(
				path.concat('tests/', inputData.testCases[0]), inputData.customTest, function(err) {
			if (err) {
				return cback(null);
			}
			setImmediate(compileReady);
		});
	}

	fs.writeFile(path.concat(codefile), inputData.code, function(err) {
		if (err) {
			return cback(null);
		}
		setImmediate(customTestCaseStatus);
	});
}

module.exports.spawn = spawn;
