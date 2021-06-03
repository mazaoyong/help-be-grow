module.exports = [
  ['GET', '/v4/vis/edu/page/certificate', 'ump.CertificateController', 'getIndexHtml'],
  ['GET', '/v4/vis/edu/certificate/findCertificateTemplate.json', 'ump.CertificateController', 'findCertificateTemplate'],
  ['GET', '/v4/vis/edu/certificate/getCertificateTemplate.json', 'ump.CertificateController', 'getCertificateTemplate'],
  ['POST', '/v4/vis/edu/certificate/createCertificateTemplate.json', 'ump.CertificateController', 'createCertificateTemplate'],
  ['POST', '/v4/vis/edu/certificate/updateCertificateTemplate.json', 'ump.CertificateController', 'updateCertificateTemplate'],
  ['POST', '/v4/vis/edu/certificate/deleteCertificateTemplate.json', 'ump.CertificateController', 'deleteCertificateTemplate'],
  ['POST', '/v4/vis/edu/certificate/invalidCertificateTemplate.json', 'ump.CertificateController', 'invalidCertificateTemplate'],
  ['GET', '/v4/vis/edu/certificate/findCertificate.json', 'ump.CertificateController', 'findCertificate'],
];
