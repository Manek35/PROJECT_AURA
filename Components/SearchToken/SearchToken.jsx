import React, { useState } from "react";
import Image from "next/image";

// INTERNAL IMPORT
import style from "./SearchToken.module.css";
import images from "../../assets";

const SearchToken = ({ openToken, tokens, tokenData }) => {
  const [active, setActive] = useState(1);

  const coin = [
    {
      img: images.ether,
      name: "ETH",
    },
    {
      img: images.ether,
      name: "BNB",
    },
    {
      img: images.ether,
      name: "USDT",
    },
    {
      img: images.ether,
      name: "MATIC",
    },
  ];

  return (
    <div className={style.SearchToken}>
      <div className={style.SearchToken_box}>
        {/* HEADER */}
        <div className={style.SearchToken_box_heading}>
          <h4>Select a token</h4>
          <Image
            src={images.close}
            alt="close"
            width={50}
            height={50}
            onClick={() => openToken(false)}
          />
        </div>

        {/* SEARCH INPUT */}
        <div className={style.SearchToken_box_search}>
          <div className={style.SearchToken_box_search_img}>
            <Image src={images.search} alt="search" width={20} height={20} />
          </div>
          <input
            type="text"
            placeholder="Search name or paste the address"
          />
        </div>

        {/* TOKEN LIST */}
        <div className={style.SearchToken_box_token}>
          {coin.map((el, i) => (
            <div
              key={i}
              className={`${style.SearchToken_box_token_item} ${
                active === i + 1 ? style.active : ""
              }`}
              onClick={() => {
                setActive(i + 1);
                tokens({ name: el.name, image: el.img }); // Pass token data to parent
                openToken(false); // Close modal after selecting
              }}
            >
              <Image
                src={el.img || images.ether}
                alt={el.name}
                width={30}
                height={30}
              />
              <span>{el.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchToken;
