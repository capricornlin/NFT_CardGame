import React from 'react';
import Tilt from 'react-parallax-tilt';
import Image from 'next/image';

import { allCards } from '../public/assets';

const generateRandomCardImage = () =>
  allCards[Math.floor(Math.random() * (allCards.length - 1))];

const img1 = generateRandomCardImage();
const img2 = generateRandomCardImage();

const Card = ({ card, title, restStyles, cardRef, playerTwo }) => {
  return (
    <Tilt tiltReverse={true}>
      <div ref={cardRef} className={`cardContainer ${restStyles}`}>
        <Image src={playerTwo ? img2 : img1} alt="card" className="cardImg" />
        <div className="cardPointContainer sm:left-[21.2%] left-[22%] flexCenter">
          <p className="cardPoint text-yellow-400">{card.att}</p>
        </div>
        <div className="cardPointContainer sm:right-[14.2%] right-[15%] flexCenter">
          <p className="cardPoint text-red-700">{card.def}</p>
        </div>

        <div className="cardTextContainer flexCenter">
          <p className="cardText">{title}</p>
        </div>
      </div>
    </Tilt>
  );
};

export default Card;
