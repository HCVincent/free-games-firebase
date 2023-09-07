import React from "react";

type indexProps = {};

const index: React.FC<indexProps> = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-14rem)]">
      <h2 className="text-2xl">TERMS&CONDITIONS</h2>
      <ol className="mt-6 list-decimal">
        <li>
          By registering on this website user accepts our terms and conditions.
        </li>
        <li>
          If the user submitted the wrong data, this user is responsible for
          that.
        </li>
        <li>
          All copyrights of HTML games and animations belong to their authors.
          We provide just good service.
        </li>
        <li>All the games on our website are absolutely free.</li>
        <li>Terms and Conditions could be modified at any time.</li>
        <li>
          Admin reserves the right to remove a comment if it violates any of the
          rules below:
          <ul className="list-disc ml-4">
            <li>
              Racist, sexist, homophobic, or generally hate-filled comments have
              no place here.
            </li>
            <li>Respect, please.</li>
            <li>Please avoid copied and pasted material.</li>
            <li>
              Do not use inappropriate language or provide links/trackbacks to
              obscene or inappropriate content. This includes using obscenities
              as well as being just plain mean.
            </li>
            <li>
              Do not defame an individual or group, or violate any trademarks or
              copyrighted material.
            </li>
            <li>Do not violate the privacy of others.</li>
          </ul>
        </li>
      </ol>
    </div>
  );
};
export default index;
