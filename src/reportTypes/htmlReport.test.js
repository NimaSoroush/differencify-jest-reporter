import getHtmlReport from './htmlReport';

const results = [
  {
    testName: 'default',
    status: 'passed',
  },
  {
    testName: 'default2',
    snapshotPath: 'default2.png',
    diffPath: 'default2.differencified.png',
    currentImagePath: 'default2.current.png',
    status: 'failed',
  },
];

describe('HTML report', () => {
  it('generates a HTML report', () => {
    const report = getHtmlReport(results);
    expect(report).toMatchSnapshot();
  });
});
