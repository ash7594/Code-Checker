var child_proc = require('child_process'),
	fs = require('fs');

function spawn (lang, code, customTest, cback) {
	var proc, path = "./users/", codefile = "code.cpp", testfiles = [],
		execfile = "a.out";

	function messageHandler(m) {

	}

	function forkReady () {
		proc = child_proc.fork('./execution/sandbox.js', [], { silent: true });
		proc.send({ lang: lang, execfile: execfile, testfiles: testfiles });
	}

	function compileReady() {
		child_proc.exec(
				'g++'.concat(' ', codefile, ' -o ', execfile),
				{ cwd : path }, function (err, stdout, stderr) {
					if (err) {
						return cback(null);
					}
					if (stderr) {
						return cback(stderr);
					}
					cback("success");
					//setImmediate(forkReady);
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

	fs.writeFile(path.concat(codefile), code, function(err) {
		if (err) {
			return cback(null);
		}
		setImmediate(getTests);
	});
}

module.exports.spawn = spawn;
