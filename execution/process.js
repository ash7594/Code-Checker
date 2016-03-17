var child_proc = require('child_process'),
	fs = require('fs');

function spawn (lang, code, customTest, cback) {
	var proc, codefile = "./users/code.cpp", testfiles = [];

	function forkReady () {
		proc = child_proc.fork('./execution/sandbox.js', [], { silent: true });
		proc.send({ lang: lang, codefile: codefile, testfiles: testfiles });
	}

	function compileReady() {
		child_proc.exec('g++ ' + codefile, function (err, stdout, stderr) {
			if (err) {
				return cback(null);
			}
			if (stderr) cback(stderr);
			else cback("success");
		});
	}

	function getTests() {
		testfiles.push("customTest");
		fs.writeFile('./users/tests/' + testfiles[0], customTest, function(err) {
			if (err) {
				return cback(null);
			}
			setImmediate(compileReady);
		});
	}

	fs.writeFile(codefile, code, function(err) {
		if (err) {
			return cback(null);
		}
		setImmediate(getTests);
	});
}

module.exports.spawn = spawn;
