import React from "react";
import Image from "next/image";

// INTERNAL IMPORT
import images from "../assets";
import Style from "../styles/Pools.module.css";

import PoolAdd from "../Components/PoolAdd/PoolAdd"; // direct import to isolate issue
import PoolConnect from "@/Components/PoolConnect/PoolConnect";

console.debug("Direct PoolAdd import (server):", typeof PoolAdd);

const Pool = () => {
  if (
    !PoolAdd ||
    (typeof PoolAdd !== "function" && typeof PoolAdd !== "object")
  ) {
    return (
      <div style={{ padding: 24 }}>
        <h1>PoolAdd component missing or invalid</h1>
        <p>
          Check Components/PoolAdd/PoolAdd.jsx export and avoid circular
          imports.
        </p>
      </div>
    );
  }

  return (
    <div className={Style.Pool}>
      <PoolAdd />
      <PoolConnect />
    </div>
  );
};

export default Pool;
