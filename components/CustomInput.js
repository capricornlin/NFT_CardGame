import React from 'react';

const regex = /^[A-Za-z0-9]+$/;

const CustomInput = ({ Label, placeholder, value, handleValueChange }) => {
  return (
    <>
      <label htmlFor="name" className="label">
        {Label}
      </label>
      <input
        className="input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          if (e.target.value === '' || regex.test(e.target.value))
            handleValueChange(e.target.value);
        }}
      />
    </>
  );
};

export default CustomInput;
