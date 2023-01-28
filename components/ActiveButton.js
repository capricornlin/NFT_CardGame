import React from 'react';
import Image from 'next/image';

const ActiveButton = ({ imgUrl, handleClick, restStyles }) => {
  return (
    <div
      className={`gameMoveBox flexCenter glassEffect ${restStyles}`}
      onClick={handleClick}
    >
      <Image src={imgUrl} alt="active_img" className="gameMoveIcon" />
    </div>
  );
};

export default ActiveButton;
