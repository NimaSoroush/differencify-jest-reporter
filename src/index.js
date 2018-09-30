import fs from 'fs';
import path from 'path';
import pkgDir from 'pkg-dir';
import logger from './utils/logger';
import {
  getSnapshotPath,
  getDiffPath,
  getDiffDir,
  getSnapshotsDir,
  getCurrentImageDir,
  getCurrentImagePath,
} from './utils/paths';
import getReport from './reportTypes';

module.exports = class DifferencifyReporter {
  constructor(globalConfig = {}, options = {}) {
    this.globalConfig = globalConfig;
    // eslint-disable-next-line prefer-object-spread/prefer-object-spread
    this.options = Object.assign(
      {},
      {
        reportPath: 'differencify_reports',
        reportTypes: {
          html: 'index.html',
        },
        imageType: 'png',
        debug: true,
        isJest: true,
      },
      options,
    );
    this.resolvedReportPath = path.resolve(pkgDir.sync(), this.options.reportPath);
    if (this.options.debug === true) {
      logger.enable();
    }
  }

  getTestResults(testResults) {
    return testResults.testResults
      .map((result) => { //
        const { fullName: testName, status } = result;
        const snapshotsDir = getSnapshotsDir({ testPath: testResults.testFilePath, isJest: this.options.isJest });
        const snapshotPath = getSnapshotPath(snapshotsDir, { testName, imageType: this.options.imageType });
        const currentImageDir = getCurrentImageDir(snapshotsDir);
        const currentImagePath = getCurrentImagePath(currentImageDir, { testName, imageType: this.options.imageType });
        const diffDir = getDiffDir(snapshotsDir);
        const diffPath = getDiffPath(diffDir, { testName, imageType: this.options.imageType });
        return {
          status,
          testName,
          snapshotPath: fs.existsSync(snapshotPath) && path.relative(this.resolvedReportPath, snapshotPath),
          currentImagePath: fs.existsSync(currentImagePath) && path.relative(this.resolvedReportPath, currentImagePath),
          diffPath: fs.existsSync(diffPath) && path.relative(this.resolvedReportPath, diffPath),
        };
      })
      .filter(result => result.snapshotPath);
  }

  generate(results) {
    Object.keys(this.options.reportTypes).forEach((type) => {
      const reportFilepath = path.join(this.resolvedReportPath, this.options.reportTypes[type]);
      try {
        const report = getReport(type, results);
        fs.writeFileSync(reportFilepath, report);
        logger.log(`Generated ${type} report at ${reportFilepath}`);
      } catch (err) {
        logger.error(`Unable to generate ${type} report at ${reportFilepath}: ${err}`);
      }
    });
  }

  onRunComplete(contexts, aggregatedResults) {
    if (!fs.existsSync(this.resolvedReportPath)) {
      fs.mkdirSync(this.resolvedReportPath);
    }
    const results = aggregatedResults.testResults.reduce(
      (flattedResults, testResults) => flattedResults.concat(this.getTestResults(testResults)),
      [],
    );
    this.generate(results);
  }
};
