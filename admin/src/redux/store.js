import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

import reducer from './reducer';

export const store=createStore(reducer,applyMiddleware(thunkMiddleware));
export const {dispatch}=store;
