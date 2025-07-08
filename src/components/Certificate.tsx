import React from 'react';
import companyLogo from '../image/6677da88a7c70751b1bf34a8.png';
import defaultSignature from '../image/sign.png';

interface CertificateProps {
  studentName: string;
  challengeName: string;
  signatureUrl?: string;
  date?: string;
}

const Certificate: React.FC<CertificateProps> = ({
  studentName,
  challengeName,
  signatureUrl,
  date,
}) => {
  return (
    <div
      id="certificate"
      className="w-[1000px] h-[700px] mx-auto p-10 relative font-serif bg-white border-[20px] border-transparent"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1000' height='700'%3E%3Crect x='5' y='5' width='990' height='690' rx='30' ry='30' fill='none' stroke='%230073c0' stroke-width='5'/%3E%3Ccircle cx='40' cy='40' r='10' fill='%2399cc33'/%3E%3Ccircle cx='960' cy='40' r='10' fill='%2399cc33'/%3E%3Ccircle cx='40' cy='660' r='10' fill='%2399cc33'/%3E%3Ccircle cx='960' cy='660' r='10' fill='%2399cc33'/%3E%3Cpath d='M0 0 L1000 0 L1000 700 L0 700 Z' fill='none' stroke='%23ff66cc' stroke-width='12' stroke-dasharray='25, 10'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      {/* Logo */}
      <div className="text-center mb-4">
        <img
          src={companyLogo}
          alt="Company Logo"
          className="h-16 mx-auto mb-2"
        />
        <h2 className="text-sm font-semibold text-blue-800 uppercase tracking-wide">
          OMF National Community Organization
        </h2>
        <p className="text-xs text-gray-700">
          4589 High Street, Wellington, New Zealand <br />
          124 - 456 - 467 &nbsp; afad@gmail.com
        </p>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-blue-900 text-center uppercase mb-4">
        Certificate of Completion
      </h1>

      {/* Main content */}
      <div className="text-center px-12">
        <p className="text-lg text-gray-700 mb-2">
          This certificate is hereby bestowed upon
        </p>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{studentName}</h2>
        <p className="text-lg text-gray-700 mb-2">
          For the exceptional performance that has led to the successful completion of
        </p>
        <p className="text-xl font-semibold text-blue-800 mb-2 uppercase">
          {challengeName}
        </p>
        <p className="text-md text-gray-700">
          conducted at <span className="font-semibold">Wellington Training Center</span>{' '}
          between <span className="font-semibold">March 30 to April 1, 2019</span> from{' '}
          <span className="font-semibold">8:00 AM to 4:00 PM</span>.
        </p>
      </div>

      {/* Footer signatures */}
      <div className="flex justify-between items-center mt-16 px-12">
        <div className="flex flex-col items-center">
          <img
            src={signatureUrl || defaultSignature}
            alt="Signature"
            className="h-12 mb-1"
          />
          <span className="text-sm font-semibold text-gray-800 border-t border-gray-400 w-32 text-center">
            William Smith
          </span>
          <span className="text-xs text-gray-600">Coordinator</span>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={signatureUrl || defaultSignature}
            alt="Signature"
            className="h-12 mb-1"
          />
          <span className="text-sm font-semibold text-gray-800 border-t border-gray-400 w-32 text-center">
            Jenny Woodruff
          </span>
          <span className="text-xs text-gray-600">Certified Instructor</span>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-center text-sm text-gray-600 mt-8">
        This activity was awarded by Analytics Career on{' '}
        {date || new Date().toLocaleDateString()}.
      </p>
    </div>
  );
};

export default Certificate;
