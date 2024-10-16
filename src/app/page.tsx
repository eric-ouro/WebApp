'use client'
import { Provider } from 'react-redux';
import { store } from './store/';
import Dash from "./components/Dash";


export default function Home() {
  return (
    <div>
      <Provider store={store}>
        <Dash/>
      </Provider>
    </div>
  );
}
