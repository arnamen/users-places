import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {AuthContext} from '../../shared/context/auth-context';
import useHttpClient from '../../shared/hooks/http-hook'
import PlaceList from '../components/PlaceList';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

const UserPlaces = ( props ) => {
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [places, setPlaces] = useState();
  const auth = useContext(AuthContext);
  let userId = props.location.pathname.substr(1).split('/')[0];
  useEffect(() => {
    (async () => {
      try {
          const responseData = await sendRequest('http://80.78.240.76:5000/api/places/user/' + userId);
          setPlaces(responseData.places);
      } catch (error) {
        //console.log(error)
      }
    }
    )()
    return () => {
      
    }
  }, [sendRequest, props])
  
  const filterPlaces = (id) => {
    const filteredPlaces = places.filter((place) => {
     return place.id !== id; 
    })
    setPlaces(filteredPlaces);
  }
  
  //console.log(places)
  return (
  <React.Fragment>
    <ErrorModal error={error} onClear={clearError}/>
    {isLoading && <LoadingSpinner asOverlay/>}
    {!isLoading && places && <PlaceList items={places} currentUserId={userId} onDelete={(id) => filterPlaces(id)}/>}
  </React.Fragment>
  )
};

export default UserPlaces;
