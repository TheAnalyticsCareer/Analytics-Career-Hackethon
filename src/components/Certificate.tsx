import React from 'react';
import companyLogo from '../image/6677da88a7c70751b1bf34a8.png';
import defaultSignature from '../image/sign.png';
import goldenBorder from '../image/—Pngtree—certificate border frame vector_14804612.png';


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
      className="w-[1000px] h-[700px] mx-auto p-10 relative font-serif bg-white shadow-2xl rounded-lg border-[20px] border-white"
     style={{
  backgroundImage: `url(${goldenBorder})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 100%',
  backgroundPosition: 'center',
}}

    >
      {/* Header */}
      <div className="text-center mb-6">
        <img
          src={companyLogo}
          alt="Company Logo"
          className="h-16 mx-auto mb-2"
        />
        <h2 className="text-md font-semibold text-blue-800 uppercase tracking-wide">
         Analytics Career - Professional Data Analysis Hackathon Platform
        </h2>
        
      </div>

      {/* Title */}
      <h1 className="text-5xl font-bold text-blue-900 text-center uppercase mb-4">
        Certificate of Completion
      </h1>

      {/* Main content */}
      <div className="text-center px-12">
        <p className="text-lg text-gray-700 mb-2">
          This certificate is proudly awarded to
        </p>
        <h2 className="text-4xl font-bold text-gray-900 mb-2">{studentName}</h2>
        <p className="text-lg text-gray-700 mb-2">
          In recognition of successfully completing the challenge:
        </p>
        <p className="text-xl font-semibold text-blue-800 mb-4 uppercase tracking-wide">
          {challengeName}
        </p>
        <p className="text-md text-gray-700 leading-relaxed">
          This accomplishment was achieved on{' '}
          <span className="font-semibold">{date || new Date().toLocaleString()}</span>.
        </p>
      </div>

      {/* Signatures */}
      <div className="flex justify-between items-center mt-15 px-12">
        <div className="flex flex-col items-center">
        
       
          <span className="text-xs text-gray-600"></span>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={signatureUrl || defaultSignature}
            alt="Signature"
            className="h-12 mb-1"
          />
          <span className="text-sm font-semibold text-gray-800 border-t border-gray-400 w-32 text-center">
            Analytics Career
          </span>
          <span className="text-xs text-gray-600">Certified Instructor</span>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-center text-sm text-gray-600 mt-7">
        This certificate was issued by <strong>Analytics Career</strong> on{' '}
        {date || new Date().toLocaleString()}.
      </p>
    </div>
  );
};

export default Certificate;
