// import "../styles/globals.css";

// // import { NavBar } from "../Components/index";
// // import NavBar from "../Components/NavBar/NavBar";
// import NavBar from "../Components/NavBar/NavBar";

// const MyApp = ({ Component, pageProps }) => (
//   <div>
//     <NavBar />
//     <Component {...pageProps} />
//   </div>
// );

// export default MyApp;

import "../styles/globals.css";
import { NavBar } from "../Components";

const MyApp = ({ Component, pageProps }) => (
  <div>
    <NavBar />
    <Component {...pageProps} />
  </div>
);

export default MyApp;
