import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';

import { useDispatch, useSelector } from 'react-redux';
import HomeNavigation from './HomeNavigation';
import UserNavigation from './UserNavigation';


import {
  getAllReaction,
} from '../rtk/API';
import { setReactions } from '../rtk/Reducer';

const AppNavigation = () => {

  const dispatch = useDispatch();
  const user = useSelector(state => state.app.user)
  const reactions = useSelector(state => state.app.reactions)

  useEffect(() => {
    reactions == null
      && callGetAllReaction()
  }, []);

  //call api getAllReaction
  const callGetAllReaction = async () => {
    try {
      await dispatch(getAllReaction())
        .unwrap()
        .then((response) => {
          //console.log(response.reactions)
          dispatch(setReactions(response.reactions));
        })
        .catch((error) => {
          console.log('Error:', error);
        });

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <NavigationContainer>
      {
        user ? <HomeNavigation /> : <UserNavigation />
      }
    </NavigationContainer>
  )
}

export default AppNavigation