import React, { useState,useContext} from "react";
import Image from "next/image";

// INTERNAL IMPORT
import images from "../assets";
import Style from "../styles/Pools.module.css";

import { PoolAdd,PoolConnect } from "../Components/index";
import {SwapTokenContext} from "../Context/SwapContext";

//console.debug("Direct PoolAdd import (server):", typeof PoolAdd);

const Pool = () => {
//   if (
//     !PoolAdd ||
//     (typeof PoolAdd !== "function" && typeof PoolAdd !== "object")
//   ) {
//     return (
//       <div style={{ padding: 24 }}>
//         <h1>PoolAdd component missing or invalid</h1>
//         <p>
//           Check Components/PoolAdd/PoolAdd.jsx export and avoid circular
//           imports.
//         </p>
//       </div>
//     );
//   }
  const {account,createLiquidityAndPool,tokenData,getAllLiquidity} = useContext(SwapTokenContext);
  const [closePool,setClosePool] = useState(false);
  return (
    <div className={Style.Pool}>
      {closePool?(
      <PoolAdd account={account} setClosePool={setClosePool} tokenData={tokenData} createLiquidityAndPool={createLiquidityAndPool} />
      ):(
      <PoolConnect setClosePool={setClosePool} getAllLiquidity={getAllLiquidity} account={account} />
      )}
    </div>
  );
};

export default Pool;
