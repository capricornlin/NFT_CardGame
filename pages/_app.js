import '../styles/globals.css';
import { GlobalProvider } from '../context';
import 'react-tooltip/dist/react-tooltip.css';

function MyApp({ Component, pageProps }) {
  return (
    <GlobalProvider>
      <Component {...pageProps} />
    </GlobalProvider>
  );
}

export default MyApp;
