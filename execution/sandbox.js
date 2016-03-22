var vm = require('vm'),
	child_proc = require('child_process'),
	fs = require('fs');

const generated_output_folder = 'output_generated/',
	  real_output_folder = 'output_real/';

function executeTests (path, execfile, codefile, testCases, cback) {
	function verifyOutput (testcase) {
		child_proc.exec('diff ' + generated_output_folder + testcase + ' ' +
			real_output_folder + testcase, { cwd : path },
			function (err, stdout, stderr) {
				if (err) return cback('fail');
				if (stderr) return cback('fail');
				cback("equal");
			}
		);
	}
	
	testCases.forEach(function(testcase) {
		child_proc.exec(
			execfile + ' < ./tests/' + testcase + ' > ' + generated_output_folder + testcase,
			{ cwd : path }, function (err, stdout, stderr) {
				if (stderr) return cback("fail");
				if (err) return cback("fail");
				setImmediate(verifyOutput, testcase);
			}
		);
	});
}

module.exports.executeTests = executeTests;
