// import React from "react";

// import Style from "./Toggle.module.css";

// const Toggle = ({ label }) => {
//   console.log("Toggle is:", Toggle);

//   return (
//     <div className={Style.Toggle}>
//       <div className={Style.Toggle_switch_box}>
//         <input
//           type="checkbox"
//           className={Style.Toggle_checkbox}
//           name={label}
//           id={label}
//         />
//         <label className={Style.Toggle_label} htmlFor={label}>
//           <span className={Style.Toggle_inner} />
//           <span className={Style.Toggle_switch} />
//         </label>
//       </div>
//     </div>
//   );
// };

// export default Toggle;

// import React from "react";
// import Style from "./Toggle.module.css";

// const Toggle = ({ label }) => {
//   console.log("Toggle component loaded");

//   return (
//     <div className={Style.Toggle}>
//       <div className={Style.Toggle_switch_box}>
//         <input type="checkbox" className={Style.Toggle_checkbox} id={label} />
//         <label className={Style.Toggle_label} htmlFor={label}>
//           <span className={Style.Toggle_inner} />
//           <span className={Style.Toggle_switch} />
//         </label>
//       </div>
//     </div>
//   );
// };

// export default Toggle;

import React, { useState } from "react";
import Style from "./Toggle.module.css";

const Toggle = ({ label = "toggle" }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div className={Style.Toggle}>
      <div className={Style.Toggle_switch_box}>
        <input
          type="checkbox"
          className={Style.Toggle_checkbox}
          id={label}
          checked={checked}
          onChange={() => setChecked(!checked)}
        />
        <label className={Style.Toggle_label} htmlFor={label}>
          <span className={Style.Toggle_inner}></span>
          <span className={Style.Toggle_switch}></span>
        </label>
      </div>
    </div>
  );
};

export default Toggle;
