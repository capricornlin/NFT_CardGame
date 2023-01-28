import React from 'react';
import { AlertIcon } from '../public/assets';

const Alert = ({ message, type }) => {
  return (
    <div className="alertContainer flexCenter bg-white">
      <div className="alertWrapper text-black">
        <AlertIcon type={type} />
        {message}
      </div>
    </div>
  );
};

export default Alert;
