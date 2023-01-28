import React from 'react';
import { Tooltip } from 'react-tooltip';
import Image from 'next/image';

const healthPoints = 25;

const healthLevel = (points) =>
  points >= 12 ? 'bg-green-500' : points >= 6 ? 'bg-orange-500' : 'bg-red-500';

const marginIndexing = (index) =>
  index !== healthPoints - 1 ? 'mr-1' : 'mr-0';

const PlayerInfo = ({ player, playerIcon, mt }) => {
  // console.log(player.health);
  return (
    <div className={`flexCenter ${mt ? 'mt-4' : 'mb-4'}`}>
      <Image
        id={`Player-${mt ? '1' : '2'}`}
        data-tip
        src={playerIcon}
        alt="player2"
        className="w-14 h-14 object-contain rounded-full"
      />
      <div
        id={`Health-${mt ? '1' : '2'}`}
        data-tooltip-content={`Health: ${player?.health}`}
        className="playerHealth"
      >
        {[...Array(player.health).keys()].map((item, index) => (
          <div
            key={`player-item-${item}`}
            className={`playerHealthBar ${healthLevel(
              player.health
            )} ${marginIndexing(index)}`}
          />
        ))}
      </div>
      <div
        id={`Mana-${mt ? '1' : '2'}`}
        data-tooltip-content="Mana"
        className="flexCenter glassEffect playerMana"
      >
        {player.mana || 0}
      </div>
      <Tooltip
        anchorId={`Player-${mt ? '1' : '2'}`}
        effect="solid"
        style={{ backgroundColor: '#7f46f0' }}
        // backgroundColor="#7f46f0"
      >
        <p className="playerInfo">
          <span
            className="playerInfoSpan {
"
          >
            Name:
          </span>{' '}
          {player?.playerName}
        </p>
        <p className="playerInfo">
          <span
            className="playerInfoSpan {
"
          >
            Address:
          </span>{' '}
          {player?.playerAddress?.slice(0, 10)}
        </p>
      </Tooltip>
      <Tooltip
        anchorId={`Health-${mt ? '1' : '2'}`}
        effect="solid"
        style={{ backgroundColor: '#7f46f0' }}
      />
      <Tooltip
        anchorId={`Mana-${mt ? '1' : '2'}`}
        effect="solid"
        style={{ backgroundColor: '#7f46f0' }}
      />
    </div>
  );
};

export default PlayerInfo;
