import React from 'react';

const CustomButton = ({ title, handleClick, restStypes }) => {
  return (
    <button type="button" className={`btn ${restStypes}`} onClick={handleClick}>
      {title}
    </button>
  );
};

export default CustomButton;
